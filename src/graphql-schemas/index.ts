import { mergeSchemas } from 'apollo-server-express'
import * as location from './locations'
import * as locationTypes from './location-types'

export const schema = mergeSchemas({
  schemas: [
    location.query,
    locationTypes.query
  ],
  resolvers: [
    location.resolvers,
    locationTypes.resolvers
  ]
})
