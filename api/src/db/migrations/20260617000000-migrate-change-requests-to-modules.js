'use strict';

/**
 * Migración para actualizar change_requests al nuevo modelo de módulos.
 * Es idempotente: chequea qué columnas existen antes de operar.
 *
 * Cambios:
 *  - new: component_id, category_id, free, price
 *  - rename: data→values, whatsappMessage→whatsapp_message, adminNotes→admin_notes
 *  - remove: type
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('change_requests')

    // Agregar columnas nuevas si no existen
    if (!table.component_id) {
      await queryInterface.addColumn('change_requests', 'component_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    }

    if (!table.category_id) {
      await queryInterface.addColumn('change_requests', 'category_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    }

    if (!table.free) {
      await queryInterface.addColumn('change_requests', 'free', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      })
    }

    if (!table.price) {
      await queryInterface.addColumn('change_requests', 'price', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      })
    }

    // Renombrar data → values (si existe la columna vieja)
    if (table.data && !table.values) {
      await queryInterface.renameColumn('change_requests', 'data', 'values')
    }

    // Renombrar whatsappMessage → whatsapp_message
    if (table.whatsappMessage && !table.whatsapp_message) {
      await queryInterface.renameColumn('change_requests', 'whatsappMessage', 'whatsapp_message')
    }

    // Renombrar adminNotes → admin_notes
    if (table.adminNotes && !table.admin_notes) {
      await queryInterface.renameColumn('change_requests', 'adminNotes', 'admin_notes')
    }

    // Eliminar type si existe
    if (table.type) {
      await queryInterface.removeColumn('change_requests', 'type')
    }

    // Hacer not-null las nuevas columnas (si tienen valores default)
    const updated = await queryInterface.describeTable('change_requests')
    if (updated.component_id && updated.component_id.allowNull !== false) {
      await queryInterface.changeColumn('change_requests', 'component_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      })
    }
    if (updated.category_id && updated.category_id.allowNull !== false) {
      await queryInterface.changeColumn('change_requests', 'category_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      })
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('change_requests')

    if (table.whatsapp_message) {
      await queryInterface.renameColumn('change_requests', 'whatsapp_message', 'whatsappMessage')
    }
    if (table.admin_notes) {
      await queryInterface.renameColumn('change_requests', 'admin_notes', 'adminNotes')
    }
    if (table.values) {
      await queryInterface.renameColumn('change_requests', 'values', 'data')
    }
    if (!table.type) {
      await queryInterface.addColumn('change_requests', 'type', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'hero',
      })
    }

    if (table.component_id) await queryInterface.removeColumn('change_requests', 'component_id')
    if (table.category_id) await queryInterface.removeColumn('change_requests', 'category_id')
    if (table.free) await queryInterface.removeColumn('change_requests', 'free')
    if (table.price) await queryInterface.removeColumn('change_requests', 'price')
  },
}
