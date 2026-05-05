import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "REPLACE_ME_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_ME_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_ME_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_ME_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_ME_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_ME_WITH_YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
