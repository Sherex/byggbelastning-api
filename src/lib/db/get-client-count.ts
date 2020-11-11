import { logger } from '@vtfk/logger'
import format from 'pg-format'
import { pool } from './db'

export interface GetClientCountOptions {
  from?: string
  to?: string
}
export interface ClientCount {
  time: Date
  locationId: number
  clientCount: number
}

export interface ClientCountResponse {
  time: Date
  locationId: number
  clientCount: number
}

export async function getClientCount (options: GetClientCountOptions): Promise<ClientCount[]> {
  // TODO: Implement timespan (to >= 24h)
  options.from = options.from ?? '48h'
  options.to = options.to ?? '24h'

  logger('debug', ['get-client-coords', 'getClientCoords', 'getting coordinates'])
  const query = `
    SELECT
      TIME_BUCKET_GAPFILL('1h', cc.first_located) AS "time", 
      lv.location_id AS "locationId",
      COUNT(DISTINCT(cc.cid)) AS "clientCount"
    FROM client_coordinate cc
    RIGHT JOIN location_view lv
      ON cc.floor_id = lv.floor_id
    WHERE
      cc.first_located > (now() - INTERVAL '24h')::DATE AND
      cc.first_located < (now() - INTERVAL '0h')::DATE
    GROUP BY
      "time",
      lv.location_id,
      lv.location_name
    ORDER BY
      "time" DESC;`

  const queryTime = Date.now()
  const response = await pool.query<ClientCountResponse>(format(query, options.from, options.to))
  logger('debug', ['get-client-coords', 'getClientCoords', 'getting coordinates', 'success', 'query time', `${Date.now() - queryTime}ms`])
  return response.rows
}

export async function getClientCountArray (options: readonly GetClientCountOptions[]): Promise<ClientCount[][]> {
  return await Promise.all(options.map(getClientCount))
}
