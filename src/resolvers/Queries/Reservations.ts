import { intArg, nonNull, queryField } from 'nexus'
import { errors } from '../../utils/constants'
import { handleError } from '../../utils/helpers'

export const getReservations = queryField('reservations', {
  type: 'Reservation',
  list: true,
  args: {
    id: intArg(),
    userId: intArg(),
    locationId: intArg(),
    pubId: intArg()
  },
  async resolve(_parent, { id, userId, locationId, pubId }, ctx) {
    try {
      return await ctx.prisma.reservation.findMany({
        where: { id, userId, locationId, pubId },
        include: {
          pub: true,
          location: true,
          user: true,
        }
      })
    } catch (e) {
      handleError(errors.reservationNotFound)
    }
  }
})

export const getReservation = queryField('reservation', {
  type: 'Reservation',
  args: {
    id: nonNull(intArg())
  },
  async resolve(_parent, { id }, ctx) {
    try {
      return await ctx.prisma.reservation.findUnique({
        where: { id }
      })
    } catch (e) {
      handleError(errors.reservationNotFound)
    }
  }
})
