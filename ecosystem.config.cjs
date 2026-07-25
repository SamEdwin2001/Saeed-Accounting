/**
 * PM2 process definition for the production server.
 *
 * One process serves both the API and the built frontend (see the dist/ block
 * in backend/server.js), so CloudPanel only needs a single reverse-proxy
 * target on PORT.
 *
 * .cjs because package.json sets "type": "module" and PM2 reads this file with
 * require().
 *
 * Usage on the server:
 *   pm2 start ecosystem.config.cjs
 *   pm2 save && pm2 startup     # survive a reboot
 *   pm2 logs saeed-accounting
 */
module.exports = {
  apps: [
    {
      name: 'saeed-accounting',
      script: 'backend/server.js',
      cwd: __dirname,
      /* Env values live in backend/.env (loaded by backend/env.js), not here —
         this file is committed and must not carry secrets. NODE_ENV is the one
         exception: it changes Express behaviour and is not a secret. */
      env: { NODE_ENV: 'production' },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      /* A boot loop from a bad DB password should back off, not hammer MySQL:
         server.js exits on a failed init() by design. */
      restart_delay: 4000,
      max_memory_restart: '400M',
      time: true,
    },
  ],
}
