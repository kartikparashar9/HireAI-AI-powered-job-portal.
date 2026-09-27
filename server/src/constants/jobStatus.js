const JOB_STATUSES = Object.freeze({
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
});

const JOB_STATUS_VALUES = Object.values(JOB_STATUSES);

export { JOB_STATUSES, JOB_STATUS_VALUES };