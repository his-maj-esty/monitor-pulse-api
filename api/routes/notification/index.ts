import express, { json, response } from "express";
import { dbService } from "../../../services/dbService";
import { mailService } from "../../../services/mailingService";
import { templateFormat } from "../../../typings";
import { Website } from "@prisma/client";

const router = express.Router();
const db = new dbService();
const mail = new mailService();

router.post("/sendNotifications", async (req, res) => {
  try {
    const websites = await db.getStatsWithPendingNotification();
    console.log("pending notifications:", websites);
    if (websites.length === 0) {
      res.json({ message: "no notifications to send" });
      return;
    }

    await Promise.all(
      websites.map(async (website) => {
        try {
          let combinedTimestamps = "";
          website.stats.forEach(({ timestamp, ownerNotified, status }) => {
            if (status === 0 && ownerNotified === false)
              combinedTimestamps += timestamp + "\n";
          });

          const templateData = JSON.stringify({
            websiteName: website.name,
            timestamp: combinedTimestamps,
          });

          // const mailResponse = await mail.sendNotificationEmail({
          //   websiteEmail: website.email,
          //   templateData: templateData,
          // });

          website.stats.map(async ({ id }) => {
            await db.setStatusNotified({ statusId: id });
          });

          await db.addNotification({
            id: website.id,
            type: "downtime",
            timestamps: combinedTimestamps,
          });

          console.log(
            "notification sent to :",
            website.name,
            " with res: "
            // mailResponse
          );
        } catch (err) {
          console.log("failed to send notification to : ", website.name);
          console.log(err);
        }
      })
    );
    res.json({ message: "notifications sent" });
  } catch (err) {
    res.status(400).json({ message: "failed to send notifications" });
    console.log(err);
  }
});

router.post("/unsubscribe", async (req, res) => {
  const { id } = req.body;
  try {
    const response = await db.optOutForNotification({ id });
    console.log(response);
    res
      .status(200)
      .json({ message: "unsubscribed successfully for ", data: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed to unsubscribe" });
  }
});

router.post("/subscribe", async (req, res) => {
  const { id } = req.body;

  try {
    const response = await db.optInForNotification({
      id: id,
    });
    res.json({ message: "notifications subscribed for ", data:response });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to subscribe" });
  }
});

router.post("/isSubscribed",async (req, res) => {
  const { id } = req.body;
  try {
    const isSubscribed = await db.isSubscribed({ id: id });
    res.json({
      message: "subscription status fetched successfully", responseData: isSubscribed
    });
  } catch (error) {
    
  }
})

router.post("/getNotifications", async (req, res) => {
  const { id } = req.body;
  try {
    const response: any = await db.getNotifications({
      id: id,
    });
    console.log(response);
    res.json({ message: "notifications fetched successfully",responseData : response });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to fetch notifications" });
  }
});

router.post("/template/create", async (req, res) => {
  try {
    const { templateFormat, templateName, templateSubject } = req.body;

    const templateResponse = await mail.createTemplate({
      templateFormat: templateFormat,
      templateName: templateName,
      templateSubject: templateSubject,
    });
    console.log(templateResponse);
    res.json({ message: "template created successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed to create template" });
  }
});

export { router as notificationRouter };
