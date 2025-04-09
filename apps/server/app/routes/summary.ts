import express from "express";
import { createSummary, findSummary } from "../control/summary";
const router = express.Router();
router.post("/create", (req, res) => {
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
router.post("/find", (req, res) => {
  findSummary(req.body)
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
