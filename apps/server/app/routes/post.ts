// routes.js
import log from "@/common/chalk";
import express from "express";
import { OpenAI } from "openai";
import {
  addWatchs,
  createPost,
  deletePost,
  findPost,
  findPostMeta,
  findWithPage,
  getPost,
  updatePost,
} from "../control/post";
const router = express.Router();

// 帖子相关路由
router.post("/create", (req, res) => {
  createPost(req.body)
    .then((data) => {
      res.json({
        status: 1,
        message: "帖子发布成功",
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

router.post("/findPostMeta", (req, res) => {
  findPostMeta(req.body)
    .then((data) => {
      res.json({
        status: 1,
        message: "查询成功",
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

router.post("/findWithPage", (req, res) => {
  findWithPage(req.body)
    .then((data) => {
      res.json({
        status: 1,
        message: "查询成功",
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

router.post("/findPost", (req, res) => {
  const props = req.body;

  findPost(props)
    .then((data) => {
      res.json({
        status: 1,
        message: "查询成功",
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

router.delete("/delete", (req, res) => {
  deletePost(req.body)
    .then((data) => {
      res.json({
        status: 1,
        message: "删除成功",
        data,
      });
    })
    .catch((error) => {
      res.json({
        status: 0,
        message: "删除失败",
      });
    });
});

router.post("/update", (req, res) => {
  updatePost(req.body)
    .then((data) => {
      res.json({
        status: 1,
        message: "更新成功",
        data,
      });
    })
    .catch((error) => {
      res.json({
        status: 0,
        message: "更新失败",
      });
    });
});

router.post("/aiwrite", async (req, res) => {
  const { content } = req.body;
  const getAi = async (content) => {
    const openai = new OpenAI({
      apiKey: "ak-sxNjLLkhMJc5Q1I3dQGcKdLglSrxaELbiEBYIZVyNMFK6KOb",
      baseURL: "https://api.nextapi.fun/v1",
    });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: ` Continue write this Article in "zh" language
          start with:
    "${content}"
    
    CONCISE SUMMARY:`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const summary = completion.choices[0].message.content;
    return summary;
  };
  try {
    const data = await getAi(content);
    res.json({ status: 1, data });
  } catch (error) {
    log.error(error);
  }
});


router.get("/getPost", async (req, res) => {
  log.info('yes');
  const { id } = req.query;
  console.log(req.query);
  getPost(id as string)
    .then((data) => {
      console.log(data);
      res.json({
        status: 1,
        message: "success",
        data,
      });
    })
    .catch((error) => {
      res.json({
        status: 0,
        message: error,
      })
    })
}
)

export default router;
