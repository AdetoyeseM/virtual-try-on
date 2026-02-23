import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Initialize the Google Gen AI client with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define the model ID for Gemini 2.0 Flash experimental
const MODEL_ID = "gemini-2.0-flash-exp";

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY environment variable." },
      { status: 500 }
    );
  }

  let formData;
  try {
    formData = await req.formData();
  } catch (formError) {
    return NextResponse.json(
      {
        error: "Invalid request body: Failed to parse FormData.",
        details: formError instanceof Error ? formError.message : String(formError),
      },
      { status: 400 }
    );
  }

  try {
    const userImageFile = formData.get("userImage") as File | null;
    const clothingImageFile = formData.get("clothingImage") as File | null;

    if (!userImageFile || !clothingImageFile) {
      return NextResponse.json(
        { error: "Both userImage and clothingImage files are required" },
        { status: 400 }
      );
    }

    const detailedPrompt = `
      Objective: Generate a photorealistic virtual try-on image.
      Task: High-Fidelity Virtual Try-On with Identity Preservation.
      
      Instructions:
      1. Isolate the clothing from the second image.
      2. Keep the person's face, skin tone, and pose perfectly from the first image.
      3. Place the clothing from the second image onto the person in the first image.
      4. Generate a completely new, clean background.
      5. Output ONLY the resulting image.
    `;

    // --- Convert Files to Base64 ---
    const userImageBuffer = await userImageFile.arrayBuffer();
    const userImageBase64 = arrayBufferToBase64(userImageBuffer);
    const userImageMimeType = userImageFile.type || "image/jpeg";

    const clothingImageBuffer = await clothingImageFile.arrayBuffer();
    const clothingImageBase64 = arrayBufferToBase64(clothingImageBuffer);
    const clothingImageMimeType = clothingImageFile.type || "image/png";

    const generationConfig = {
      response_modalities: ["text", "image"],
    } as unknown as NonNullable<
      Parameters<typeof genAI.getGenerativeModel>[0]["generationConfig"]
    >;

    // --- Generate the content using @google/generative-ai ---
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      generationConfig,
    });

    const result = await model.generateContent([
      detailedPrompt,
      {
        inlineData: {
          mimeType: userImageMimeType,
          data: userImageBase64,
        },
      },
      {
        inlineData: {
          mimeType: clothingImageMimeType,
          data: clothingImageBase64,
        },
      },
    ]);

    const response = await result.response;
    const parts = response.candidates?.[0]?.content?.parts;

    let imageData = null;
    let imageMimeType = "image/png";
    let textResponse = "";

    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          imageMimeType = part.inlineData.mimeType || "image/png";
        } else if (part.text) {
          textResponse += part.text;
        }
      }
    }

    if (!imageData) {
      // If no image part found, it might be due to safety filters or quota limit: 0
      console.log("No image data in response. Raw text response:", textResponse);
      throw new Error("AI did not generate an image. This often happens if image generation is restricted in your region (UK/EU). Try using a US-based VPN.");
    }

    return NextResponse.json({
      image: `data:${imageMimeType};base64,${imageData}`,
      description: textResponse || "Virtual try-on completed.",
    });

  } catch (error: unknown) {
    console.error("Error processing virtual try-on request:", error);
    const errorStatus =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined;

    // Check for 429 Resource Exhausted (which includes the limit: 0 case)
    if ((error instanceof Error && error.message.includes("429")) || errorStatus === 429) {
      return NextResponse.json(
        {
          error: "Quota Exceeded or Regional Restriction",
          details: "Your API key is being rate-limited or image generation is blocked in your region (UK/EU). Please try using a US-based VPN.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process virtual try-on request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
