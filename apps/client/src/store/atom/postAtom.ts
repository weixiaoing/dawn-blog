import { atom } from "jotai";
import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { atomFamily, atomWithStorage } from 'jotai/utils';
import {
  createPost,
  deletePosts,
  getDirectChildren,
  getPostDetail,
  getRootPosts,
  newPost,
  Post,
  PostWithContent,
  updatePostContent,
  updatePostProperties
} from "../../api/post";
import { queryClient } from "../../AppProvider";

// 文章缓存管理
interface PostCache {
  [postId: string]: {
    data: PostWithContent | Post;
    timestamp: number;
    isDetail: boolean; // 是否包含完整内容
  };
}

// 文章树结构缓存
interface PostTreeCache {
  [parentId: string]: {
    children: Post[];
    timestamp: number;
  };
}

// 基础状态
export const postCacheAtom = atomWithStorage<PostCache>('post-cache', {});
export const postTreeCacheAtom = atomWithStorage<PostTreeCache>('post-tree-cache', {});
export const expandedNodesAtom = atomWithStorage<Set<string>>('expanded-nodes', new Set());
export const selectedPostIdAtom = atom<string | null>(null);

// 缓存过期时间（5分钟）
const CACHE_EXPIRY = 5 * 60 * 1000;


// 缓存工具函数
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_EXPIRY;
};

// 根级文章查询
export const rootPostsAtom = atomWithQuery(() => ({
  queryKey: ['posts'],
  queryFn: async () => {
    const response = await getRootPosts();
    return response.data || [];
  },
  staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
  gcTime: 10 * 60 * 1000, // 10分钟内保留在内存
}), () => queryClient);
// 文章子级查询
export const postChildrenAtom = atomFamily((postId: string) =>
  atomWithQuery(() => ({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await getDirectChildren(postId);
      return response.data;
    },
  }))
);
// 文章详情查询（带缓存）
export const postDetailAtom = atomFamily((postId: string) =>
  atomWithQuery(() => ({
    queryKey: ['post', 'detail', postId],
    queryFn: async () => {
      const response = await getPostDetail(postId);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2分钟内不重新请求
    gcTime: 5 * 60 * 1000,
  }))
);

// 创建文章的 mutation atom
export const createPostAtom = atomWithMutation(() => ({
  mutationFn: (variables: Partial<PostWithContent>) => {
    const post = newPost(variables)
    return createPost(post)
  },
  // 乐观更新
  onMutate: async (variables) => {
    const { parentId } = variables;
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    await queryClient.cancelQueries({ queryKey });
    const previousPosts = queryClient.getQueryData<PostWithContent[]>(queryKey);
    const post = newPost(variables)
    queryClient.setQueryData<PostWithContent[]>(queryKey, (old = []) => [
      // 插入最顶部
      post,
      ...(old as PostWithContent[]),

    ]);
    return { previousPosts };
  },
  onError: (error, variables, context) => {
    const { parentId } = variables;
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    // 回退
    if (context?.previousPosts) {
      queryClient.setQueryData(queryKey, context.previousPosts);
    }
  },
  onSuccess: (data, variables, context) => {
    const { parentId } = variables;
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    // 成功后，重新拉取一次信息
    queryClient.invalidateQueries({ queryKey });
    console.log('文章创建成功:', data);
  },
}));


//单个文章删除
export const deleteSinglePostAtom = atomWithMutation(() => ({
  mutationFn: ({ postId, parentId }: { postId: string, parentId?: string }) => {
    return deletePosts(postId);
  },
  // 实现乐观更新：删除文章时，先从本地缓存移除，失败则回滚
  onMutate: async ({ postId, parentId }) => {
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    console.log(queryKey)
    await queryClient.cancelQueries({ queryKey });
    const previousPosts = queryClient.getQueryData<Post[]>(queryKey);
    console.log(previousPosts);

    // 先从本地缓存中过滤掉要删除的文章
    queryClient.setQueryData<Post[]>(queryKey, (old = []) =>
      (old as Post[]).filter((post: Post) => post._id !== postId)
    );
    return { previousPosts };
  },
  onError: (error, variables, context) => {
    const { parentId } = variables;
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    // 回滚本地缓存
    if (context?.previousPosts) {
      queryClient.setQueryData(queryKey, context.previousPosts);
    }
    console.error('删除文章失败:', error);
  },
  onSuccess: (data, variables, context) => {
    const { parentId } = variables;
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    queryClient.invalidateQueries({ queryKey: queryKey });
    console.log('文章删除成功:', variables);
  },
}));

// 更新文章内容
export const updatePostContentAtom = atomWithMutation(() => ({
  mutationFn: ({ postId, content }: { postId: string, content: string }) => {
    return updatePostContent(postId, content);
  },
  onSuccess: (data, variables, context) => {
    console.log('文章更新成功:', data);
  },
  onError: (error) => {
    console.error('更新文章失败:', error);
  },
}));

// 更新文章属性
export const updatePostPropertiesAtom = atomWithMutation(() => ({
  mutationFn: ({ postId, properties, parentId }: { postId: string, properties: Partial<Post>, parentId?: string }) => {
    return updatePostProperties(postId, properties);
  },
  // 乐观更新 先更新数据，后拉取，失败则回退
  onMutate: async ({ postId, properties, parentId }) => {
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    await queryClient.cancelQueries({ queryKey });
    const previousPosts = queryClient.getQueryData<Post[]>(queryKey);
    queryClient.setQueryData<Post[]>(queryKey, (old = []) =>
      (old as Post[]).map((post: Post) =>
        post._id === postId ? { ...post, ...properties } : post
      )
    );
    return { previousPosts };
  },
  onError: (err, variables, context) => {
    if (context?.previousPosts) {
      const { parentId } = variables;
      const queryKey = parentId ? ['posts', parentId] : ['posts'];
      queryClient.setQueryData(queryKey, context.previousPosts);
    }
  },
  onSuccess: (data, variables, context) => {
    const { parentId } = variables;
    const queryKey = parentId ? ['posts', parentId] : ['posts'];
    queryClient.invalidateQueries({ queryKey: queryKey });
  },
}));
//批量文章删除
export const deleteBatchPostAtom = atomWithMutation(() => ({
  mutationFn: (postIds: string[]) => deletePosts(postIds),
  onSuccess: (data, variables, context) => {
    console.log('文章删除成功:', data);
  },
}));