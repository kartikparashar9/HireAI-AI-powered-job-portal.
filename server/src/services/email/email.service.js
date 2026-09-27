import env from "../../config/env.js";

const sendEmail = async ({ to, subject, html }) => {
  if (!env.brevo.apiKey || !env.brevo.from) {
    throw new Error("Brevo email configuration is incomplete");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": env.brevo.apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: env.brevo.fromName,
        email: env.brevo.from,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("========== BREVO EMAIL ERROR ==========");
    console.error("status:", response.status);
    console.error("response:", errorText);
    console.error("=======================================");

    throw new Error("Failed to send email through Brevo");
  }

  return response.json();
};

const sendVerificationEmail = async (email, verificationUrl) => {
  await sendEmail({
    to: email,
    subject: "Verify your HireAI account",
    html: `
      <h2>Welcome to HireAI</h2>

      <p>
        Thank you for creating your HireAI account.
      </p>

      <p>
        Please verify your email address by clicking the button below:
      </p>

      <p>
        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            padding: 10px 18px;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Verify Email
        </a>
      </p>

      <p>
        This verification link expires in 60 seconds.
      </p>

      <p>
        If you did not create this account, you can safely ignore this email.
      </p>
    `,
  });
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  await sendEmail({
    to: email,
    subject: "Reset your HireAI password",
    html: `
      <h2>Reset Your Password</h2>

      <p>
        We received a request to reset your HireAI password.
      </p>

      <p>
        Click the button below to create a new password:
      </p>

      <p>
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 10px 18px;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>
      </p>

      <p>
        This password reset link expires in 15 minutes.
      </p>

      <p>
        If you did not request a password reset, you can safely ignore this email.
      </p>
    `,
  });
};

export { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
