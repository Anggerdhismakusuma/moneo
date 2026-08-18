import { Request, Response } from "express";
import { User } from "../models/user.model";

const clerkWebhook = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", JSON.stringify(req.body, null, 2));
    const { type: eventType, data } = req.body;
    console.log("EVENT:", eventType);
    const { first_name, last_name, image_url } = data || {};
    const email = data?.email_addresses?.[0]?.email_address;

    let fullName = "";
    if (last_name) {
      fullName = `${first_name} ${last_name}`;
    } else {
      fullName = first_name;
    }

    switch (eventType) {
      case "user.created":
        const isUserDetailEmpty = [email, fullName, image_url]?.some(
          (field) => field?.trim() === "",
        );
        if (isUserDetailEmpty) {
          return res.status(400).json({ message: "All fields are required" });
        }
        const existedUser = await User.findOne({ email });
        if (existedUser) {
          return res
            .status(400)
            .json({ message: "User with this email already exist" });
        }
        const user = await User.create({
          fullName,
          email,
          imageUrl: image_url,
        });
        if (!user) {
          return res.status(500).json({
            message: "Something went wrong while registering the user",
          });
        }
        break;
      default:
        res
          .status(200)
          .json({ message: `Unhandlen webhook event type: ${eventType}` });
    }

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

export { clerkWebhook };
