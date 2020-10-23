const { gql } = require("apollo-server");
module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    user: User
    likeCount: Int!
    commentCount: Int!
  }

  extend type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  extend type Mutation {
    createPost(body: String!): Post!
    deletePost(postId: ID!): Post!
  }
  extend type Subscription {
    newPost: Post!
  }
`;
