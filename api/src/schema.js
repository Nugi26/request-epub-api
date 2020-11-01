const { gql } = require("apollo-server-express");
module.exports = gql`
  type Query {
    users: [User]
    searchBook(keywords: String!): SearchResult
    getAllReqs: [Book]
    getBook(id: ID!): Book
  }

  type Mutation {
    addReq(book: BookInput!, userId: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(usernameOrEmail: String, password: String!): String!
    deleteReq(userId: ID!, bookId: ID!): Boolean!
  }

  input BookInput {
    gbook_id: ID
    title: String!
    subtitle: String
    authors: [String]
    publisher: String
    published_date: String
    description: String
    page_count: Int
    maturity_rating: String
    small_thumbnail: String
    thumbnail: String
    average_rating: String
    ratings_count: Int
  }

  type SearchResult {
    totalItems: Int
    items: [Book]
  }

  type Book {
    #id primary
    id: ID
    #gbookId for id from search results
    gbook_id: ID
    title: String
    subtitle: String
    authors: [String]
    publisher: String
    published_date: String
    description: String
    page_count: Int
    maturity_rating: String
    small_thumbnail: String
    thumbnail: String
    average_rating: String
    ratings_count: Int
    # count total requests for this book
    requests_count: Int
    # check if result from gbookApi is already recorded in books table and return id if true
    requestedId: ID
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    requests: [Book]
  }
`;
