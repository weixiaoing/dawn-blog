import mongoose from "@/lib/db";
const usersSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Users", usersSchema, "users");
