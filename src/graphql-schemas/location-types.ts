import { gql, IResolvers } from 'apollo-server-express'
import { getLocationTypes, LocationType } from '../lib/db'

export const query = gql`
  type Query {
    locationTypes(id: [Int], name: [String], code: [String]): [LocationType]
  }

  type LocationType {
    id: Int
    code: String
    name: String
    locationCount: Int
    locations: [Location]
  }
`

export const resolvers: IResolvers<LocationType, any> = {
  Query: {
    locationTypes: async (parent, args, ctx) => {
      const types = await getLocationTypes()
      if (Array.isArray(args.id)) return types.filter(type => args.id.includes(type.id))
      if (Array.isArray(args.code)) return types.filter(type => args.code.includes(type.code))
      if (Array.isArray(args.name)) return types.filter(type => args.name.includes(type.name))
      return types
    }
  },
  LocationType: {
    id: (parent, args, ctx) => parent.id,
    code: (parent, args, ctx) => parent.code,
    name: (parent, args, ctx) => parent.name,
    locationCount: (parent, args, ctx) => parent.locationIds.length,
    locations: (parent, args, ctx) => parent.locationIds.map(id => ({ locationId: id }))
  }
}
