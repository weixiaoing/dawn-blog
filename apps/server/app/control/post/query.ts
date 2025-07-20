import post from "@/models/post";

// 根据ID获取文章（不增加观看次数）
export const getPostById = async (id: string) => {
  return await post.findById(id);
};

// 获取文章的直接子文章
export const getDirectChildren = async (parentId: string) => {
  return await post
    .find({ parentId: parentId })
    .sort({ createdAt: -1 })
    .select('-content'); // 不返回内容，只返回元数据
};

// 获取文章的所有子文章（递归）
export const getAllChildren = async (parentId: string) => {
  const children = await post.find({ parentId: parentId }).sort({ createdAt: -1 });
  // 递归获取每个子文章的子文章
  const allChildren: any[] = [];
  for (const child of children) {
    allChildren.push(child);
    const grandChildren = await getAllChildren(child._id.toString());
    allChildren.push(...grandChildren);
  }
  
  return allChildren;
};

// 获取根级文章（没有父级的文章）
export const getRootPosts = async () => {
  return await post
    .find({ parentId: null })
    .sort({ createdAt: -1 })
    .select('-content');
};

// 根据标签查询文章
export const findPostsByTags = async (tags: string[]) => {
  return await post.find({
    tags: { $in: tags }
  }).sort({ createdAt: -1 });
};

// 根据状态查询文章
export const findPostsByStatus = async (status: string) => {
  return await post.find({ status }).sort({ createdAt: -1 });
};

// 获取文章统计信息
export const getPostStats = async () => {
  const total = await post.countDocuments();
  const published = await post.countDocuments({ status: 'Published' });
  const draft = await post.countDocuments({ status: 'Draft' });
  const archived = await post.countDocuments({ status: 'Archived' });
  
  return {
    total,
    published,
    draft,
    archived
  };
};

// 获取标签统计信息（每个标签的文章数量）
export const getTagStats = async () => {
  const posts = await post.find({}, 'tags');
  const tagCount: { [key: string]: number } = {};
  
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        if (tag && tag.trim()) {
          const cleanTag = tag.trim();
          tagCount[cleanTag] = (tagCount[cleanTag] || 0) + 1;
        }
      });
    }
  });
  
  // 转换为数组格式，按文章数量降序排列
  const tagStats = Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
  
  return tagStats;
};






