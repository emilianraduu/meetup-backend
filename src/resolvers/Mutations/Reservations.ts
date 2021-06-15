import { extendType, intArg, nonNull, stringArg } from 'nexus'
import { findPub, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const reservations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createReservation', {
      type: 'Reservation',
      args: {
        pubId: nonNull(intArg()),
        tableId: nonNull(intArg()),
        locationId: nonNull(intArg()),
        date: nonNull(stringArg()),
        endHour: stringArg()
      },
      async resolve(_parent, { pubId, tableId, locationId, endHour, date }, ctx) {
        const pub = await findPub(ctx, pubId)
        if (pub) {
          try {
            return await ctx.prisma.reservation.create({
              data: {
                pubId, tableId, locationId, endHour, userId: ctx.userId, date
              }
            })
          } catch (e) {
            console.log(e)
            handleError(errors.locationNotFound)
          }
        } else {
          handleError(errors.pubNotFound)
        }
      }
    })
  }
})
