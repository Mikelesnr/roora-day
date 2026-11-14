import { createHmac } from "crypto";
import { cookies } from "next/headers";
export const adminToken = () =>
  createHmac("sha256", process.env.SESSION_SECRET || "dev").update(process.env.ADMIN_PASSWORD || "").digest("hex");
export const isAdmin = () => cookies().get("admin")?.value === adminToken();
