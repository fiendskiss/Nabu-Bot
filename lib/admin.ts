import "server-only";

export const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

export function isAdminEmail(email?: string | null) {
  return email?.trim().toLowerCase() === adminEmail;
}
