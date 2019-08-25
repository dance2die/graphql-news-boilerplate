import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

const schema = buildSchema(`
  type Link {
      _id: Int!
      url: String!
      description: String!
  }

  type User {
    _id: Int!
    name: String!
  }

  type Query {
      allLinks: [Link!]!
      link(_id: Int!): Link!

      allUsers: [User!]!
      user(_id: Int!): User!
      userName(_id: Int!): String!
  }
`)

const links = [
  { _id: 0, url: 'https://example.com', description: 'example site' },
  { _id: 1, url: 'https://google.com', description: 'Google site' },
  { _id: 2, url: 'https://Microsoft.com', description: 'Microsoft site' },
]

const users = [{ _id: 0, name: 'user1' }, { _id: 1, name: 'user2' }]

const rootValue = {
  allLinks: () => links,
  // eslint-disable-next-line no-underscore-dangle
  link: ({ _id }) => links.filter(link => link._id === _id)[0],

  allUsers: () => users,
  // eslint-disable-next-line no-underscore-dangle
  user: ({ _id }) => users.filter(user => user._id === _id)[0],
  // eslint-disable-next-line no-underscore-dangle
  userName: ({ _id }) => users.filter(user => user._id === _id)[0].name,
}

const app = express()
const graphqlHTTPOptions = {
  schema,
  rootValue,
  graphiql: true,
}
app.use('/graphql', graphqlHTTP(graphqlHTTPOptions))
app.listen(4000, () => console.log('🏃‍♂️ server is running on port 4000'))
