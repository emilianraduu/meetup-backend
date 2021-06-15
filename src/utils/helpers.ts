import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { sign, verify } from 'jsonwebtoken'
import { APP_SECRET, tokens } from './constants'
import { Context, Token } from '../types'

export const handleError = (error: any) => {
  // add any other logging mechanism here e.g. Sentry
  throw error
}

export const generateAccessToken = (userId: number) => {
  return sign(
    {
      userId,
      type: tokens.access.name,
      timestamp: Date.now()
    },
    APP_SECRET,
    {
      expiresIn: tokens.access.expiry
    }
  )
}

export const prisma = new PrismaClient()
export const pubsub = new PubSub()

export const createContext = (ctx: any): Context => {
  let userId: number
  try {
    let Authorization = ''
    try {
      // for queries and mutations
      Authorization = ctx.req.get('Authorization')
    } catch (e) {
      // specifically for subscriptions as the above will fail
      Authorization = ctx?.connection?.context?.Authorization
    }
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token

    if (!verifiedToken.userId && verifiedToken.type !== tokens.access.name)
      userId = -1
    else userId = verifiedToken.userId
  } catch (e) {
    userId = -1
  }
  return {
    ...ctx,
    prisma,
    pubsub,
    userId
  }
}

export const findPub = async (ctx: Context, pubId: number): Promise<any> => {
  let pub
  try {
    pub = await ctx.prisma.pub.findUnique({
      where: {
        id: pubId
      }
    })
  } catch (e) {
    return false
  }

  return pub
}

export const findUser = async (ctx: Context): Promise<any> => {
  let user = null
  try {
    user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId
      }
    })
  } catch (e) {
    return false
  }

  return user
}

export const getTables = async (ctx: Context, locationId: number): Promise<any> => {
  return await ctx.prisma.table.findMany({
    where: { locationId }
  })
}
