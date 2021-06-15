import { floatArg, intArg, list, nonNull, queryField } from 'nexus'
import { getDistance } from 'geolib'
import { errors } from '../../utils/constants'
import { Pub } from '.prisma/client'
import { handleError } from '../../utils/helpers'

export const getPubs = queryField('pubs', {
  type: list('Pub'),
  args: {
    latitude: floatArg(),
    longitude: floatArg(),
    maxDistance: intArg(),
    avgRating: intArg()
  },
  async resolve(_parent, { latitude, longitude, maxDistance,avgRating }, ctx) {
    try {
      const pubs = await ctx.prisma.pub.findMany({
        where: { visible: true },
        include: {
          reservations: true,
          locations: {
            include: {
              tables: {
                include: { reservations: true }
              }
            }
          }
        }
      })
      const newPubs: Pub[] | PromiseLike<Pub[]> = []
      pubs.forEach((pub: Pub) => {
        if (latitude && longitude) {
          const distance =
            getDistance({ latitude, longitude }, { latitude: pub.latitude, longitude: pub.longitude })
          if (distance < maxDistance) {
            newPubs.push({ ...pub })
          }
        } else {
          newPubs.push(pub)
        }
      })
      return newPubs
    } catch (e) {
      console.log(e)
      handleError(errors.invalidUser)
    }
  }
})


export const getMyPubs = queryField('myPubs', {
  type: list('Pub'),
  async resolve(_parent, _args, ctx) {
    try {
      return await ctx.prisma.pub.findMany({
        where: { ownerId: ctx.userId },
        include: {
          reservations: true,
          locations: {
            include: {
              tables: {
                include: { reservations: true }
              }
            }
          }
        }
      })
    } catch (e) {
      console.log(e)
      handleError(errors.invalidUser)
    }
  }
})

export const getPub = queryField('pub', {
  type: 'Pub',
  args: {
    id: nonNull(intArg()),
    latitude: floatArg(),
    longitude: floatArg()
  },
  async resolve(_parent, { id, latitude, longitude }, ctx) {
    try {
      const pub = await ctx.prisma.pub.findUnique({
        where: { id },
        include: {
          reservations: true,
          reviews: {
            include: {
              user: true
            }
          },
          menu: {
            include: {
              sections: {
                include: {
                  items: true
                }
              }
            }
          },
          locations: {
            include: {
              tables: {
                include: {
                  reservations: true
                }
              }
            }
          },
          waiters: true
        }
      })
      const distance = latitude && longitude && getDistance({ latitude, longitude }, {
        latitude: pub.latitude,
        longitude: pub.longitude
      })

      return { ...pub, distance }
    } catch (e) {
      handleError(errors.pubNotFound)
    }
  }
})