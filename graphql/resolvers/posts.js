const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const postsResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find()
          .populate("user")
          .sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(parent, args, context, info) {
      try {
        const { postId } = args;
        const post = await Post.findById(postId).populate("user");
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(parent, args, context, info) {
      try {
        const { body } = args;
        if (body.trim() === "") {
          throw new UserInputError("Post body must not be empty");
        }
        const user = checkAuth(context);
        const newPost = new Post({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
          user: user.id,
        });
        const post = await newPost.save();
        context.pubsub.publish("NEW_POST", {
          newPost: post,
        });
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deletePost(parent, args, context, info) {
      try {
        const { postId } = args;
        const user = checkAuth(context);
        const post = await Post.findById(postId);
        if (post && user.username === post.username) {
          const deletedPost = await post.delete();
          return deletedPost;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (parent, args, context, info) => {
        const { pubsub } = context;
        return pubsub.asyncIterator("NEW_POST");
      },
    },
  },
};

module.exports = postsResolvers;
