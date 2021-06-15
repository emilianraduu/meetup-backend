import { AuthenticationError, UserInputError } from 'apollo-server'

export const tokens = {
  access: {
    name: 'ACCESS_TOKEN',
    expiry: '1d',
  },
}

export const APP_SECRET = process.env.APP_SECRET

export const isDev = () => process.env.NODE_ENV === 'development'

export const errors = {
  notAuthenticated: new AuthenticationError('Unauthenticated user!'),
  userAlreadyExists: new UserInputError('User already exists!'),
  pubAlreadyExists: new UserInputError('Location already exists!'),
  scheduleAlreadyExists: new UserInputError('Schedule already exists!'),
  scheduleNotFOund: new UserInputError('Schedule not found!'),
  invalidUser: new UserInputError('Invalid username or password'),
  invalidPub: new UserInputError('Invalid pub'),
  notOwner: new UserInputError('This user is not an owner'),
  pubNotFound: new UserInputError('Pub not found.'),
  locationNotFound: new UserInputError('Location not found.'),
  reservationNotFound: new UserInputError('Reservation not found.'),
}

export const user_status = {
  admin: 'OWNER',
  client: 'CLIENT',
  waiter: 'WAITER'
}
