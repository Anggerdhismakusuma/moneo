import { NextFunction, Request, Response } from "express";
import { Webhook } from "svix";

const verifyClerkWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOKS_SECRET;

  if (!WEBHOOK_SECRET) {
    return res
      .status(500)
      .json({ message: "Please provide webhook secret in .env" });
  }

  const svix_id = (req.headers["svix-id"] || "").toString();
  const svix_timestamp = (req.headers["svix-timestamp"] || "").toString();
  const svix_signature = (req.headers["svix-signature"] || "").toString();

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ message: "Error occured - No svix headers" });
  }

  const headers = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  const payload = JSON.stringify(req.body);
  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    await wh.verify(payload, headers);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid signature",
    });
  }
};

export { verifyClerkWebhook };
