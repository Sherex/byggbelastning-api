import { logger } from '@vtfk/logger'
import format from 'pg-format'
import { pool } from './db'

export interface ClientCount {
  time: Date
  count: number
}

export interface GetClientCountOptions {
  location: string
  building?: string
  floor?: string
  timespan?: {
    from?: Date
    to?: Date
  }
}

export async function getClientCount (options: GetClientCountOptions): Promise<ClientCount[]> {
  console.log('###' + options.location)
  const queryVariables = []
  if (typeof options.timespan?.from !== 'undefined') queryVariables.push(options.timespan?.from)
  if (typeof options.timespan?.to !== 'undefined') queryVariables.push(options.timespan?.to)
  if (typeof options.building !== 'undefined') queryVariables.push(options.building)
  if (typeof options.floor !== 'undefined') queryVariables.push(options.floor)

  logger('debug', ['get-client-count', 'getClientCount', 'getting client count'])
  const query = format(`
  SELECT
    time,
    assocount as count
  FROM clients_location
  WHERE
    ${typeof options.timespan?.from !== 'undefined' ? 'time > %L AND' : ''}
    ${typeof options.timespan?.to !== 'undefined' ? 'time < %L AND' : ''}
    ${typeof options.building !== 'undefined' ? 'building = %L AND' : ''}
    ${typeof options.floor !== 'undefined' ? 'floor = %L AND' : ''}
    location = %L
  ORDER BY time`,
  ...queryVariables,
  options.location
  )

  const response = await pool.query<ClientCount>(query)
  logger('debug', ['get-client-count', 'getClientCount', 'getting client count', 'success'])
  return response.rows
}
