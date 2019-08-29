import express from 'express'
import graphqlHTTP from 'express-graphql'
// import { buildSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import find from 'lodash/find'

const typeDefs = `
  type Link {
    id: Int! @unique
    url: String!
    description: String
    author: User!
    comments: [Comment]
  }

  type User {
    id: Int! @unique
    username: String!
    about: String
  }

  type Comment {
    id: Int! @unique
    parent: Comment
    comments: [Comment]
    author: User!
    content: String!
  }

  type Query {
    allLinks: [Link]
    link(id: Int!): Link
    allUsers: [User]
    user(id: Int!): User
  }
`

const links = [
  {
    id: 0,
    author: 0,
    url: 'https://example.com',
    description: 'example site',
    comments: [0, 4],
  },
  { id: 1, author: 1, url: 'https://google.com', description: 'Google site' },
]

const users = [
  { id: 0, username: 'user1', about: 'user about1' },
  { id: 1, username: 'user2', about: 'user about2' },
]

const commentsList = [
  { id: 0, parent: null, author: 0, content: 'Comment 1' },
  { id: 1, parent: 0, author: 1, content: 'Comment 2' },
  { id: 2, parent: 1, author: 0, content: 'Comment 3' },
  { id: 3, parent: 0, author: 2, content: 'Comment 4' },
  { id: 4, parent: null, author: 2, content: 'Comment 5' },
]

function getComments(commentId) {
  const comments = commentsList.filter(comment => comment.parent === commentId)
  return comments.length > 0 ? comments : null
}

const resolvers = {
  Query: {
    allLinks: () => links,
    link: (_, { id }) => find(links, { id }),
    allUsers: () => users,
    user: (_, { id }) => find(users, { id }),
  },
  Link: {
    author: ({ author }) => find(users, { id: author }),
    comments: ({ comments }) =>
      comments.map(i => find(commentsList, { id: i })),
  },
  Comment: {
    author: ({ author }) => find(users, { id: author }),
    comments: ({ id }) => getComments(id),
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const graphqlHTTPOptions = {
  schema,
  graphiql: true,
}
app.use('/graphql', graphqlHTTP(graphqlHTTPOptions))
app.listen(4000, () => console.log('🏃‍♂️ server is running on port 4000'))
