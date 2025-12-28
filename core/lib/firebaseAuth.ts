import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from './firebaseClient';

// 1. Fix TypeScript error by extending the Window interface
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export const setupRecaptcha = () => {
  // 2. Prevent running on Server-Side (Next.js SSR)
  if (typeof window === 'undefined') return;

  // 3. Check if the DOM element actually exists before attaching
  const recaptchaContainer = document.getElementById('sign-in-button');
  
  if (!recaptchaContainer) {
    console.error("DOM element 'sign-in-button' not found. Make sure the component is mounted.");
    return;
  }

  // 4. Prevent Double Initialization (React Strict Mode / Re-renders)
  if (!window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        'size': 'invisible',
        'callback': () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired. User needs to re-verify.');
          // Optional: reset logic here
        }
      });
    } catch (error) {
      console.error("Error initializing Recaptcha:", error);
      // If it fails (e.g., already rendered), clear it so we can try again
      window.recaptchaVerifier = undefined;
    }
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