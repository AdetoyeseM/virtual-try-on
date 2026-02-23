# Aura Studio Mobile (Flutter)

This is a premium Flutter wrapper for the Aura Virtual Try-On Studio.

## Prerequisites

1.  **Flutter SDK**: Ensure you have Flutter installed (`flutter --version`).
2.  **WebView Package**: This app uses `webview_flutter`.
3.  **Vercel URL**: Update the URL in `lib/screens/splash_screen.dart` to your live Vercel deployment.

## Getting Started

1.  **Install dependencies**:
    ```bash
    flutter pub get
    ```

2.  **Run the app**:
    ```bash
    flutter run
    ```

## Camera Permissions (Important)

### Android
Add this to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA" />
```

### iOS
Add this to `ios/Runner/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera for virtual try-on.</string>
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

## Vercel Deployment Instructions

1.  **Push your current project** to GitHub.
2.  **Go to Vercel**: Connect your repo.
3.  **Add Environment Variables**:
    - `GEMINI_API_KEY`: [Your Key]
4.  **Deploy**: Once deployed, copy the URL and paste it into `splash_screen.dart`.
