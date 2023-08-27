import SCHEMAS from '../../database/schemas'

import ERRORS, {
  sendError
} from '../servlet-error'

import {
  defaultPost,
  defaultGet,
  defaultPut,
  defaultPatch,
  defaultDelete,
} from '../servlet-base'

import Logger from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'
const LOGGER = new Logger('REST-USERS')
const multer = require('multer')

export const postUserAvatar = function(req, res, next) {
  const upload = multer({ dest:'uploads/' }).single('avatar')
  upload(req, res, (error) => {
    if(error) {
      res.send(HttpUtils.HttpStatus.ERROR, error)
    }
    res.status(HttpUtils.HttpStatus.OK).json({file: req.file})
  })
}

export const postUser = function(req, res, next) {
  try {
    defaultPost(SCHEMAS.USERS, req, res, next, (error) => {
      if (error && error.code === 11000) {
        if (error.message.indexOf('name') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_USERNAME_INUSE)
        } else if (error.message.indexOf('email') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_EMAIL_INUSE)
        }
      } else if (error && error.name === 'ValidationError') {
        sendError(LOGGER, res, {
          status: HttpUtils.HttpStatus.BAD_REQUEST,
          error: error.message
        })
      } else {
        res.send(500, error)
      }
    })
  } catch (error) {
    res.send(500, error)
  }
}

export const getUser = function(req, res, next) {
  try {
    defaultGet(SCHEMAS.USERS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

export const putUser = function(req, res, next) {
  LOGGER.debug(JSON.stringify(req.body))
  try {
    defaultPut(SCHEMAS.USERS, req, res, next, (error) => {
      if (error && error.code === 11000) {
        if (error.message.indexOf('username') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_USERNAME_INUSE)
        } else if (error.message.indexOf('email') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_EMAIL_INUSE)
        }
      } else if (error && error.name === 'ValidationError') {
        sendError(LOGGER, res, {
          status: HttpUtils.HttpStatus.BAD_REQUEST,
          error: error.message
        })
      } else {
        res.send(HttpUtils.HttpStatus.ERROR, error)
      }
    })
  } catch (error) {
    res.send(HttpUtils.HttpStatus.ERROR, error)
  }
}

export const patchUser = function(req, res, next) {
  LOGGER.debug(JSON.stringify(req.body))
  try {
    defaultPatch(SCHEMAS.USERS, req, res, next, (error) => {
      if (error && error.code === 11000) {
        if (error.message.indexOf('username') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_USERNAME_INUSE)
        } else if (error.message.indexOf('email') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_EMAIL_INUSE)
        }
      } else if (error && error.name === 'ValidationError') {
        sendError(LOGGER, res, {
          status: HttpUtils.HttpStatus.BAD_REQUEST,
          error: error.message
        })
      } else {
        res.send(HttpUtils.HttpStatus.ERROR, error)
      }
    })
  } catch (error) {
    res.send(HttpUtils.HttpStatus.ERROR, error)
  }
}

export const deleteUser = function(req, res, next) {
  try {
    defaultDelete(SCHEMAS.USERS, req, res, next, null)
  } catch (error) {
    res.send(HttpUtils.HttpStatus.ERROR, error)
  }
}

const log = function (req, res, next) {
  res.send(HttpUtils.HttpStatus.UNAUTHORIZED)
}

const addRoutes = (app) => {
  app.post('/rest/users', log, postUser)
  app.get('/rest/users/:userId', getUser)
  app.post('/rest/users/:userId/avatar', postUserAvatar)
  app.put('/rest/users/:userId', putUser)
  app.patch('/rest/users/:userId', patchUser)
  app.delete('/rest/users/:userId', deleteUser)
}

export default addRoutes
