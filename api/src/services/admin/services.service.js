const { Service, ServiceVariant, ServiceVariantModifier } = require('../../models')
const sequelize = require('../../config/database')

const variantInclude = {
  model: ServiceVariant,
  as: 'variants',
  include: [{
    model: ServiceVariantModifier,
    as: 'modifiers',
  }],
  order: [['sort_order', 'ASC'], ['modifiers', 'sort_order', 'ASC']],
}

const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 255)
}

const list = async (query = {}) => {
  const { page = 1, limit = 20, search, status } = query
  const offset = (page - 1) * limit

  const where = {}
  if (search) {
    where[require('sequelize').Op.or] = [
      { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { description: { [require('sequelize').Op.iLike]: `%${search}%` } },
    ]
  }
  if (status) where.status = status

  const { count, rows } = await Service.findAndCountAll({
    where,
    include: [variantInclude],
    order: [['name', 'ASC']],
    limit: Number(limit),
    offset,
  })

  return {
    services: rows,
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
  }
}

const getById = async (id) => {
  const service = await Service.findByPk(id, { include: [variantInclude] })
  if (!service) throw Object.assign(new Error('Servicio no encontrado'), { status: 404 })
  return service
}

const syncVariants = async (serviceId, variants = [], transaction) => {
  const variantIds = []

  for (const v of variants) {
    const variantData = {
      serviceId: serviceId,
      name: v.name,
      price: v.price || 0,
      duration_minutes: v.duration_minutes || null,
      sort_order: v.sort_order || 0,
      status: v.status || 'active',
    }

    let variant
    if (v.id) {
      variant = await ServiceVariant.findByPk(v.id, { transaction })
      if (variant && variant.serviceId === serviceId) {
        await variant.update(variantData, { transaction })
      } else {
        variant = await ServiceVariant.create(variantData, { transaction })
      }
    } else {
      variant = await ServiceVariant.create(variantData, { transaction })
    }

    variantIds.push(variant.id)

    if (v.modifiers && Array.isArray(v.modifiers)) {
      const modifierIds = []
      for (const m of v.modifiers) {
        const modifierData = {
          serviceVariantId: variant.id,
          name: m.name,
          price: m.price || 0,
          is_required: m.is_required || false,
          max_selection: m.max_selection || null,
          sort_order: m.sort_order || 0,
          status: m.status || 'active',
        }

        let modifier
        if (m.id) {
          modifier = await ServiceVariantModifier.findByPk(m.id, { transaction })
          if (modifier && modifier.serviceVariantId === variant.id) {
            await modifier.update(modifierData, { transaction })
          } else {
            modifier = await ServiceVariantModifier.create(modifierData, { transaction })
          }
        } else {
          modifier = await ServiceVariantModifier.create(modifierData, { transaction })
        }
        modifierIds.push(modifier.id)
      }

      await ServiceVariantModifier.destroy({
        where: { serviceVariantId: variant.id, id: { [require('sequelize').Op.notIn]: modifierIds } },
        transaction,
      })
    }
  }

  await ServiceVariant.destroy({
    where: { serviceId: serviceId, id: { [require('sequelize').Op.notIn]: variantIds } },
    transaction,
  })
}

const create = async (data) => {
  const { variants, ...serviceData } = data
  if (!serviceData.slug && serviceData.name) serviceData.slug = slugify(serviceData.name)

  const result = await sequelize.transaction(async (t) => {
    const service = await Service.create(serviceData, { transaction: t })
    if (variants && variants.length > 0) {
      await syncVariants(service.id, variants, t)
    }
    return Service.findByPk(service.id, { include: [variantInclude], transaction: t })
  })

  return result
}

const update = async (id, data) => {
  const service = await getById(id)
  const { variants, ...serviceData } = data
  if (!serviceData.slug && serviceData.name) serviceData.slug = slugify(serviceData.name)

  const result = await sequelize.transaction(async (t) => {
    await service.update(serviceData, { transaction: t })
    if (variants && Array.isArray(variants)) {
      await syncVariants(service.id, variants, t)
    }
    return Service.findByPk(id, { include: [variantInclude], transaction: t })
  })

  return result
}

const remove = async (id) => {
  const service = await getById(id)
  return service.destroy()
}

module.exports = { list, getById, create, update, remove }
