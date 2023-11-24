const { addBookHandler, getAllBookHandler, getByIdBookHandler, updateBookHandler, deleteBookHandler } = require('./handler')
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getByIdBookHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler
  }
]

module.exports = routes
