import { hasBrevoEnv } from "@/lib/server/env";
import { getAppUrl } from "@/lib/server/env";

type EmailRecipient = {
  email: string;
  name?: string | null;
};

type SendEmailInput = {
  to: EmailRecipient;
  subject: string;
  htmlContent: string;
  textContent: string;
  tags?: string[];
};

function parseSender(value: string) {
  const match = value.match(/^(.*)<(.+)>$/);

  if (!match) {
    return {
      email: value.trim(),
      name: "Summit Gear",
    };
  }

  return {
    name: match[1].trim(),
    email: match[2].trim(),
  };
}

export async function sendTransactionalEmail(input: SendEmailInput) {
  if (!hasBrevoEnv()) {
    console.warn(`[email:skipped:no-brevo-config] ${input.subject} -> ${input.to.email}`);
    
    return {
      skipped: true,
      reason: "Brevo configuration not available",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: parseSender(process.env.EMAIL_FROM!),
        to: [
          {
            email: input.to.email,
            name: input.to.name ?? undefined,
          },
        ],
        subject: input.subject,
        htmlContent: input.htmlContent,
        textContent: input.textContent,
        tags: input.tags,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[email:brevo-error] ${response.status}: ${body}`);
      throw new Error(`Brevo email failed with ${response.status}: ${body}`);
    }

    return response.json();
  } catch (error) {
    console.error(`[email:send-failed] ${input.subject} -> ${input.to.email}:`, error);
    throw error;
  }
}

export async function sendVerificationEmail(input: { email: string; name?: string | null; verificationUrl: string }) {
  return sendTransactionalEmail({
    to: {
      email: input.email,
      name: input.name,
    },
    subject: "Verifikasi email Summit Gear",
    htmlContent: `
      <p>Halo ${input.name ?? "Pendaki"},</p>
      <p>Klik link berikut untuk memverifikasi email akun Summit Gear.</p>
      <p><a href="${input.verificationUrl}">Verifikasi Email</a></p>
      <p>Link berlaku selama 24 jam.</p>
    `,
    textContent: `Verifikasi email Summit Gear: ${input.verificationUrl}`,
    tags: ["summit-gear", "email-verification"],
  });
}

export async function sendPasswordResetEmail(input: { email: string; name?: string | null; resetUrl: string }) {
  return sendTransactionalEmail({
    to: {
      email: input.email,
      name: input.name,
    },
    subject: "Reset password Summit Gear",
    htmlContent: `
      <p>Halo ${input.name ?? "Pendaki"},</p>
      <p>Klik link berikut untuk mengganti password akun Summit Gear.</p>
      <p><a href="${input.resetUrl}">Reset Password</a></p>
      <p>Link berlaku selama 1 jam. Abaikan email ini jika kamu tidak meminta reset password.</p>
    `,
    textContent: `Reset password Summit Gear: ${input.resetUrl}`,
    tags: ["summit-gear", "password-reset"],
  });
}

export async function sendOrderCreatedEmail(input: { email: string; name?: string | null; orderNumber: string; orderUrl: string; total: number }) {
  return sendTransactionalEmail({
    to: {
      email: input.email,
      name: input.name,
    },
    subject: `Order ${input.orderNumber} berhasil dibuat`,
    htmlContent: `
      <p>Halo ${input.name ?? "Pendaki"},</p>
      <p>Order <strong>${input.orderNumber}</strong> berhasil dibuat dengan total Rp${input.total.toLocaleString("id-ID")}.</p>
      <p><a href="${input.orderUrl}">Lihat detail order</a></p>
    `,
    textContent: `Order ${input.orderNumber} berhasil dibuat. Detail: ${input.orderUrl}`,
    tags: ["summit-gear", "order-created"],
  });
}

export async function sendPaymentPaidEmail(input: { email: string; name?: string | null; orderNumber: string; orderUrl: string; total: number }) {
  return sendTransactionalEmail({
    to: {
      email: input.email,
      name: input.name,
    },
    subject: `Pembayaran ${input.orderNumber} berhasil`,
    htmlContent: `
      <p>Halo ${input.name ?? "Pendaki"},</p>
      <p>Pembayaran untuk order <strong>${input.orderNumber}</strong> sebesar Rp${input.total.toLocaleString("id-ID")} sudah tercatat.</p>
      <p><a href="${input.orderUrl}">Pantau pesanan</a></p>
    `,
    textContent: `Pembayaran order ${input.orderNumber} berhasil. Detail: ${input.orderUrl}`,
    tags: ["summit-gear", "payment-paid"],
  });
}
