import { intArg, nonNull, queryField } from 'nexus'
import { errors } from '../../utils/constants'
import { handleError } from '../../utils/helpers'

export const getTable = queryField('table', {
  type: 'Table',
  list: true,
  args: {
    locationId: nonNull(intArg())
  },
  async resolve(_parent, { locationId }, ctx) {
    try {
      return await ctx.prisma.table.findMany({
        where: { locationId },
        include: {
          location: true,
          waiter: true
        }
      })
    } catch (e) {
      handleError(errors.locationNotFound)
    }
  }
})
