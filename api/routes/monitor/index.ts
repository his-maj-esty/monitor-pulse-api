import express from "express";
import axios, { AxiosResponse } from "axios";
import { dbService } from "../../../services/dbService";
import { statusChecker } from "../../../utils/statusCheck";

const router = express.Router();
const db = new dbService();

router.post("/add", async (req, res) => {
  const { websiteURL, websiteName } = req.body;
  try {
    const response = await db.addWebsite({
      name: websiteName,
      url: websiteURL,
    });
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed to add website for monitoring" });
  }
});

router.delete("/delete", async (req, res) => {
  const { websiteName } = req.body;
  try {
    const response = await db.deleteWebsite({ name: websiteName });
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

export { router as monitorRouter };
