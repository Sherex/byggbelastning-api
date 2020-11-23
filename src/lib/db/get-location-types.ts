import { logger } from '@vtfk/logger'
import { pool } from './db'

interface LocationTypesResponse {
  id: number
  code: string
  name: string
  location_ids: number[]
}
export interface LocationType {
  id: number
  code: string
  name: string
  locationIds: number[]
}
export async function getLocationTypes (): Promise<LocationType[]> {
  logger('debug', ['get-location-types', 'getLocationsTypes', 'getting location types'])
  const queryTime = Date.now()
  const query = `
  SELECT
    lt.id,
    lt.code,
    lt.name,
    jsonb_agg(l.id) AS location_ids
  FROM "location_type" lt
  LEFT JOIN location l
    ON lt.id = l.type_id
  GROUP BY lt.id, lt.code, lt.name
  ORDER BY lt.id`
  const response = await pool.query<LocationTypesResponse>(query)
  logger('debug', ['get-location-types', 'getLocationsTypes', 'getting location types', 'success', 'query time', `${Date.now() - queryTime}ms`])

  const types: LocationType[] = response.rows.map(type => ({
    id: type.id,
    code: type.code,
    name: type.name,
    locationIds: type.location_ids
  }))
  return types
}
