"use strict";

module.exports = function(sequelize, DataTypes) {
  var Manager = sequelize.define("Manager", {
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
    property: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Manager.hasMany(models.Tenant, { foreignKey: 'manager_id'});
      }
    }
  });

  return Manager;
};
