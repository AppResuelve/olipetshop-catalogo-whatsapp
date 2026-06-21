const productsService = require('../../services/admin/products.service')

const list = async (req, res, next) => {
  try {
    const result = await productsService.list(req.query)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

const getById = async (req, res, next) => {
  try {
    const product = await productsService.getById(req.params.id)
    res.json(product)
  } catch (err) {
    next(err)
  }
}

const create = async (req, res, next) => {
  try {
    const product = await productsService.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const product = await productsService.update(req.params.id, req.body)
    res.json(product)
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  try {
    await productsService.remove(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

const bulkCreate = async (req, res, next) => {
  try {
    const { products, categoryId } = req.body
    const result = await productsService.bulkCreate(products, categoryId)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove, bulkCreate }
