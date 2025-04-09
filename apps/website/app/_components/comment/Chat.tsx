import CommentRootLazy from "./CommentRootLazy";

const Chat: typeof CommentRootLazy = ({ className, room, ...props }) => {
  return (
    <div className={className}>
      <CommentRootLazy room={room}></CommentRootLazy>
    </div>
  );
};
export default Chat;
