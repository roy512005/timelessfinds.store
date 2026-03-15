import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

let auth: any = null;
let analytics: any = null;

// Only initialize Firebase Auth if a real API Key is provided.
// This prevents the SDK from eagerly pinging identitytoolkit (and throwing 400 errors) on boot when using local test modes.
if (typeof window !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "dummy_api_key") {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);

    // Enable seamless integration testing mode for mock phone numbers
    // This disables the mandatory reCAPTCHA requirement so test numbers instantly process 
    // without triggering BILLING_NOT_ENABLED or captcha challenges.
    if (process.env.NODE_ENV === 'development') {
        auth.settings.appVerificationDisabledForTesting = true;
    }

    // Initialize Analytics if supported
    isSupported().then(supported => {
        if (supported) analytics = getAnalytics(app);
    });
} else {
    // Empty duck-typed object so imports in login/page don't crash
    auth = { dummy: true };
}

export { auth, analytics };
