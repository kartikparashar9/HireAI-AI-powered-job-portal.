import googleClient from "../../config/google.js";
import ApiError from "../../utils/ApiError.js";

const verifyGoogleIdToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClient._clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new ApiError(401, "Invalid Google account");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture || null,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid Google token");
  }
};

export default verifyGoogleIdToken;
