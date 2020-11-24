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
      cc."time",
      lv.location_id AS "locationId",
      SUM(cc.auth_count) AS "clientCount"
    FROM client_count cc
    INNER JOIN location_view lv
      ON cc.floor_id = lv.floor_id
    WHERE
      cc."time" > (now() - INTERVAL '24h')::DATE AND
      cc."time" < (now() - INTERVAL '0h')::DATE
    GROUP BY
      cc."time",
      lv.location_id
    ORDER BY
      lv.location_id ASC,
      cc."time" ASC;`

  const queryTime = Date.now()
  const response = await pool.query<ClientCountResponse>(format(query, options.from, options.to))
  logger('debug', ['get-client-coords', 'getClientCoords', 'getting coordinates', 'success', 'query time', `${Date.now() - queryTime}ms`])
  return response.rows
}

export async function getClientCountArray (options: readonly GetClientCountOptions[]): Promise<ClientCount[][]> {
  return await Promise.all(options.map(getClientCount))
}
