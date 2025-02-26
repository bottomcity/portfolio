export function extractToken(cookieStr: string, key: string) {
  const regex = new RegExp(`${key}=([^;]+)`);
  const match = cookieStr.match(regex);
  return match ? match[1] : null;
}
