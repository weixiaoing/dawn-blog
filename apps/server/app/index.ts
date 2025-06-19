import bodyParser from "body-parser";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import log from "./common/chalk";
import env from "./lib/env";
import { errorHandler } from "./middleware/common";
import fileRouter from "./routes/file";
import meetingRouter from "./routes/meeting";
import postRouter from "./routes/post";
import summryRouter from "./routes/summary";
import talkRotuer from "./routes/talk";
import imageRouter from "./routes/image"
import commentRouter from "./routes/comment"
import ICEServerHandlers from "./socket/ICEserver";
import userHandlers from "./socket/userHandler";
import admin from "./routes/admin"
import { auth } from "./lib/auth";
const app = express();
const server = new http.Server(app);
// 服务器响应端口
const PORT = env.SERVER_PORT || 4000;
// socket端口
const SOCKETPORT = env.SOCKET_PORT || 4040;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // 替换为前端实际域名
  credentials: true, // 允许携带凭证（如 cookies）
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的请求方法
  allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
};
app.use(cors(corsOptions));
const socketIO = new Server(SOCKETPORT as number, {
  cors:
  {
    origin: "*",
  }

});

app.use((req, res, next) => {
  log.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})
app.all("/api/auth/*", toNodeHandler(auth));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/isAlive", (req, res) => {
  res.json({
    message: "Hello !",
  })
})


app.use("/post", postRouter)
app.use("/download", express.static("static"))
app.use("/file", fileRouter)
app.use("/summary", summryRouter)
app.use("/talk", talkRotuer)
app.use("/meeting", meetingRouter)
app.use("/image", imageRouter)
app.use("/admin", admin)
app.use("/comment", commentRouter)
app.use(errorHandler)
// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" })
})
server.listen(PORT, () => {
  log.success(`服务器端口: ${PORT}`);
});

socketIO.on("connection", (socket) => {
  log.info(`⚡: ${socket.id} 用户已连接!`);
  userHandlers(socketIO, socket);
  ICEServerHandlers(socketIO, socket);

  socket.on("disconnect", () => {
    log.info(`🔥: ${socket.id} 用户已断开连接!`);
  });
});
