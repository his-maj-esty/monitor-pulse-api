import express from "express";
import { dbService } from "../../../services/dbService";
import { statusChecker } from "../../../utils/statusCheck";

const router = express.Router();
const db = new dbService();

router.post("/getDetails", async (req, res) => {
  const { id } = req.body;
  try {
    const details = await db.getWebsiteDetails({ id: id });
    res
      .status(200)
      .json({ message: "details fetched successfully", response: details });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed to get details" });
  }
});

router.post("/add", async (req, res) => {
  const { websiteURL, websiteName, websiteEmail, userId } = req.body;
  try {
    const response = await db.addWebsite({
      name: websiteName,
      url: websiteURL,
      email: websiteEmail,
      userId: userId
    });
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed to add website for monitoring" });
  }
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const response = await db.deleteWebsite({ id: id });
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed to delete website" });
  }
});

router.get("/checkStatus", async (req, res) => {
  console.log("req reached");
  try {
    await statusChecker();
    res.json({ message: "all websites checked" });
  } catch (err) {
    console.log(err);
    res.send({ message: "error" });
  }
});

router.get("/getAllWebsites/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const websites = await db.getWebsites({ userId });
    res.json({ message: "websites fetched successfully", data: websites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

export { router as monitorRouter };
