import dotenv from "dotenv";
dotenv.config();

export const AGORA_APP_ID = process.env.AGORA_APP_ID as string;
export const AGORA_APP_CERTIFICATE = process.env
  .AGORA_APP_CERTIFICATE as string;

if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
  console.warn(
    "[agora.ts] AGORA_APP_ID / AGORA_APP_CERTIFICATE missing from .env — call token generation will fail.",
  );
}
