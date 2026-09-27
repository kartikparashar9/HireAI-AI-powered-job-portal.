import Interview from "../../models/Interview.js";
import Application from "../../models/Application.js";
import Job from "../../models/Job.js";
import ApiError from "../../utils/ApiError.js";

import { INTERVIEW_STATUSES } from "../../constants/interviewStatus.js";

import { createNotification } from "../notifications/notification.service.js";

const createInterview = async (
  recruiterId,
  {
    application: applicationId,
    type,
    scheduledAt,
    durationMinutes = 30,
    meetingLink = "",
    location = "",
    notes = "",
  },
) => {
  const application = await Application.findById(applicationId).populate(
    "job",
    "recruiter status",
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.job.recruiter.toString() !== recruiterId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to schedule an interview for this application",
    );
  }

  if (["REJECTED", "WITHDRAWN"].includes(application.status)) {
    throw new ApiError(
      400,
      `Cannot schedule interview for an application with status ${application.status}`,
    );
  }

  const existingInterview = await Interview.findOne({
    application: applicationId,
  });

  if (existingInterview) {
    throw new ApiError(409, "An interview already exists for this application");
  }

  const interviewDate = new Date(scheduledAt);

  if (interviewDate <= new Date()) {
    throw new ApiError(
      400,
      "Interview must be scheduled for a future date and time",
    );
  }

  if (type === "VIDEO" && !meetingLink) {
    throw new ApiError(400, "Meeting link is required for video interviews");
  }

  if (type === "IN_PERSON" && !location) {
    throw new ApiError(400, "Location is required for in-person interviews");
  }

  const interview = await Interview.create({
    application: applicationId,
    job: application.job._id,
    candidate: application.candidate,
    recruiter: recruiterId,
    type,
    scheduledAt: interviewDate,
    durationMinutes,
    meetingLink,
    location,
    notes,
    status: INTERVIEW_STATUSES.SCHEDULED,
    statusUpdatedAt: new Date(),
  });

  await createNotification({
    userId: application.candidate,
    type: "INTERVIEW_SCHEDULED",
    title: "Interview Scheduled",
    message: `An interview has been scheduled for your application on ${interviewDate.toLocaleString()}.`,
    relatedId: interview._id,
    relatedType: "INTERVIEW",
  });

  return interview;
};

const getMyInterviews = async (userId, role) => {
  const filter =
    role === "JOB_SEEKER" ? { candidate: userId } : { recruiter: userId };

  return Interview.find(filter)
    .populate({
      path: "job",
      select: "title location jobType workMode company",
      populate: {
        path: "company",
        select: "name logo website location",
      },
    })
    .populate("candidate", "name email avatar")
    .populate("recruiter", "name email avatar")
    .populate("application", "status coverLetter appliedAt")
    .sort({
      scheduledAt: 1,
    });
};

const getInterviewById = async (userId, role, interviewId) => {
  const filter =
    role === "JOB_SEEKER"
      ? {
          _id: interviewId,
          candidate: userId,
        }
      : {
          _id: interviewId,
          recruiter: userId,
        };

  const interview = await Interview.findOne(filter)
    .populate({
      path: "job",
      select: "title description location jobType workMode company",
      populate: {
        path: "company",
        select: "name logo website industry location",
      },
    })
    .populate("candidate", "name email avatar")
    .populate("recruiter", "name email avatar")
    .populate("application", "status coverLetter appliedAt");

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  return interview;
};

