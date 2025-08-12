import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import path from "path";

const env = process.env.NODE_ENV || "STAGING";
dotenv.config({ path: path.join(__dirname, "..", "..", `.env.${env}`) });

const credentials = {
  apiKey: process.env.FIREBASE_PROJECT_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_PROJECT_STORAGE_BUCKET,
};

const app = initializeApp(credentials);
const auth = getAuth(app);

export default auth;
