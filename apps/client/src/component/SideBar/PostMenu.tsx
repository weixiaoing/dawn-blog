import { FileTextOutlined, RightOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useState } from "react";
import { RiAddFill, RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { useAtomValue } from "jotai";
import {
  createPostAtom,
  deleteSinglePostAtom,
  postChildrenAtom,
  rootPostsAtom,
} from "../../store/atom/postAtom";

import { IconButton, MenuItemContainer } from ".";
import { Post } from "../../api/post";

function PostMenuItem({
  post,
  level = 0,
  className,
}: {
  post: Post;
  level?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // 获取当前节点的子文章
  const {
    data: children,
    isLoading,
    refetch,
  } = useAtomValue(postChildrenAtom(post._id));
  const { mutate: createPost } = useAtomValue(createPostAtom);

  const { mutate: deletePost } = useAtomValue(deleteSinglePostAtom, {});
  const createPostHandler = (parentId: string) => {
    createPost(
      { parentId },
      {
        onSuccess: (data, _, context) => {
          // 假设data返回新建文章的_id
          if (data && data._id) {
            navigate(`/blog/${data._id}`);
          }
        },
      }
    );
  };
  const deletePostHandler = (postId: string) => {
    deletePost({ postId, parentId: post.parentId });
  };
  return (
    <div className={clsx(className, "mt-0.5")}>
      <MenuItemContainer
        style={{ paddingLeft: level * 8 }}
        className="flex items-center group hover:bg-neutral-400/20 rounded-md"
      >
        <IconButton>
          <FileTextOutlined className="group-hover:hidden" />
          <RightOutlined
            onClick={() => {
              refetch();
              setOpen((v) => !v);
            }}
            className={clsx(
              "hidden group-hover:block transition-all",
              open && "rotate-90"
            )}
            size={20}
          />
        </IconButton>
        <span
          className="ml-1 flex-1 truncate cursor-pointer"
          onClick={() => navigate(`/blog/${post._id}`)}
        >
          {post.title}
        </span>

        <IconButton
          className="hidden group-hover:block size-6"
          onClick={() => deletePostHandler(post._id)}
        >
          <RiDeleteBinLine className="size-full" />
        </IconButton>
        <IconButton
          className="hidden group-hover:block size-6"
          onClick={() => createPostHandler(post._id)}
        >
          <RiAddFill className="size-full" />
        </IconButton>
      </MenuItemContainer>
      {open && (
        <div>
          {isLoading ? (
            <div className="ml-4 text-xs text-gray-400">加载中...</div>
          ) : children && children?.length > 0 ? (
            children?.map((child) => (
              <PostMenuItem key={child._id} post={child} level={level + 1} />
            ))
          ) : (
            <div className="ml-8 text-gray-400 py-1">暂无文章</div>
          )}
        </div>
      )}
    </div>
  );
}

// 根菜单
export default function PostMenu() {
  const { data: rootPosts, refetch, isLoading } = useAtomValue(rootPostsAtom);
  const { mutate: createPost } = useAtomValue(createPostAtom);
  const [open, setOpen] = useState(false);
  const createPostHandler = (parentId?: string) => {
    createPost({ parentId });
  };
  return (
    <div className="text-neutral-800 ">
      <MenuItemContainer
        onClick={() => {
          refetch();
          setOpen((v) => !v);
        }}
        className="flex items-center group"
      >
        <span>文章</span>
        {/* 根级添加/搜索按钮 */}
        <div className="ml-auto hidden group-hover:block">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              createPostHandler();
            }}
          >
            <RiAddFill />
          </IconButton>
        </div>
      </MenuItemContainer>
      {isLoading && <div>loading</div>}
      {open && (
        <div>
          {rootPosts?.map((post) => (
            <PostMenuItem key={post._id} post={post} level={1} />
          ))}
        </div>
      )}
    </div>
  );
}
