import { clientEnv, serverEnv } from "@/config";

type EmailRecipient = {
  email: string;
  name?: string;
};

type EmailAttachment = {
  name: string;
  content: string; // base64
};

type SendBrevoEmailOptions = {
  to: ReadonlyArray<EmailRecipient>;
  subject: string;
  html: string;
  replyTo?: EmailRecipient;
  attachments?: ReadonlyArray<EmailAttachment>;
};

const BREVO_API_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export async function sendBrevoEmail({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: SendBrevoEmailOptions): Promise<void> {
  if (!serverEnv.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured.");
  }

  const senderEmail = clientEnv.NEXT_PUBLIC_BREVO_SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error("NEXT_PUBLIC_BREVO_SENDER_EMAIL is not configured.");
  }

  if (to.length === 0) {
    throw new Error("sendBrevoEmail requires at least one recipient.");
  }

  const response = await fetch(BREVO_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": serverEnv.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
      },
      to,
      subject,
      htmlContent: html,
      replyTo,
      attachment:
        attachments?.map((attachment) => ({
          name: attachment.name,
          content: attachment.content,
        })) ?? undefined,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(
      `Brevo API error: ${response.status} ${
        response.statusText
      } ${JSON.stringify(errorPayload)}`,
    );
  }
}
