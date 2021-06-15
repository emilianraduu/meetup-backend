import { nonNull, queryField, stringArg } from 'nexus'

export const me = queryField('me', {
  type: 'User',
  async resolve(_parent, _args, ctx) {
    return await ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId
      },
      include: {
        notifications: true,
        reservations: {
          include: {
            table: true,
            pub: true,
            location: true,
            user: true
          }
        },
        reviews: {
          include: {
            pub: true
          }
        },
        pub: { include: {locations: true} },
        tables: {
          include: {
            reservations: true,
            location: true
          }
        }
      }
    })
  }
})

export const exists = queryField('exists', {
  type: 'Exists',
  args: {
    email: nonNull(stringArg())
  },
  async resolve(_parent, { email }, ctx) {

    const user = await ctx.prisma.user.findUnique({
      where: { email: email }
    })
    if (user) {
      return { exist: true, ...user, hasPassword: !!user.password }
    } else {
      return { exist: false, email: email }
    }
  }
})
