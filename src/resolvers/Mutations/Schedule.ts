import { extendType, intArg, nonNull, stringArg } from 'nexus'
import { findPub, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const schedule = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSchedule', {
      type: 'Schedule',
      args: {
        dayOfWeek: stringArg(),
        timeStart: stringArg(),
        timeEnd: stringArg(),
        pubId: nonNull(intArg())
      },
      async resolve(_parent, { pubId, dayOfWeek, timeStart, timeEnd }, ctx) {
        const pub = await findPub(ctx,pubId)
        if(pub?.ownerId === ctx.userId) {
          try {
            return await ctx.prisma.schedule.create({
              data: {
                dayOfWeek,
                timeStart,
                timeEnd,
                pubId: pubId
              }
            })
          } catch (e) {
            handleError(errors.scheduleAlreadyExists)
          }
        } else {
          handleError(errors.pubNotFound)
        }
      }
    })
    t.field('updateSchedule', {
      type: 'Schedule',
      args: {
        dayOfWeek: stringArg(),
        timeStart: stringArg(),
        timeEnd: stringArg(),
        pubId: nonNull(intArg()),
        id: nonNull(intArg())
      },
      async resolve(_parent, { id, pubId, dayOfWeek, timeStart, timeEnd }, ctx) {
        const pub = await findPub(ctx,pubId)
        if(pub?.ownerId === ctx.userId) {
          try {
            return await ctx.prisma.schedule.update({
              where: { id },
              data: {
                dayOfWeek,
                timeStart,
                timeEnd,
              }
            })
          } catch (e) {
            handleError(errors.scheduleAlreadyExists)
          }
        } else {
          handleError(errors.pubNotFound)
        }
      }
    })
  }
})
