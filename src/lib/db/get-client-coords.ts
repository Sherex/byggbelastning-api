/* eslint-disable-next-line @typescript-eslint/triple-slash-reference */
/// <reference path="../vtfk-logger.d.ts"/>
import { logger } from '@vtfk/logger'
import { pool } from './db'

export interface ClientCoordinate {
  campus: string
  building: string
  floor: string
  cid: string
  x: number
  y: number
}

export async function getClientCoords (): Promise<ClientCoordinate[]> {
  logger('debug', ['get-client-coords', 'getClientCoords', 'getting coordinates'])
  const query = 'SELECT campus, building, floor, cid, x, y FROM clients_coordinates'
  const response = await pool.query(query)
  logger('debug', ['get-client-coords', 'getClientCoords', 'getting coordinates', 'success'])
  return response.rows
}
