import Profile from "../../models/Profile.js";
import ApiError from "../../utils/ApiError.js";

const calculateProfileCompletion = (profile) => {
  const checks = [
    Boolean(profile.phone),
    Boolean(profile.headline),
    Boolean(profile.about),
    Boolean(profile.location),
    Array.isArray(profile.skills) && profile.skills.length > 0,
    Array.isArray(profile.experience) && profile.experience.length > 0,
    Array.isArray(profile.education) && profile.education.length > 0,
    Boolean(profile.socialLinks?.linkedin),
    Boolean(profile.socialLinks?.github),
  ];

  const completedFields = checks.filter(Boolean).length;

  return Math.round((completedFields / checks.length) * 100);
};

const updateCompletion = (profile) => {
  profile.profileCompletion = calculateProfileCompletion(profile);
  return profile;
};

const createProfile = async (userId, profileData) => {
  const existingProfile = await Profile.findOne({ user: userId });

  if (existingProfile) {
    throw new ApiError(409, "Profile already exists");
  }

  const profile = new Profile({
    user: userId,
    ...profileData,
  });

  updateCompletion(profile);

  await profile.save();

  return getProfileByUserId(userId);
};

const getProfileByUserId = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).populate(
    "user",
    "name email role avatar isEmailVerified",
  );

  return profile;
};

const updateProfile = async (userId, profileData) => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const allowedFields = [
    "phone",
    "headline",
    "about",
    "location",
    "skills",
    "experience",
    "education",
    "socialLinks",
  ];

  allowedFields.forEach((field) => {
    if (profileData[field] !== undefined) {
      profile[field] = profileData[field];
    }
  });

  updateCompletion(profile);

  await profile.save();

  return getProfileByUserId(userId);
};

const deleteProfile = async (userId) => {
  const profile = await Profile.findOneAndDelete({
    user: userId,
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

export {
  calculateProfileCompletion,
  createProfile,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
};
