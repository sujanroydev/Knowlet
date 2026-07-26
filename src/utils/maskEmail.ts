export default function maskEmail(email: string): string {
  const [local, domain] = email.split("@");

  if (!domain) return email;

  const maskedLocal = local
    .split("")
    .map((char, i) => i < 2 || i >= local.length - 2 ? char : "*")
    .join("");

  return `${maskedLocal}@${domain}`;
}