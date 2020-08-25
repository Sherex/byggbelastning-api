import { mergeSchemas } from 'apollo-server-express'
import * as location from './locations'

export const schema = mergeSchemas({
  schemas: [
    location.query
  ],
  resolvers: [
    location.resolvers
  ]
})
