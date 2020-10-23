const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const likesResolvers = {
  Mutation: {
    async likePost(parent, args, context, info) {
      try {
        const { postId } = args;
        const user = checkAuth(context);
        const post = await Post.findById(postId);
        if (post) {
          if (post.likes.find((like) => like.username === user.username)) {
            // post already liked, unlike it
            post.likes = post.likes.filter(
              (like) => like.username !== user.username
            );
          } else {
            // Not liked, like it
            post.likes.push({
              username: user.username,
              createdAt: new Date().toISOString(),
            });
          }
          const savedPost = await post.save();
          return savedPost;
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = likesResolvers;
