import { extendType, floatArg, intArg, nonNull, stringArg } from 'nexus'
import { findPub, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const menu = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createMenu', {
      type: 'Menu',
      args: {
        pubId: nonNull(intArg())
      },
      async resolve(_parent, { pubId }, ctx) {
        const pub = await findPub(ctx, pubId)
        if (pub?.ownerId === ctx.userId) {
          try {
            return await ctx.prisma.menu.create({
              data: {
                pubId
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
    t.field('createMenuSection', {
      type: 'MenuSection',
      args: {
        menuId: nonNull(intArg()),
        name: nonNull(stringArg()),
        image: stringArg()
      },
      async resolve(_parent, { menuId, name, image }, ctx) {
        try {
          return await ctx.prisma.menuSection.create({
            data: {
              menuId,
              name,
              image
            }
          })
        } catch (e) {
          handleError(errors.locationNotFound)
        }
      }
    })
    t.field('createMenuItem', {
      type: 'MenuItem',
      args: {
        sectionId: nonNull(intArg()),
        name: nonNull(stringArg()),
        image: stringArg(),
        price: floatArg(),
        description: nonNull(stringArg())
      },
      async resolve(_parent, { sectionId, name, image, price, description }, ctx) {
        try {
          return await ctx.prisma.menuItem.create({
            data: { sectionId, name, image, price, description }
          })
        } catch (e) {
          handleError(errors.locationNotFound)
        }
      }
    })
    t.field('updateMenuSection', {
      type: 'MenuSection',
      args: {
        id: nonNull(intArg()),
        name: stringArg(),
        image: stringArg()
      },
      async resolve(_parent, { id, name, image }, ctx) {
        try {
          return await ctx.prisma.menuSection.update({
            where: { id },
            data: {
              name,
              image
            }
          })
        } catch (e) {
          handleError(errors.locationNotFound)
        }
      }
    })
    t.field('updateMenuSection', {
      type: 'MenuSection',
      args: {
        id: nonNull(intArg()),
        name: stringArg(),
        image: stringArg()
      },
      async resolve(_parent, { id, name, image }, ctx) {
        try {
          return await ctx.prisma.menuSection.update({
            where: { id },
            data: {
              name,
              image
            }
          })
        } catch (e) {
          handleError(errors.locationNotFound)
        }
      }
    })
    t.field('deleteItem', {
      type: 'MenuItem',
      args: {
        id: nonNull(intArg())
      },
      async resolve(_parent, { id }, ctx) {
        try {
          return await ctx.prisma.menuItem.delete({
            where: { id }
          })
        } catch (e) {
          handleError(errors.locationNotFound)
        }
      }
    })
  }
})
