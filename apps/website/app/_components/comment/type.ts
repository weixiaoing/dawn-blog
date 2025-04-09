export type CommentType = {
  postId: string;
  _id: string;
  parent?: string;
  avatar?: string;
  name?: string;
  content: string;
  createdAt: string;
  level: number;
  levelIdArray: string[];
  replies: CommentType[];
  email?: string;
  website?: string;
};