const updateInterview = async (recruiterId, interviewId, updateData) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    recruiter: recruiterId,
  });

  if (!interview) {
    throw new ApiError(
      404,
      "Interview not found or you are not authorized to update it",
    );
  }

  if (
    [
      INTERVIEW_STATUSES.CANCELLED,
      INTERVIEW_STATUSES.COMPLETED,
      INTERVIEW_STATUSES.DECLINED,
    ].includes(interview.status)
  ) {
    throw new ApiError(
      400,
      `Interview cannot be updated because it is already ${interview.status.toLowerCase()}`,
    );
  }

  if (updateData.scheduledAt) {
    const interviewDate = new Date(updateData.scheduledAt);

    if (interviewDate <= new Date()) {
      throw new ApiError(
        400,
        "Interview must be scheduled for a future date and time",
      );
    }

    interview.scheduledAt = interviewDate;

    interview.status = INTERVIEW_STATUSES.RESCHEDULED;
  }

  if (updateData.type !== undefined) {
    interview.type = updateData.type;
  }

  if (updateData.durationMinutes !== undefined) {
    interview.durationMinutes = updateData.durationMinutes;
  }

  if (updateData.meetingLink !== undefined) {
    interview.meetingLink = updateData.meetingLink;
  }

  if (updateData.location !== undefined) {
    interview.location = updateData.location;
  }

  if (updateData.notes !== undefined) {
    interview.notes = updateData.notes;
  }

  if (updateData.status) {
    interview.status = updateData.status;
  }

  if (interview.type === "VIDEO" && !interview.meetingLink) {
    throw new ApiError(400, "Meeting link is required for video interviews");
  }

  if (interview.type === "IN_PERSON" && !interview.location) {
    throw new ApiError(400, "Location is required for in-person interviews");
  }

  interview.statusUpdatedAt = new Date();

  await interview.save();

  await createNotification({
    userId: interview.candidate,
    type: "INTERVIEW_UPDATED",
    title: "Interview Updated",
    message:
      interview.status === INTERVIEW_STATUSES.RESCHEDULED
        ? `Your interview has been rescheduled to ${interview.scheduledAt.toLocaleString()}.`
        : "Your interview details have been updated.",
    relatedId: interview._id,
    relatedType: "INTERVIEW",
  });

  return interview;
};

const updateInterviewByCandidate = async (candidateId, interviewId, status) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    candidate: candidateId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (
    [
      INTERVIEW_STATUSES.CANCELLED,
      INTERVIEW_STATUSES.COMPLETED,
      INTERVIEW_STATUSES.DECLINED,
    ].includes(interview.status)
  ) {
    throw new ApiError(
      400,
      `Interview cannot be updated because it is already ${interview.status.toLowerCase()}`,
    );
  }

  if (
    ![INTERVIEW_STATUSES.CONFIRMED, INTERVIEW_STATUSES.DECLINED].includes(
      status,
    )
  ) {
    throw new ApiError(
      400,
      "Candidate can only confirm or decline an interview",
    );
  }

  interview.status = status;

  interview.statusUpdatedAt = new Date();

  await interview.save();

  return interview;
};

const cancelInterview = async (userId, role, interviewId) => {
  const filter =
    role === "JOB_SEEKER"
      ? {
          _id: interviewId,
          candidate: userId,
        }
      : {
          _id: interviewId,
          recruiter: userId,
        };

  const interview = await Interview.findOne(filter);

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (
    [INTERVIEW_STATUSES.CANCELLED, INTERVIEW_STATUSES.COMPLETED].includes(
      interview.status,
    )
  ) {
    throw new ApiError(
      400,
      `Interview is already ${interview.status.toLowerCase()}`,
    );
  }

  interview.status = INTERVIEW_STATUSES.CANCELLED;

  interview.statusUpdatedAt = new Date();

  await interview.save();

  if (role !== "JOB_SEEKER") {
    await createNotification({
      userId: interview.candidate,
      type: "INTERVIEW_CANCELLED",
      title: "Interview Cancelled",
      message: "Your scheduled interview has been cancelled.",
      relatedId: interview._id,
      relatedType: "INTERVIEW",
    });
  }

  return interview;
};

const completeInterview = async (recruiterId, interviewId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    recruiter: recruiterId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (
    [
      INTERVIEW_STATUSES.CANCELLED,
      INTERVIEW_STATUSES.DECLINED,
      INTERVIEW_STATUSES.COMPLETED,
    ].includes(interview.status)
  ) {
    throw new ApiError(
      400,
      `Interview cannot be completed because it is already ${interview.status.toLowerCase()}`,
    );
  }

  interview.status = INTERVIEW_STATUSES.COMPLETED;

  interview.statusUpdatedAt = new Date();

  await interview.save();

  return interview;
};

export {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewByCandidate,
  cancelInterview,
  completeInterview,
};