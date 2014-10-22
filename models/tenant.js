"use strict";

module.exports = function(sequelize, DataTypes) {
  var Tenant = sequelize.define("Tenant", {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: "Your first name should be at least be one character"
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: "Your last name should be at least be one character"
        }
      }
    },
    manager_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Tenant.belongsTo(models.Manager, { foreignKey: 'manager_id'});
      }
    }
  });

  return Tenant;
};
