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
  }

  type User {
    id: Int! @unique
    username: String!
    about: String
  }

  type Query {
    allLinks: [Link]
    link(id: Int!): Link
    allUsers: [User]
    user(id: Int!): User
  }
`

const links = [
  { id: 0, url: 'https://example.com', description: 'example site' },
  { id: 1, url: 'https://google.com', description: 'Google site' },
  { id: 2, url: 'https://Microsoft.com', description: 'Microsoft site' },
  { id: 3, url: 'https://aol.com' },
]

const users = [
  { id: 0, username: 'user1', about: 'user about1' },
  { id: 1, username: 'user2', about: 'user about2' },
]

const resolvers = {
  Query: {
    allLinks: () => links,
    link: (_, { id }) => find(links, { id }),
    allUsers: () => users,
    user: (_, { id }) => find(users, { id }),
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
