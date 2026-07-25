/* Loads backend/.env into process.env. This lives in its own module, imported
   *first* by server.js, because ES module imports are evaluated before any
   top-level code — so db.js (which builds the MySQL pool from DB_* the moment
   it's imported) would otherwise run before an inline dotenv.config() and see
   empty credentials. Importing this module first guarantees the env is loaded
   before db.js is evaluated. */
import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') })
