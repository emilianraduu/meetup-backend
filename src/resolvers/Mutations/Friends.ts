import { extendType, intArg, nonNull } from 'nexus'
import { handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const friends = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addFriend', {
      type: 'Friend',
      args: {
        userId: nonNull(intArg()),
        friendId: nonNull(intArg())
      },
      async resolve(_parent, {
        friendId,
        userId
      }, ctx) {
        try {
          return ctx.prisma.friend.create({
            data: {
              friendId: friendId,
              userId
            },
            include: {
              friend: true
            }
          })
        } catch (e) {
          handleError(errors.userAlreadyExists)
        }
      }
    })

  }
})
