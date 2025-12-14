export type UserRole = "admin" | "leder" | "leser";

const ADMINS = new Set(["bedy002@egms.no", "admin@echomedic.no"]);
const READERS = new Set(["bruker@echomedic.no"]);

export function roleFromEmail(email: string | null | undefined): UserRole {
  if (!email) return "leser";
  if (ADMINS.has(email)) return "admin";
  if (READERS.has(email)) return "leser";
  return "leder";
}
