import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../notificationSlice";

/* =========================================================
   Helpers
========================================================= */

const getNotificationIcon = (type) => {
  switch (type) {
    case "APPLICATION_STATUS":
      return "✓";

    case "INTERVIEW_SCHEDULED":
      return "◷";

    case "INTERVIEW_UPDATED":
      return "↻";

    case "INTERVIEW_CANCELLED":
      return "×";

    case "JOB_RECOMMENDATION":
      return "⌕";

    case "RESUME_ANALYSIS":
      return "✦";

    case "SYSTEM":
      return "⚙";

    default:
      return "•";
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case "APPLICATION_STATUS":
      return "#16a34a";

    case "INTERVIEW_SCHEDULED":
      return "#2563eb";

    case "INTERVIEW_UPDATED":
      return "#7c3aed";

    case "INTERVIEW_CANCELLED":
      return "#dc2626";

    case "JOB_RECOMMENDATION":
      return "#ea580c";

    case "RESUME_ANALYSIS":
      return "#0891b2";

    case "SYSTEM":
      return "#475569";

    default:
      return "#64748b";
  }
};

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = now.getTime() - notificationDate.getTime();

  const minute = 60 * 1000;

  const hour = 60 * minute;

  const day = 24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    const minutes = Math.floor(difference / minute);

    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (difference < day) {
    const hours = Math.floor(difference / hour);

    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (difference < 7 * day) {
    const days = Math.floor(difference / day);

    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return notificationDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   Component
========================================================= */

const Notifications = () => {
  const dispatch = useDispatch();

  const {
    notifications,
    pagination,
    unreadCount,
    loading,
    markReadLoadingId,
    markAllReadLoading,
    deleteLoadingId,
    error,
  } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(
      fetchNotifications({
        page: 1,
        limit: 20,
      }),
    );
  }, [dispatch]);

  const hasUnread = unreadCount > 0;

  const notificationCountText = useMemo(() => {
    const total = pagination?.total ?? 0;

    if (total === 0) {
      return "No notifications";
    }

    if (total === 1) {
      return "1 notification";
    }

    return `${total} notifications`;
  }, [pagination?.total]);

  const handleMarkAsRead = (notification) => {
    if (notification.isRead || markReadLoadingId === notification._id) {
      return;
    }

    dispatch(markNotificationAsRead(notification._id));
  };

  const handleDelete = (notificationId) => {
    if (deleteLoadingId === notificationId) {
      return;
    }

    dispatch(deleteNotification(notificationId));
  };

  const handleMarkAllAsRead = () => {
    if (!hasUnread || markAllReadLoading) {
      return;
    }

    dispatch(markAllNotificationsAsRead());
  };

  const handleNextPage = () => {
    if (loading || pagination?.page >= pagination?.totalPages) {
      return;
    }

    dispatch(
      fetchNotifications({
        page: pagination.page + 1,
        limit: pagination.limit || 20,
      }),
    );
  };

  const handlePreviousPage = () => {
    if (loading || pagination?.page <= 1) {
      return;
    }

    dispatch(
      fetchNotifications({
        page: pagination.page - 1,
        limit: pagination.limit || 20,
      }),
    );
  };

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* =================================================
            Header
        ================================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#6366f1",
              }}
            >
              NOTIFICATIONS
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(24px, 4vw, 32px)",
                lineHeight: 1.2,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Your Notifications
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {notificationCountText}
              {hasUnread && ` • ${unreadCount} unread`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={!hasUnread || markAllReadLoading}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "11px 16px",
              background: hasUnread ? "#4f46e5" : "#e2e8f0",
              color: hasUnread ? "#ffffff" : "#94a3b8",
              fontSize: "14px",
              fontWeight: 600,
              cursor: hasUnread ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            {markAllReadLoading ? "Marking..." : "Mark all as read"}
          </button>
        </div>

        {/* =================================================
            Error
        ================================================= */}

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            Loading
        ================================================= */}

        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{
                  height: "92px",
                  borderRadius: "14px",
                  background: "#e2e8f0",
                  animation: "notificationPulse 1.4s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* =================================================
            Empty State
        ================================================= */}

        {!loading && notifications.length === 0 && (
          <div
            style={{
              padding: "64px 24px",
              textAlign: "center",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "#eef2ff",
                color: "#4f46e5",
                fontSize: "26px",
              }}
            >
              🔔
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "20px",
                color: "#0f172a",
              }}
            >
              No notifications
            </h2>

            <p
              style={{
                maxWidth: "420px",
                margin: "0 auto",
                color: "#64748b",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              You're all caught up. New application, interview and career
              updates will appear here.
            </p>
          </div>
        )}

        {/* =================================================
            Notification List
        ================================================= */}

        {!loading && notifications.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {notifications.map((notification) => {
              const iconColor = getNotificationColor(notification.type);

              const isDeleting = deleteLoadingId === notification._id;

              const isMarkingRead = markReadLoadingId === notification._id;

              return (
                <article
                  key={notification._id}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "18px",
                    background: notification.isRead ? "#ffffff" : "#f5f7ff",
                    border: notification.isRead
                      ? "1px solid #e2e8f0"
                      : "1px solid #c7d2fe",
                    borderRadius: "14px",
                    boxShadow: notification.isRead
                      ? "none"
                      : "0 2px 8px rgba(79,70,229,0.06)",
                    opacity: isDeleting ? 0.5 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Icon */}

                  <div
                    style={{
                      flexShrink: 0,
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      background: `${iconColor}15`,
                      color: iconColor,
                      fontSize: "18px",
                      fontWeight: 700,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          lineHeight: 1.4,
                          fontWeight: notification.isRead ? 600 : 700,
                          color: "#0f172a",
                        }}
                      >
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "#4f46e5",
                          }}
                        />
                      )}
                    </div>

                    <p
                      style={{
                        margin: "6px 0 8px",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        color: "#64748b",
                        wordBreak: "break-word",
                      }}
                    >
                      {notification.message}
                    </p>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                      }}
                    >
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      flexShrink: 0,
                    }}
                  >
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification)}
                        disabled={isMarkingRead}
                        title="Mark as read"
                        style={{
                          width: "34px",
                          height: "34px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          background: "#ffffff",
                          color: "#475569",
                          cursor: isMarkingRead ? "wait" : "pointer",
                          fontSize: "15px",
                        }}
                      >
                        {isMarkingRead ? "..." : "✓"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(notification._id)}
                      disabled={isDeleting}
                      title="Delete notification"
                      style={{
                        width: "34px",
                        height: "34px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        background: "#ffffff",
                        color: "#94a3b8",
                        cursor: isDeleting ? "wait" : "pointer",
                        fontSize: "16px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =================================================
            Pagination
        ================================================= */}

        {!loading && notifications.length > 0 && pagination?.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={pagination.page <= 1 || loading}
              style={{
                padding: "9px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: pagination.page <= 1 ? "#f1f5f9" : "#ffffff",
                color: pagination.page <= 1 ? "#94a3b8" : "#334155",
                cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Previous
            </button>

            <span
              style={{
                minWidth: "90px",
                textAlign: "center",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={pagination.page >= pagination.totalPages || loading}
              style={{
                padding: "9px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background:
                  pagination.page >= pagination.totalPages
                    ? "#f1f5f9"
                    : "#ffffff",
                color:
                  pagination.page >= pagination.totalPages
                    ? "#94a3b8"
                    : "#334155",
                cursor:
                  pagination.page >= pagination.totalPages
                    ? "not-allowed"
                    : "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes notificationPulse {
            0% {
              opacity: 0.55;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.55;
            }
          }

          @media (max-width: 640px) {
            .notification-page {
              padding: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Notifications;
