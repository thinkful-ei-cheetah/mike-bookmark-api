const express = require('express');
const router = express.Router();

const errorHandler = 
  router
    .use(
      function errorHandler(error, req, res, next) {
        let response
        if (NODE_ENV === 'production') {
          response = { error: { message: 'server error' } }
        } else {
          console.error(error)
          response = { message: error.message, error }
        }
        res.status(500).json(response)
      });

module.exports = errorHandler;