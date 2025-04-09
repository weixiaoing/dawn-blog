
import mongoose from "@/lib/db";

const postSchema = new mongoose.Schema({
  // 名称
  title: {
    type: String,
    default: "New Post",
  },
  //   内容
  content: {
    type: String,
    default: "",
  },
  //   标签
  tags: {
    type: [String],
    default: [],
  },
  //   摘要
  summary: {
    type: String,
    default: "",
  },
  //   状态
  status: {
    type: String,
    default: "Draft",
  },
  watched: {
    type: Number,
    default: 0,
  },
  like: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  cover: {
    type: String,
    default: "",
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  ],
});

export default mongoose.model("Post", postSchema, "post");
