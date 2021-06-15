import * as User from './User'
import * as Pubs from './Pubs'
import * as Tables from './Tables'
import * as Reservations from './Reservations'

export const Query = {
  ...User,
  ...Pubs,
  ...Tables,
  ...Reservations
}
