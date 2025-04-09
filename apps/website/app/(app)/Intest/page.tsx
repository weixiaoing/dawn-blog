"use client";
import Button from "@/_components/UI/button";
import Card from "@/_components/UI/card";
import Comment from "@/_components/comment/comment";
import CommentList from "@/_components/comment/commentList";
import Modal from "@/_components/UI/modal";
import { useState } from "react";

export default function Intest() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card>
        <Button onClick={() => setOpen(!open)}>switch</Button>
        <Modal onCancel={() => setOpen(false)} open={open}>
          <Card className="bg-yellow-100">
            <div className="w-10 h-10 bg-white">test</div>
          </Card>
        </Modal>
      </Card>
    </>
  );
}
