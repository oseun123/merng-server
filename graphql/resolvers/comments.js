const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const commentsResolvers = {
  Mutation: {
    createComment: async (parent, args, context, info) => {
      try {
        const { postId, body } = args;
        const user = checkAuth(context);
        if (body.trim() === "") {
          throw new UserInputError("Empty comment", {
            errors: {
              body: "Comment body must not be empty",
            },
          });
        }
        const post = await Post.findById(postId);
        if (post) {
          post.comments.unshift({
            body,
            username: user.username,
            createdAt: new Date().toISOString(),
          });
          const savedPost = await post.save();
          return savedPost;
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteComment: async (parent, args, context, info) => {
      try {
        const { postId, commentId } = args;
        const user = checkAuth(context);
        const post = await Post.findById(postId);
        if (post) {
          const commentIndex = post.comments.findIndex(
            (c) => c.id === commentId
          );
          if (post.comments[commentIndex].username === user.username) {
            post.comments.splice(commentIndex, 1);
            const savedPost = await post.save();
            return savedPost;
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = commentsResolvers;
