import log from "@/common/chalk"
import { Socket } from "socket.io"

const ICEServerHandlers = (io, socket: Socket) => {
  let callRoom = ""
  socket.on("join", ({ target, name, avatar, id }) => {
    socket.join(target)
    callRoom = target
    socket.to(target).emit("join", { sender: socket.id, name, avatar, id })
  })
  socket.on("offer", ({ sdp, target, ...user }) => {
    console.log(user);

    socket.to(target).emit("offer", { sdp, sender: socket.id, ...user })
  })
  socket.on("answer", ({ sdp, target }) => {
    socket.to(target).emit("answer", { sdp, sender: socket.id })
  })
  socket.on("left", async ({ target }) => {
    socket.leave(target)
    socket.to(target).emit("left", { sender: socket.id })
  })
  socket.on("ice-candidate", async ({ candidate, target }) => {
    socket.to(target).emit("ice-candidate", { candidate, sender: socket.id })
  })
  socket.on("hang-down-server", ({ id, roomId }) => {
    socket.to(roomId).emit("hang-down")
  })
  socket.on("disconnect", () => {
    log.success("disconnect \t" + socket.id)
    socket.to(callRoom).emit("left", { sender: socket.id })
  })
  socket.on("change", ({ target, type, state }) => {
    socket.to(target).emit("change", { type, state, sender: socket.id })
  })
}

export default ICEServerHandlers
