import { logger } from '@vtfk/logger'
import { Pool } from 'pg'
import { config } from '../../config'

export const pool = new Pool(config.db)
logger('info', ['db', 'db pool created'])
