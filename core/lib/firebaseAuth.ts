import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from './firebaseClient';

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('reCAPTCHA solved');
      }
    });
  }
};

export const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
  setupRecaptcha();
  return signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
};

export const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
  return confirmationResult.confirm(otp);
};