import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

async function cleanupTestUserData() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing required environment variables");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("user_id", process.env.E2E_USERNAME_ID);

  if (error) {
    console.error("Error cleaning up test user data:", error);
    throw error;
  }
}

export default cleanupTestUserData;
