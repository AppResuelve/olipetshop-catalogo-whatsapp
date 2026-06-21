require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

const { sequelize, User, Category } = require('../models')

const seed = async () => {
  try {
    await sequelize.authenticate()
    console.log('DB conectada.')

    await sequelize.sync({ force: true })
    console.log('Tablas recreadas.')

    // Admin user (solo en dev — las env vars son opcionales)
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    if (adminEmail && adminPassword) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        status: 'active',
        role: 'admin',
      })
      console.log('Admin creado:', adminEmail)
    } else {
      console.log('ADMIN_EMAIL/ADMIN_PASSWORD no configurados — sin admin creado.')
    }

    // Categorías por defecto
    const defaultCategories = [
      { name: 'General', slug: 'general', order: 0 },
    ]
    await Category.bulkCreate(defaultCategories)
    console.log('Categorías default creadas.')

    console.log('Seed completado.')
    process.exit(0)
  } catch (err) {
    console.error('Error en seed:', err)
    process.exit(1)
  }
}

seed()
