import { withFilter } from 'apollo-server'
import { subscriptionField, stringArg, nonNull, intArg } from 'nexus'

export const reserveTable = subscriptionField('newReservation', {
  type: 'Table',
  args: {
    tableId: nonNull(intArg()),
  },
  subscribe: withFilter(
    (_root, _args, ctx) => ctx.pubsub.asyncIterator('newReservation'),
    (payload, { roomId }) => {
      return payload.roomId === roomId
    }
  ),
  resolve: (payload) => payload,
})
