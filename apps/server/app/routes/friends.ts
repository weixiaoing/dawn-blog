import express from "express";
import { createSummary } from "../control/summary";
import friends from "../models/friends";
const router = express.Router();
router.post("/create", async (req, res) => {
  const mongoResult = await friends.create(req.body);
  createSummary(req.body)
    .then((data) => {
      res.json({
        code: 1,
        message: "success",
        data,
      });
    })
    .catch((error) => {
      res.json({
        status: 0,
        message: error,
      });
    });
});

export default router;
