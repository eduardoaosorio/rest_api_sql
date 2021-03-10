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
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A first name is required",
          },
          notEmpty: {
            msg: "Please provide a first name",
          },
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A last name is required",
          },
          notEmpty: {
            msg: "Please provide a last name",
          },
        },
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: "The email you entered already exists",
        },
        validate: {
          notNull: {
            msg: "An email is required",
          },
          isEmail: {
            msg: "Please provide a valid email",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A password is required",
          },
          notEmpty: {
            msg: "Please provide a password",
          },
          is: {
            // regex source: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
            args: ["^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$", ""],
            msg:
              "Password must have a minimum of 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number",
          },
        },
      },
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
