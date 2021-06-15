import { rule, shield } from 'graphql-shield'
import { Context } from '../types'
import { handleError } from './helpers'
import { errors } from './constants'

export const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (_parent, _args, ctx: Context) => {
      try {
        if (ctx.userId === -1) {
          return handleError(errors.notAuthenticated)
        }
        return true
      } catch (e) {
        return e
      }
    }
  )
}

export const permissions = shield({
  // Mutation: { createPub: rules.isAuthenticatedUser },
  Query: {
    me: rules.isAuthenticatedUser
  }
}, {
  debug: true
})
