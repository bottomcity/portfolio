export function setTokenInCookie(
  cookieStr: string,
  key: string,
  newValue: string,
) {
  const regex = new RegExp(`${key}=([^;]+)`);
  const newCookieStr = cookieStr.replace(regex, `${key}=${newValue}`);
  return newCookieStr;
}
