/* eslint-disable-next-line @typescript-eslint/triple-slash-reference */
/// <reference path="../vtfk-logger.d.ts"/>
import { logger } from '@vtfk/logger'
import { Pool } from 'pg'
import { config } from '../../config'

export const pool = new Pool(config.db)
logger('info', ['db', 'db pool created'])
