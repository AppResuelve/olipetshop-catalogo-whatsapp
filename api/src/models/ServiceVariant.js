module.exports = (sequelize, DataTypes) => {
  const ServiceVariant = sequelize.define('ServiceVariant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'service_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'duration_minutes',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'sort_order',
    },
    status: {
      type: DataTypes.ENUM('active', 'draft'),
      defaultValue: 'active',
      allowNull: false,
    },
  }, {
    tableName: 'service_variants',
    underscored: true,
  })

  ServiceVariant.associate = (models) => {
    ServiceVariant.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' })
    ServiceVariant.hasMany(models.ServiceVariantModifier, { foreignKey: 'service_variant_id', as: 'modifiers' })
  }

  return ServiceVariant
}
