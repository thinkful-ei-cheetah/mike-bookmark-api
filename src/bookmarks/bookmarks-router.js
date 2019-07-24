const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const store = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [
  {
    title: "Google",
    rating: 5,
    url: "http://google.com",
    description: "The best search engine ever.",
    id: 1,
  },
  {
    title: "IMDB",
    rating: 5,
    url: "http://imdb.com",
    description: "The best movie search engine ever.",
    id: 2,
  },
  {
    title: "Facebook",
    rating: 5,
    url: "http://facebook.com",
    description: "The best time sink ever.",
    id: 3,
  }
]

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    // const { title, url, desc='', rating='5'} = req.body;
    const { title, rating, url, description } = req.body;
    const parsedRating = parseInt(rating);

    if(!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!rating) {
      logger.error('Rating is required')
      return res
        .status(400)
        .send('Invalid Data');
    }

    if(!url) {
      logger.error('URL is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!description) {
      logger.error('Description is required')
      return res
        .status(400)
        .send('Invalid Data');
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      rating: parsedRating,
      url,
      description
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(200)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const parseId = parseInt(id);
    const bookmark = bookmarks.find(bookmark => bookmark.id === parseId);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    res.json(bookmarks)
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === id)

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    store.bookmarks.splice(bookmarkIndex, 1)

    logger.info(`Bookmark with id ${id} deleted.`)
    res
      .status(200)
      .end()
  })

module.exports = bookmarksRouter;