# Namma Class Android APK

This is an Android WebView wrapper for the published Namma Class website:
https://rajkumarsurgeon34-droid.github.io/Namma-Class/

## Build an APK using GitHub Actions (no computer/Android Studio needed)

1. Extract this ZIP on your phone.
2. In your GitHub repository `Namma-Class`, upload the contents of this folder (keep the folder structure).
3. Commit the files to the `main` branch.
4. Open the repository in your browser.
5. Tap **Actions**. If prompted, enable GitHub Actions.
6. Open the workflow **Build Namma Class Android APK** and tap **Run workflow** if it did not run automatically.
7. Wait for the green check mark, open the completed workflow run, and download the artifact named `NammaClass-debug-apk`.
8. Extract the downloaded artifact ZIP and install `app-debug.apk` on your Android phone. If Android asks, allow your browser/files app to install unknown apps.

## Important
- This is a WebView APK: it displays the published website inside an Android app. Internet access is required.
- The website must be publicly accessible for the app to load.
- This project creates a debug APK for testing, not a Play Store-signed release.
