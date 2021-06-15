import { booleanArg, extendType, floatArg, intArg, nonNull, stringArg } from 'nexus'
import { findPub, findUser, handleError } from '../../utils/helpers'
import { errors, user_status } from '../../utils/constants'

export const pub = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPub', {
      type: 'Pub',
      args: {
        name: nonNull(stringArg()),
        address: nonNull(stringArg()),
        images: stringArg({ list: true }),
        latitude: nonNull(floatArg()),
        longitude: nonNull(floatArg()),
        currency: stringArg()
      },
      async resolve(_parent, { name, address, images, latitude, longitude, currency }, ctx) {
        const user = await findUser(ctx)
        if (user?.status === user_status.admin) {
          try {
            return await ctx.prisma.pub.create({
              data: {
                name,
                ownerId: user.id,
                address,
                images,
                latitude,
                currency,
                longitude
              }
            })

          } catch (e) {
            handleError(errors.pubAlreadyExists)
          }
        } else {
          handleError(errors.invalidUser)
        }
      }
    })
    t.field('updatePub', {
      type: 'Pub',
      args: {
        name: stringArg(),
        address: stringArg(),
        images: stringArg({ list: true }),
        latitude: floatArg(),
        longitude: floatArg(),
        currency: stringArg(),
        id: nonNull(intArg()),
      },
      async resolve(_parent, {  id, name, address, images, latitude, longitude, currency }, ctx) {
        try {
          const pub = await findPub(ctx, id)

          if (pub.ownerId === ctx.userId) {
            return await ctx.prisma.pub.update({
              where: { id: id },
              data: {
                name, address, images, latitude, longitude, currency
              }
            })
          } else {
            return handleError(errors.invalidUser)
          }
        } catch(e){
          handleError(errors.notAuthenticated)
        }
      }
    })
  }
})
