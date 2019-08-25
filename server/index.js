import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

const schema = buildSchema(`
  type Link {
      _id: Int!
      url: String!
      description: String!
  }

  type Query {
      links: [Link!]!
      link(_id: Int!): Link!
  }
`)

const links = [
  { _id: 0, url: 'https://example.com', description: 'example site' },
  { _id: 1, url: 'https://google.com', description: 'Google site' },
  { _id: 2, url: 'https://Microsoft.com', description: 'Microsoft site' },
]
const rootValue = {
  links: () => links,
  link: ({ _id }) => links.filter(link => link._id === _id)[0],
}

const app = express()
const graphqlHTTPOptions = {
  schema,
  rootValue,
  graphiql: true,
}
app.use('/graphql', graphqlHTTP(graphqlHTTPOptions))
app.listen(4000, () => console.log('server is running on port 4000'))
