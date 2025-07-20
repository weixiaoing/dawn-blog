// routes.js
import express from "express";
import { z } from "zod";
import { createPost } from "../control/post/create";
import { deletePosts } from "../control/post/delete";
import { getDirectChildren, getPostById, getRootPosts } from "../control/post/query";
import { updatePostContent, updatePostMeta } from "../control/post/update";
import { asyncHandler } from "../middleware/common";
import { validate, validateQuery } from "../middleware/validator";
import { successResponse } from "./utils";

const router = express.Router();

// 创建文章
router.post("/create",
  validate(z.object({
    title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200字符'),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().max(500, '摘要不能超过500字符').optional(),
    status: z.enum(['Draft', 'Published', 'Archived']).default('Draft'),
    parentId: z.string().optional(),
    meta: z.record(z.any()).optional(),
  })),
  asyncHandler(async (req, res) => {
    const postData = req.body;
    const result = await createPost(postData);
    successResponse(res, result, "创建成功");
  })
);

// 修改文章内容
router.put("/content",
  validate(z.object({
    postId: z.string().min(1, '文章ID不能为空'),
    content: z.string(),
  })),
  asyncHandler(async (req, res) => {
    const { postId, content } = req.body;
    const result = await updatePostContent(postId, content);
    successResponse(res, result, "内容更新成功");
  })
);

// 修改文章属性
router.put("/properties",
  validate(z.object({
    postId: z.string().min(1, '文章ID不能为空'),
    title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200字符').optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().max(500, '摘要不能超过500字符').optional(),
    status: z.enum(['Draft', 'Published', 'Archived']).optional(),
    parentId: z.string().optional(),
    meta: z.record(z.any()).optional(),
    cover: z.string().optional(),
  })),
  asyncHandler(async (req, res) => {
    const { postId, ...properties } = req.body;
    const result = await updatePostMeta(postId, properties);
    successResponse(res, result, "属性更新成功");
  })
);

// 查询根级文章（不包含内容）
router.get("/roots",
  asyncHandler(async (req, res) => {
    const result = await getRootPosts();
    successResponse(res, result, "查询成功");
  })
);

// 查询直接子文章（不包含内容）
router.get("/children",
  validateQuery(z.object({
    parentId: z.string().min(1, '父级ID不能为空'),
  })),
  asyncHandler(async (req, res) => {
    const { parentId } = req.query;
    const result = await getDirectChildren(parentId);
    successResponse(res, result, "查询成功");
  })
);

router.get("/detail",
  validateQuery(z.object({
    postId: z.string().min(1, '文章ID不能为空'),
  })),
  asyncHandler(async (req, res) => {
    const { postId } = req.query;
    const result = await getPostById(postId);
    successResponse(res, result, "查询成功");
  })
);

// 删除文章（支持单个和批量删除）
router.delete("/delete",
  validate(z.object({
    postIds: z.union([
      z.string(),
      z.array(z.string())
    ]).refine((val) => {
      if (Array.isArray(val)) {
        return val.length > 0;
      }
      return val.length > 0;
    }, '文章ID不能为空'),
  })),
  asyncHandler(async (req, res) => {
    const { postIds } = req.body;
    await deletePosts(postIds);
    successResponse(res, null, "删除成功");
  })
);

export default router;
