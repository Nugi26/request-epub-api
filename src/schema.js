const { gql } = require('apollo-server-express');
module.exports = gql`
  type Query {
    hello: String
    users: [User]
    searchBook(keywords: String!): SearchResult
    requestsFeed(
      pageNumber: Int
      orderBy: String
      orderDirection: String
    ): RequestsFeed
    getUser(id: ID!): User
    me: User!
    getBook(id: ID!): Book
    getSomeBooks(books: [ID]!): [Book]
  }

  type Mutation {
    addReq(book: BookInput!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(usernameOrEmail: String, password: String!): String!
    deleteReq(bookId: ID!): Boolean!
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

  type RequestsFeed {
    totalReqs: Int!
    requests: [Book]
  }

  type SearchResult {
    totalItems: Int
    items: [Book]
  }

  type Book {
    #id from books table
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
    #check if this book is requested by logged in user
    req_by_me: Boolean
    # count total requests for this book
    reqs_count: Int
    # check if result from gbookApi is already recorded in books table and return id if true. Only use this in searchBook() query
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
