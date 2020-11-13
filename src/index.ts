import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { logger } from '@vtfk/logger'
import { schema } from './graphql-schemas'
import { getContext } from './lib/get-context'

const server = new ApolloServer({
  schema,
  context: getContext()
})

const app = express()
server.applyMiddleware({ app })

const port = process.env.APP_PORT ?? 4000

app.listen({ port }, () => {
  logger('info', ['index', 'server ready!', 'listening on port', String(port)])
})
