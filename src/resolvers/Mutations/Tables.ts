import { booleanArg, extendType, intArg, nonNull, stringArg } from 'nexus'
import { findPub, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const tables = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTable', {
      type: 'Table',
      args: {
        pubId: nonNull(intArg()),
        name: stringArg(),
        blocked: booleanArg(),
        reason: stringArg(),
        position: nonNull(intArg()),
        locationId: nonNull(intArg()),
        waiterId: intArg(),
        count: nonNull(intArg())
      },
      async resolve(_parent, { pubId,
        name,
        blocked,
        reason,
        position,
        locationId,
        count,
        waiterId }, ctx) {
        const pub = await findPub(ctx, pubId)
        if (pub?.ownerId === ctx.userId) {
          try {
            return await ctx.prisma.table.create({
              data: {
                count,
                name,
                blocked,
                reason,
                position,
                locationId,
                waiterId
              },
              include: {
                waiter: true,
                location: true,
              }
            })
          } catch (e) {
            handleError(errors.locationNotFound)
          }
        } else {
          handleError(errors.pubNotFound)
        }
      }
    })
    t.field('updateTable', {
      type: 'Table',
      args: {
        id: nonNull(intArg()),
        count: intArg(),
        blocked: booleanArg(),
        reason: stringArg(),
        position: intArg(),
        name: stringArg(),
        waiterId: intArg(),
      },
      async resolve(_parent, { id, count, blocked, reason, position, name, waiterId }, ctx) {
          try {
            return await ctx.prisma.table.update({
              where: { id },
              data: {
                count,
                blocked,
                reason,
                position,
                name,
                waiterId
              },
              include: {
                waiter: true,
                location: true,
              }
            })
          } catch (e) {
            handleError(errors.scheduleAlreadyExists)
          }
      }
    })
    t.field('deleteTable', {
      type: 'Table',
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_parent, { id }, ctx) {
        try {
          return await ctx.prisma.table.delete({
            where: { id },
          })
        } catch (e) {
          handleError(errors.scheduleAlreadyExists)
        }
      }
    })
  }
})
