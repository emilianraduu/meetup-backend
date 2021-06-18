import { booleanArg, extendType, intArg, nonNull, stringArg } from 'nexus'
import { findPub, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'
import moment from 'moment'
import { sendNotification } from '../index'
import sgMail from '@sendgrid/mail'

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
            sgMail.setApiKey(process.env.SENDGRID_KEY)
            const usr = await ctx.prisma.user.findUnique({ where: { id: ctx.userId } })
            const msg = {
              to: usr.email,
              from: 'emiradu98@icloud.com',
              subject: 'You made a reservation!',
              text: 'You made a reservation',
              html: '<strong>You made a reservation</strong>',
              template_id: 'd-c4fa49ac38624b9bb2bb2c86dcc5be15'
            }
            try {
              sgMail
                .send(msg)
                .then(() => {
                  console.log('Email sent')
                })
                .catch((error) => {
                  console.error(error)
                })
            } catch(e){
              console.log(e)
            }
            // await ctx.prisma.notification.create({
            //   data: {
            //     waiterId: waiterId,
            //     userId: ctx.userId,
            //     reservationId: reservation.id,
            //     read: false
            //   }
            // })
            const waiter = await ctx.prisma.user.findUnique({
              where: { id: waiterId }
            })
            let message = {
              app_id: process.env.ONE_SIGNAL_APP_ID,
              contents: { 'en': 'A new reservation was made for ' + moment(date).format('HH:mm') },
              email: waiter.email
            }
            sendNotification(message)
            return reservation
          } catch (e) {
            console.log(e)
            handleError(errors.locationNotFound)
          }
        } else {
          handleError(errors.pubNotFound)
        }
      }
    })
    t.field('updateReservation', {
      type: 'Reservation',
      args: {
        finished: booleanArg(),
        confirmed: booleanArg(),
        id: nonNull(intArg())
      },
      async resolve(_parent, { id, finished, confirmed }, ctx) {
        try {
          return await ctx.prisma.reservation.update({
            where: {id},
            data: {
              finished,
              confirmed,
              id
            }
          })
        }catch (e){
          console.log(e)
          handleError(errors.reservationNotFound)
        }
      }
    })
  }
})
