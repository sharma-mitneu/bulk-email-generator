import sendgrid from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

// Set the SendGrid API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { emails, subject, message, role, company, sender, resume } = req.body;

    const msg = {
      to: emails.split(","),  // Comma-separated email addresses
      from: process.env.SENDER_EMAIL,  // Sender's email address
      subject: subject,
      text: message
        .replace("{role}", role)
        .replace("{company}", company)
        .replace("{sender}", sender),
      html: message
        .replace("{role}", role)
        .replace("{company}", company)
        .replace("{sender}", sender)
        .replace(/\n/g, "<br>"),  // Convert newlines to <br> in HTML message
    };

    if (resume) {
      msg.attachments = [
        {
          filename: resume.name,
          content: resume.data.toString("base64"),
          type: resume.type,
          disposition: "attachment",
        },
      ];
    }

    try {
      await sendgrid.send(msg);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Error sending email" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
