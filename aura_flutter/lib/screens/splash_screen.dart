// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'webview_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToHome();
  }

  _navigateToHome() async {
    await Future.delayed(const Duration(seconds: 3));
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => const WebViewScreen(
          url: 'https://virtual-try-on-z58q.vercel.app/',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          color: Color(0xFF050505),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(),
            // Logo
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF4F46E5).withOpacity(0.1),
                borderRadius: BorderRadius.circular(24),
                border:
                    Border.all(color: const Color(0xFF4F46E5).withOpacity(0.2)),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF4F46E5).withOpacity(0.2),
                    blurRadius: 40,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: const Icon(
                Icons.auto_fix_high,
                size: 64,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 24),
            // App Name
            Text(
              'Aura Studio',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.5,
                foreground: Paint()
                  ..shader = const LinearGradient(
                    colors: [Colors.white, Colors.white60],
                  ).createShader(const Rect.fromLTWH(0, 0, 200, 70)),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Virtual Try-On',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 16,
              ),
            ),
            const Spacer(),
            const SpinKitPulse(
              color: Color(0xFF4F46E5),
              size: 50.0,
            ),
            const SizedBox(height: 50),
          ],
        ),
      ),
    );
  }
}
