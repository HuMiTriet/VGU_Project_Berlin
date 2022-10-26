import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import passport from 'passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'
import { env } from './env'

const { UNAUTHORIZED } = StatusCodes

export const fabricAPIKeyStrategy: HeaderAPIKeyStrategy =
  new HeaderAPIKeyStrategy(
    { header: 'x-api-key', prefix: '' },
    false,
    function (apikey, done) {
      console.log('Check X-API-KEY ' + apikey)
      if (apikey === env.ORG1_API_KEY) {
        const user = env.MSP_ID_ORG1
        console.log('User set to ' + user)
        done(null, user)
      } else if (apikey === env.ORG2_API_KEY) {
        const user = env.MSP_ID_ORG2
        console.log('User set to ' + user)
        done(null, user)
      } else {
        console.log('No valid X-API-KEY')
        return done(null, false)
      }
    }
  )

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Allow all OPTIONS method to go through authentication, prevent CORS policy
  if (req.method == 'OPTIONS') {
    return next()
  }

  passport.authenticate(
    'headerapikey',
    { session: false },
    (err: Error, user: string) => {
      if (err) return next(err)
      if (!user)
        return res.status(UNAUTHORIZED).json({
          status: UNAUTHORIZED,
          reason: 'NO_VALID_APIKEY',
          timestamp: new Date().toISOString()
        })

      req.logIn(user, { session: false }, async err => {
        if (err) {
          return next(err)
        }
        return next()
      })
    }
  )(req, res, next)
}
