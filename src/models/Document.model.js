// BACKEND/src/models/Document.model.js
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'documents',
    timestamps: true
  });

  // Set up associations
  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'documentUser'
    });
  };

  return Document;
};