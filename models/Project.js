module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("Project", {
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });

  return User;
};
