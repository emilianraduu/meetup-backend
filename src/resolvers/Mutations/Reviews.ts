import { booleanArg, extendType, intArg, nonNull, stringArg } from 'nexus'
import { findPub, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const reviews = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createReview', {
      type: 'Review',
      args: {
        rating: nonNull(intArg()),
        comment: stringArg(),
        pubId: nonNull(intArg()),
        anonymous: booleanArg()
      },
      async resolve(_parent, { pubId, comment, rating, anonymous = false }, ctx) {
        const pub = await findPub(ctx, pubId)
        if (pub) {
          try {
            const review = await ctx.prisma.review.create({
              data: {
                rating,
                userId: ctx.userId,
                comment,
                pubId: pubId,
                anonymous
              }
            })
            await ctx.prisma.pub.update({
              where: { id: pubId },
              data: {
                avgRating: ((pub.avgRating * pub.numberOfRatings) + rating) / (pub.numberOfRatings + 1),
                numberOfRatings: pub.numberOfRatings + 1
              }
            })
            return review
          } catch (e) {
            handleError(errors.scheduleAlreadyExists)
          }
        } else {
          handleError(errors.pubNotFound)
        }
      }
    })
  }
})
