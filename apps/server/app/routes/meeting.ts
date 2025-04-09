import express from "express";
import { asyncHandler } from "../middleware/common";
import meeting from "../models/meeting";
import { successResponse } from "./utils";
import log from "@/common/chalk";
const router = express.Router();
router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const { title, startTime, duration, hostId } = req.body;
    const result = await meeting.create({ title, startTime, duration, hostId });
    successResponse(res, result);
  })
);

router.post(
  "/findByPage",
  asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, ...query } = req.body;
    const skip = (page - 1) * pageSize;
    const total = await meeting.countDocuments(query);
    const result = await meeting
      .find({
        ...query,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    successResponse(res, {
      data: result,
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize),
      },
    });
  })
);

router.delete(
  "/delete",
  asyncHandler(async (req, res) => {
    const { _id } = req.query;
    if (!_id) {
      const error = new Error("ID不能为空");
      error.status = 400;
      throw error;
    }
    const result = await meeting.findByIdAndDelete(_id);
    if (!result) {
      const error = new Error("未找到对应的记录");
      error.status = 404;
      throw error;
    }
    successResponse(res, result);
  })
);

export default router;
