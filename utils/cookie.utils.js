// cookie utils

import { config } from "../config/env.config.js";

export const getCookieOptions = (expiresIn) => {
  return {
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
  };
};

const getAccessTokenCookieOptions = () => {
  return getCookieOptions(config.jwt.accessToken.expiresIn);
};

const getRefreshTokenCookieOptions = (expiryDate) => {
  const expiresIn = expiryDate
    ? expiryDate.getTime() - Date.now()
    : config.jwt.refreshToken.expiresIn;
  return getCookieOptions(expiresIn);
};

const getCookieClearingOptions = () => {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
  };
};

const getCookieClearingOptionsV5 = () => {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    // Note: no expires property - Express 5.0 will automatically
    // set cookies to expire immediately when using res.clearCookie()
  };
};

export {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getCookieClearingOptions,
  getCookieClearingOptionsV5,
};
