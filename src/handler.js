/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid')
const books = require('./books')
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const isFinished = (pageCount, readPage) => pageCount === readPage

  const finished = isFinished(pageCount, readPage)

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.some((book) => book.id === id)

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let filterBook = books
  if (name) {
    filterBook = filterBook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (reading) {
    filterBook = filterBook.filter((book) => book.reading === (reading === '1'))
  }
  if (finished) {
    filterBook = filterBook.filter((book) => book.finished === (finished === '1'))
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filterBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })

  response.code(200)
  return response
}

const getByIdBookHandler = (request, h) => {
  const { bookId } = request.params
  const bookIndex = books.findIndex((book) => book.id === bookId)

  if (bookIndex !== -1) {
    const book = books[bookIndex]
    return {
      status: 'success',
      data: { book }
    }
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const updateBookHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    readPage,
    pageCount,
    reading
  } = request.payload
  const updatedAt = new Date().toISOString()
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      }).code(400)
  }
  const finished = (pageCount === readPage)
  const index = books.findIndex((book) => book.id === bookId)
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      .code(200)
    return response
  }
  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    .code(404)
  return response
}
const deleteBookHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBookHandler, getByIdBookHandler, updateBookHandler, deleteBookHandler }
