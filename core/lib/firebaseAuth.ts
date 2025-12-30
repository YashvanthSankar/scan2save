import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from './firebaseClient';

// 1. Fix TypeScript error by extending the Window interface
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export const clearRecaptcha = () => {
  if (typeof window !== 'undefined' && window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn("Failed to clear recaptcha", e);
    }
    window.recaptchaVerifier = undefined;
  }
};

export const setupRecaptcha = () => {
  // 2. Prevent running on Server-Side (Next.js SSR)
  if (typeof window === 'undefined') return;

  // 3. Check if the DOM element actually exists before attaching
  const recaptchaContainer = document.getElementById('sign-in-button');

  if (!recaptchaContainer) {
    console.error("DOM element 'sign-in-button' not found. Make sure the component is mounted.");
    return;
  }

  // 4. Always clear old instance if it exists to prevent stale DOM bindings on re-renders
  // This is critical for Single Page Apps (SPA) navigation
  if (window.recaptchaVerifier) {
    clearRecaptcha();
  }

  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      'size': 'invisible',
      'callback': () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired. User needs to re-verify.');
      }
    });
  } catch (error) {
    console.error("Error initializing Recaptcha:", error);
  }
};

export const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
  // Always ensure setup is run before sending
  setupRecaptcha();

  if (!window.recaptchaVerifier) {
    throw new Error("RecaptchaVerifier not initialized");
  }

  // 5. Reset the widget if it was already used/rendered to avoid "reCAPTCHA has already been rendered" error
  // This is crucial for retries
  try {
    // Some versions of Firebase require rendering first to clear state
    await window.recaptchaVerifier.render();
  } catch (e) {
    // If it's already rendered, that's fine, we continue
  }

  return signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
};

export const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
  return confirmationResult.confirm(otp);
};