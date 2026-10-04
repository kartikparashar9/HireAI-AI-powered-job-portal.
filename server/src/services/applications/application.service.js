import Application from "../../models/Application.js";
import Job from "../../models/Job.js";
import Resume from "../../models/Resume.js";
import ApiError from "../../utils/ApiError.js";

import { APPLICATION_STATUSES } from "../../constants/applicationStatus.js";
import { createNotification } from "../notifications/notification.service.js";

const applyToJob = async (
  candidateId,
  jobId,
  { resume = null, coverLetter = "" },
) => {
  const job = await Job.findOne({
    _id: jobId,
    status: "OPEN",
  });

  if (!job) {
    throw new ApiError(
      404,
      "Job not found or is no longer accepting applications",
    );
  }

  if (
    job.applicationDeadline &&
    new Date(job.applicationDeadline) < new Date()
  ) {
    throw new ApiError(400, "Application deadline has passed");
  }

  const existingApplication = await Application.findOne({
    job: jobId,
    candidate: candidateId,
  });

  if (existingApplication) {
    throw new ApiError(409, "You have already applied to this job");
  }

  if (resume) {
    const candidateResume = await Resume.findOne({
      _id: resume,
      user: candidateId,
    });

    if (!candidateResume) {
      throw new ApiError(403, "You can only use your own resume");
    }
  }

  const application = await Application.create({
    job: jobId,
    candidate: candidateId,
    resume,
    coverLetter,
    status: APPLICATION_STATUSES.APPLIED,
    appliedAt: new Date(),
    statusUpdatedAt: new Date(),
  });

  await createNotification({
    userId: job.recruiter,
    type: "APPLICATION_STATUS",
    title: "New Job Application",
    message: "A candidate has applied to your job.",
    relatedId: application._id,
    relatedType: "APPLICATION",
  });

  return application;
};

const getMyApplications = async (candidateId) => {
  return Application.find({
    candidate: candidateId,
  })
    .populate({
      path: "job",
      select:
        "title location jobType workMode salaryMin salaryMax status applicationDeadline",
      populate: {
        path: "company",
        select: "name logo website location",
      },
    })
    .populate("resume", "title fileName fileType fileUrl isPrimary")
    .sort({ createdAt: -1 });
};

const getApplicationById = async (candidateId, applicationId) => {
  const application = await Application.findOne({
    _id: applicationId,
    candidate: candidateId,
  })
    .populate({
      path: "job",
      populate: {
        path: "company",
        select: "name logo website location",
      },
    })
    .populate("resume", "title fileName fileType fileUrl isPrimary");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return application;
};

const withdrawApplication = async (candidateId, applicationId) => {
  const application = await Application.findOne({
    _id: applicationId,
    candidate: candidateId,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (
    [
      APPLICATION_STATUSES.REJECTED,
      APPLICATION_STATUSES.HIRED,
      APPLICATION_STATUSES.WITHDRAWN,
    ].includes(application.status)
  ) {
    throw new ApiError(
      400,
      `Application cannot be withdrawn because it is already ${application.status.toLowerCase()}`,
    );
  }

  application.status = APPLICATION_STATUSES.WITHDRAWN;
  application.statusUpdatedAt = new Date();

  await application.save();

  return application;
};

const getJobApplications = async (recruiterId, jobId) => {
  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
  });

  if (!job) {
    throw new ApiError(
      404,
      "Job not found or you are not authorized to view its applications",
    );
  }

  return Application.find({
    job: jobId,
  })
    .populate("candidate", "name email avatar")
    .populate("resume", "title fileName fileType fileUrl isPrimary")
    .sort({ createdAt: -1 });
};

/*
|--------------------------------------------------------------------------
| GET SHORTLISTED APPLICATIONS
|--------------------------------------------------------------------------
| Returns only shortlisted applications belonging to jobs
| owned by the currently authenticated recruiter.
|
| This is used by the recruiter when scheduling an interview.
*/
const getShortlistedApplications = async (recruiterId) => {
  const recruiterJobs = await Job.find({
    recruiter: recruiterId,
  }).select("_id");

  const jobIds = recruiterJobs.map((job) => job._id);

  if (!jobIds.length) {
    return [];
  }

  return Application.find({
    job: {
      $in: jobIds,
    },
    status: APPLICATION_STATUSES.SHORTLISTED,
  })
    .populate({
      path: "job",
      select:
        "title location jobType workMode salaryMin salaryMax status applicationDeadline company",
      populate: {
        path: "company",
        select: "name logo website location",
      },
    })
    .populate("candidate", "name email avatar")
    .populate("resume", "title fileName fileType fileUrl isPrimary")
    .sort({
      statusUpdatedAt: -1,
      createdAt: -1,
    });
};

const updateApplicationStatus = async (
  recruiterId,
  applicationId,
  status,
  recruiterNote = "",
) => {
  const application = await Application.findById(applicationId).populate(
    "job",
    "recruiter title",
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.job.recruiter.toString() !== recruiterId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to manage this application",
    );
  }

  const currentStatus = application.status;

  const allowedTransitions = {
    [APPLICATION_STATUSES.APPLIED]: [
      APPLICATION_STATUSES.SHORTLISTED,
      APPLICATION_STATUSES.REJECTED,
    ],

    [APPLICATION_STATUSES.SHORTLISTED]: [
      APPLICATION_STATUSES.HIRED,
      APPLICATION_STATUSES.REJECTED,
    ],
  };

  const allowedNextStatuses = allowedTransitions[currentStatus] || [];

  if (!allowedNextStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Cannot change application status from ${currentStatus} to ${status}`,
    );
  }

  application.status = status;
  application.recruiterNote = recruiterNote;
  application.statusUpdatedAt = new Date();

  await application.save();

  await createNotification({
    userId: application.candidate,
    type: "APPLICATION_STATUS",
    title: "Application Status Updated",
    message: `Your application for "${application.job.title}" has been ${status.toLowerCase()}.`,
    relatedId: application._id,
    relatedType: "APPLICATION",
  });

  return application;
};

export {
  applyToJob,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  getJobApplications,
  getShortlistedApplications,
  updateApplicationStatus,
};
