import { extendType, intArg, nonNull, stringArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import { findPub, generateAccessToken, handleError } from '../../utils/helpers'
import { APP_SECRET, errors, user_status } from '../../utils/constants'
import { verify } from 'jsonwebtoken'

export const user = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        status: stringArg({ default: user_status.client }),
        firstName: stringArg(),
        lastName: stringArg(),
        secret: stringArg()
      },
      async resolve(_parent, { email, password, status, firstName, lastName, secret }, ctx) {
        try {
          const hashedPassword = await hash(password, 10)
          if (secret && status === user_status.admin) {
            const secretStatus = verify(secret, APP_SECRET)
            if (!secretStatus) {
              handleError(errors.userAlreadyExists)
            }
          }
          const user = await ctx.prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              status,
              firstName,
              lastName
            },
            include: {
              notifications: true,
              reservations: {
                include: {
                  table: true,
                  pub: true,
                  location: true,
                  user: true
                }
              },
              reviews: {
                include: {
                  pub: true
                }
              },
              pub: { include: { locations: true } },
              tables: {
                include: {
                  reservations: true,
                  location: true
                }
              }
            }
          })
          const accessToken = generateAccessToken(user.id)
          return {
            accessToken,
            user
          }
        } catch (e) {
          handleError(errors.userAlreadyExists)
        }
      }
    })
    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      async resolve(_parent, { email, password }, ctx) {
        let user = null
        try {
          user = await ctx.prisma.user.findUnique({
            where: {
              email
            },
            include: {
              notifications: true,
              reservations: {
                include: {
                  table: true,
                  pub: true,
                  location: true,
                  user: true
                }
              },
              reviews: {
                include: {
                  pub: true
                }
              },
              pub: { include: { locations: true } },
              tables: {
                include: {
                  reservations: true,
                  location: true
                }
              }
            }
          })
        } catch (e) {
          handleError(errors.invalidUser)
        }

        if (!user) handleError(errors.invalidUser)

        const passwordValid = await compare(password, user.password)
        if (!passwordValid) handleError(errors.invalidUser)
        const accessToken = generateAccessToken(user.id)
        return {
          accessToken,
          user
        }
      }
    })
    t.field('updateUser', {
      type: 'User',
      args: {
        firstName: stringArg(),
        lastName: stringArg(),
        photo: stringArg(),
        id: nonNull(intArg())
      },
      async resolve(_parent, { firstName, lastName, photo, id }, ctx) {
        try {
          return await ctx.prisma.user.update({
            where: { id },
            data: {
              firstName,
              lastName,
              photo
            },
            include: {
              notifications: true,
              reservations: {
                include: {
                  pub: true,
                  location: true,
                  user: true,
                  table: true
                }
              },
              reviews: {
                include: {
                  pub: true
                }
              },
              pub: true,
              tables: {
                include: {
                  reservations: true,
                  location: true
                }
              }
            }
          })
        } catch (e) {
          console.log(e)
        }
      }
    })
    t.field('createWaiter', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        pubId: nonNull(intArg())
      },
      async resolve(_parent, { email, pubId }, ctx) {
        try {
          const user = await ctx.prisma.user.findUnique({
            where: { email }
          })
          if (!user) {
            return await ctx.prisma.user.create({
              data: {
                email,
                status: user_status.waiter,
                pubId
              }
            })
          } else {
            return await ctx.prisma.user.update({
              where: { id: user.id },
              data: {
                status: user_status.waiter,
                pubId
              }
            })
          }
        } catch (e) {
          handleError(errors.userAlreadyExists)
        }
      }
    })
    t.field('setWaiterPassword', {
      type: 'AuthPayload',
      args: {
        id: nonNull(intArg()),
        password: nonNull(stringArg())
      },
      async resolve(_parent, { id, password }, ctx) {
        try {
          const hashedPassword = await hash(password, 10)
          const user = await ctx.prisma.user.update({
            where: { id },
            data: {
              password: hashedPassword
            },
            include: {
              pub: { include: { locations: true } },
              tables: {
                include: {
                  reservations: true,
                  location: true
                }
              }
            }
          })
          const accessToken = generateAccessToken(user.id)
          return {
            accessToken,
            user
          }
        } catch (e) {
          handleError(errors.userAlreadyExists)
        }
      }
    })
    t.field('deleteWaiter', {
      type: 'User',
      args: {
        id: nonNull(intArg()),
        pubId: nonNull(intArg())
      },
      async resolve(_parent, { id, pubId }, ctx) {
        try {
          const pub = await findPub(ctx, pubId)
          if (pub?.ownerId === ctx.userId) {
            return await ctx.prisma.user.delete({
              where: { id }
            })
          }
        } catch (e) {
          handleError(errors.userAlreadyExists)
        }
      }
    })
  }
})
