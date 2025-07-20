import "./blog.css";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { useParams } from "react-router-dom";

import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import CustomEditor from "../../component/editor/yoopta/YooptaEditor";
import {
  postDetailAtom,
  updatePostContentAtom,
  updatePostPropertiesAtom,
} from "../../store/atom/postAtom";
import { debounceWrapper } from "../../utils/common";
import BlogCard from "./BlogCard";
import BlogMeta from "./BlogMeta";

export default function Blog() {
  const { Id } = useParams();
  const { data, isLoading, refetch } = useAtomValue(postDetailAtom(Id!));
  const { mutate: updatePostContent, isSuccess } = useAtomValue(
    updatePostContentAtom
  );
  const { mutate: updatePostProperties, isSuccess: isSuccessProperties } =
    useAtomValue(updatePostPropertiesAtom);
  const debouncedUpdatePost = useCallback(
    debounceWrapper(updatePostContent),
    []
  );

  useEffect(() => {
    refetch();
  }, [Id]);
  // const location = useLocation()
  // const preMd = location.state?.mdObject
  if (!Id || !data || isLoading) return <div>loading</div>;
  return (
    <div key={Id} className="container max-w-4xl px-10">
      <BlogCard
        data={data}
        onUpdate={(newData) => {
          updatePostProperties({
            postId: Id,
            properties: newData,
            parentId: data.parentId,
          });
        }}
      />
      <BlogMeta
        data={data}
        onUpdate={(newData) => {
          updatePostProperties({
            postId: Id,
            properties: newData,
            parentId: data.parentId,
          });
        }}
      />
      {data && (
        <CustomEditor
          defaultValue={data.content}
          onChange={(content) => {
            debouncedUpdatePost({ postId: Id, content: content });
          }}
        />
      )}
    </div>
  );
}
