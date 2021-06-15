import * as Users from './User'
import * as Pubs from './Pubs'
import * as Schedule from './Schedule'
import * as Locations from './Locations'
import * as Menu from './Menu'
import * as Reviews from './Reviews'
import * as Reservations from './Reservations'
import * as Tables from './Tables'

export const Mutation = {
  ...Users,
  ...Pubs,
  ...Schedule,
  ...Locations,
  ...Menu,
  ...Reviews,
  ...Reservations,
  ...Tables
}
