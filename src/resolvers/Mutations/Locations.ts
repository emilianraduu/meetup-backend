import { extendType, intArg, nonNull, stringArg } from 'nexus'
import { findPub, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const locations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createLocation', {
      type: 'Location',
      args: {
        pubId: nonNull(intArg()),
        name: nonNull(stringArg()),
        rows: nonNull(intArg()),
        columns: nonNull(intArg())
      },
      async resolve(_parent, { pubId, name, rows, columns }, ctx) {
        if (await findPub(ctx, pubId)) {
          try {
            return await ctx.prisma.location.create({
              data: {
                pubId,
                name,
                rows,
                columns
              },
              include: {
                tables: true,
                reservations: true
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
    t.field('updateLocation', {
      type: 'Location',
      args: {
        id: nonNull(intArg()),
        pubId: nonNull(intArg()),
        name: stringArg(),
        rows: intArg(),
        columns: intArg()
      },
      async resolve(_parent, { pubId, id, name, rows, columns }, ctx) {
        if (await findPub(ctx, pubId)) {
          try {
            return await ctx.prisma.location.update({
              where: { id },
              data: {
                rows,
                name,
                columns
              },
              include: {
                tables: true,
                reservations: true
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
    t.field('deleteLocation', {
      type: 'Location',
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_parent, { id }, ctx) {
          try {
            return await ctx.prisma.location.delete({
              where: {
                id
              },
            })
          } catch (e) {
            handleError(errors.locationNotFound)
          }
        }
    })
  }
})
