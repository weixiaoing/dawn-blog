import post from "@/models/post";


export const createPost = async (req) => {
  return post.create(req).then((data) => {
    return { message: "创建成功", data };
  });
};

// 查元数据
export const findPostMeta = async (req) => {
  if (req?.tags?.length > 0) {
    req.tags = { $in: req.tags };
  }
  return post
    .find(
      {
        ...req,
      },
      "-content"
    )
    .sort({ date: -1 })
    .then((data) => {
      return data;
    });
};

export const findPost = async (req) => {
  return post
    .find({
      ...req,
    })
    .sort({ date: -1 })
    .then((data) => {
      return data;
    });
};

export const deletePost = async (req) => {
  return post.findByIdAndDelete(req).then((data) => {
    return data;
  });
};

export const findWithPage = async (req) => {
  const { skip, limit, body } = req;

  return post.find(body).sort({ date: -1 }).skip(skip).limit(limit);
};

export const updatePost = async (req) => {
  return post
    .findByIdAndUpdate(req._id, {
      $set: { ...req.config, updatedAt: new Date() },
    })
    .then((data) => {
      return data;
    });
};

export const addWatchs = async (id: string) => {
  return await post.findByIdAndUpdate(id, { $inc: { watched: 1 } });
}

export const addLikes = async (id: string) => {
  return await post.findByIdAndUpdate(id, { $inc: { like: 1 } });
}

export const getPost = async (id: string) => {
  await addWatchs(id);
  return await post.findById(id);
}

