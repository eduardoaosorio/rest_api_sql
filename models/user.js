"use strict";

const Sequelize = require("sequelize");
const { Model } = Sequelize;
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  class User extends Model {}
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
          // is: {
          //   // regex source: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
          //   args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/],
          //   msg:
          //     "Password must have a minimum of 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number",
          // },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  // sequelize hook, runs after successful validation to hash password
  User.addHook("afterValidate", async (user) => {
    try {
      console.log("Hook just run");
      user.password = await bcrypt.hash(user.password, 10);
      return "Password hashed successfully!";
    } catch (err) {
      console.error(err);
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };

  return User;
};
