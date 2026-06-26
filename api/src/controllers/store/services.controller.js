const servicesService = require('../../services/store/services.service')

const list = async (req, res, next) => {
  try {
    const result = await servicesService.list(req.query)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

const getBySlug = async (req, res, next) => {
  try {
    const service = await servicesService.getBySlug(req.params.slug)
    res.json(service)
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getBySlug }
