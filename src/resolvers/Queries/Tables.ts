import { intArg, list, nonNull, queryField } from 'nexus'
import { errors } from '../../utils/constants'
import { handleError } from '../../utils/helpers'


export const getWaiterTables = queryField('waiterTables', {
  type: list('Table'),
  async resolve(_parent, _args, ctx) {
    try {
      return await ctx.prisma.table.findMany({
        where: { waiterId: ctx.userId },
        include: {
          location: true,
          waiter: true,
          reservations: {
            include: {
              user: true
            }
          },
        }
      })
    } catch (e) {
      handleError(errors.locationNotFound)
    }
  }
})
