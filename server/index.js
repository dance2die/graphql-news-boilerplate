import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

const schema = buildSchema(`
    type Query {
        hello: String
    }
`)

const rootValue = {
  hello: () => 'Hello GraphQL world!',
}

const app = express()
const graphqlHTTPOptions = {
  schema,
  rootValue,
  graphiql: true,
}
app.use('/graphql', graphqlHTTP(graphqlHTTPOptions))
app.listen(4000, () => console.log('server is running on port 4000'))
