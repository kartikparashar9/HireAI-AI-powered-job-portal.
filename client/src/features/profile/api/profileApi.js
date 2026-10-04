import Api from "../../../api/Api";

const getMyProfile = async () => {
  const response = await Api.get("/profile/me");
  return response.data;
};

const createProfile = async (profileData) => {
  const response = await Api.post("/profile", profileData);
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await Api.patch("/profile/me", profileData);
  return response.data;
};

const deleteProfile = async () => {
  const response = await Api.delete("/profile/me");
  return response.data;
};

export default {
  getMyProfile,
  createProfile,
  updateProfile,
  deleteProfile,
};