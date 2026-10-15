export const responseSuccess = <T>(data: T) => ({
  data,
  status: true,
  message: "success",
});

export const responseError = (message?: string) => ({
  status: false,
  message: message || "error",
  data: null,
});

export const AUTH_COOKIE_NAME = "ac_";
