import * as fabric from './fabric'
import { server } from './server'
import https from 'https'
import http from 'http'
import fs from 'fs'
import { env } from './env'

/**
 * Start application gateway and API server
 * @author Thai Hoang Tam
 */
async function main() {
  // run the fabric gateway to connect to the HF
  await fabric.main().catch(error => {
    console.error('******** FAILED to run the fabric application:', error)
    process.exitCode = 1
  })

  // start API server
  const app = await server()
  const httpHost = `localhost:${env.HTTP_PORT}`
  const httpsHost = `localhost:${env.HTTPS_PORT}`

  http.createServer(app).listen(env.HTTP_PORT, () => {
    console.log(`HTTP API server running on ${httpHost}`)
  })
  https
    .createServer(
      {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
      },
      app
    )
    .listen(env.HTTPS_PORT, () => {
      console.log(`HTTPS API server running on ${httpsHost}`)
    })
}

main().catch(error => {
  console.error('******** FAILED to run the API server and gateway', error)
  process.exitCode = 1
})