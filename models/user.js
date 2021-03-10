"use strict";
const Sequelize = require("sequelize");
const { Model } = Sequelize;
module.exports = (sequelize) => {
  class User extends Model {
    // /**
    //  * Helper method for defining associations.
    //  * This method is not a part of Sequelize lifecycle.
    //  * The `models/index` file will call this method automatically.
    //  */
    // static associate(models) {
    //   // define association here
    // }
  }
  User.init(
    {
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      emailAddress: Sequelize.STRING,
      password: Sequelize.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return User;
};
