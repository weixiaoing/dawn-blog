"use client";
import { useUserStore } from "@/_store/user";
import Modal from "../modal";

export default function Login() {
  const state = useUserStore((state) => state);
  return (
    <Modal>
      <input type="text" />
    </Modal>
  );
}
