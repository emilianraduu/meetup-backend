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
        endHour: stringArg(),
        waiterId: intArg()
      },
      async resolve(_parent, { waiterId, pubId, tableId, locationId, endHour, date }, ctx) {
        const pub = await findPub(ctx, pubId)
        if (pub) {
          try {
            const reservation = await ctx.prisma.reservation.create({
              data: {
                pubId, tableId, locationId, endHour, userId: ctx.userId, date
              },
              include: {
                location: true,
                pub: true,
                table: true
              }
            })
            await ctx.prisma.notification.create({
              data: {
                waiterId: waiterId,
                userId: ctx.userId,
                reservationId: reservation.id
              }
            })
            ctx.pubsub.publish('Notificaiton')
            return reservation
          //  creare notificare in tabel
          //  trimirere cu ws la waiterId
          //  waiterId
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
