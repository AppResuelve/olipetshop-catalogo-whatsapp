const app = require('./app')
const { sequelize } = require('./models')
const { ensureDefaults } = require('./services/store/settings.service')

const PORT = process.env.PORT || 3001

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Conexión a PostgreSQL establecida.')

    await sequelize.sync()
    console.log('Modelos sincronizados.')

    await ensureDefaults()
    console.log('Defaults de settings insertados.')

    app.listen(PORT, () => {
      console.log(`Server corriendo en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Error al iniciar el servidor:', err)
    process.exit(1)
  }
}

start()
