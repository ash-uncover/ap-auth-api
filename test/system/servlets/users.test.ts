import mongoose from 'mongoose'
import request from 'supertest'

import { LogConfig } from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'

import app from '../../../src/rest'
import SCHEMAS from '../../../src/database/schemas'
import CONFIG from '../../../src/configuration'

import {
  resetDatabase,
  ACCOUNT_1,
  AUTH_TOKEN_1,
  USER_1,
  MONGO_CONNECTION
} from '../test.data'

describe('/users', () => {

  beforeAll(async () => {
    try {
      await mongoose.connect(MONGO_CONNECTION, {
        bufferCommands: false
      })
    } catch (error) {
      console.error('Failed to connect mongo')
    }
  })

  beforeEach(async () => {
    await resetDatabase()
    await SCHEMAS.ACCOUNTS.model.create(ACCOUNT_1)
    return await SCHEMAS.USERS.model.create(USER_1)
  })

  afterAll(async () => {
    try {
      return await mongoose.disconnect()
    } catch (error) {
      console.error('Failed to disconnect from mongo')
    }
  })

  describe('/', () => {

    describe('POST', () => {

      test('when no token is provided', () => {
        return request(app)
          .post(`/rest/users`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
          })
          .catch((error) => {
            expect(error).toBe(null)
          })
      })

      test('when payload format is invalid', () => {
        return request(app)
          .post(`/rest/users`)
          .set({
            Authorization: AUTH_TOKEN_1 ,
            ['Content-type']: 'application/json'
          })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.BAD_REQUEST)
          })
          .catch((error) => {
            expect(error).toBe(null)
          })
      })

      test.only('when posting a valid user', () => {
        return request(app)
          .post(`/rest/users`)
          .set({
            Authorization: AUTH_TOKEN_1 ,
            ['Content-type']: 'application/json'
          })
          .send({
            id: 'usertest',
            name: 'name',
            description: 'description'
          })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.CREATED)
          })
          .catch((error) => {
            expect(error).toBe(null)
          })
      })
    })

    describe('/:userId', () => {

      describe('GET', () => {

        test('When no token is provided', () => {
          return request(app)
            .get(`/rest/users/${USER_1.id}`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When accessing a user that does not exist', () => {
          return request(app)
            .get('/rest/users/dummy')
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When a valid token is provided', () => {
          return request(app)
            .get(`/rest/users/${USER_1.id}`)
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })
      })

      describe('PATCH', () => {

        test('When no token is provided', () => {
          return request(app)
            .patch(`/rest/users/${USER_1.id}`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When accessing a user that does not exist', () => {
          return request(app)
            .patch('/rest/users/dummy')
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })
      })

      describe('DELETE', () => {

        test('When no token is provided', () => {
          return request(app)
            .delete(`/rest/users/${USER_1.id}`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When accessing a user that does not exist', () => {
          return request(app)
            .delete('/rest/users/dummy')
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When deleting current user', () => {
          return request(app)
            .delete(`/rest/users/${USER_1.id}`)
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.REMOVED)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When deleting an existing user', () => {
          return request(app)
            .delete(`/rest/users/${USER_1.id}`)
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.REMOVED)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })
      })

      describe('/avatar', () => {

        test('When not authentified', () => {
          return request(app)
            .post(`/rest/users/${USER_1.id}/avatar`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When not authentified with the correct user', () => {
          return request(app)
            .post(`/rest/users/${USER_1.id}/avatar`)
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When no data is sent', () => {
          return request(app)
            .post(`/rest/users/${USER_1.id}/avatar`)
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.BAD_REQUEST)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })

        test('When updating the correct avatar', () => {
          return request(app)
            .post(`/rest/users/${USER_1.id}/avatar`)
            .set({ Authorization: AUTH_TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
            .catch((error) => {
              expect(error).toBe(null)
            })
        })
      })
    })
  })
})
