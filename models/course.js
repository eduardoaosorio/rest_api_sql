"use strict";
const Sequelize = require("sequelize");
const { Model } = Sequelize;
module.exports = (sequelize) => {
  class Course extends Model {
    // /**
    //  * Helper method for defining associations.
    //  * This method is not a part of Sequelize lifecycle.
    //  * The `models/index` file will call this method automatically.
    //  */
    // static associate(models) {
    //   // define association here
    // }
  }
  Course.init(
    {
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      estimatedTime: Sequelize.STRING,
      materialsNeeded: Sequelize.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Course;
};
