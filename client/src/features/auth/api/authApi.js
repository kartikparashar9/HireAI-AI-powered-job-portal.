import Api from "../../../api/Api";

const register = async (userData) => {
  const response = await Api.post("/auth/signup", userData);

  return response.data;
};

const login = async (credentials) => {
  const response = await Api.post("/auth/login", credentials);

  return response.data;
};

const googleLogin = async (credential) => {
  const response = await Api.post("/auth/google", {
    credential,
  });

  return response.data;
};

const logout = async () => {
  const response = await Api.post("/auth/logout");

  return response.data;
};

const getCurrentUser = async () => {
  const response = await Api.get("/auth/me");

  return response.data;
};

const refreshToken = async () => {
  const response = await Api.post("/auth/refresh");

  return response.data;
};

const verifyEmail = async (token) => {
  const response = await Api.post("/auth/verify-email", {
    token,
  });

  return response.data;
};

const resendVerification = async (email) => {
  const response = await Api.post("/auth/resend-verification", {
    email,
  });

  return response.data;
};

const forgotPassword = async (email) => {
  const response = await Api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

const resetPassword = async (token, password) => {
  const response = await Api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
};

const changePassword = async (currentPassword, newPassword) => {
  const response = await Api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

const authApi = {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
};

export default authApi;