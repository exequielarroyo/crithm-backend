module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define("Type", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    features: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Type.associate = (models) => {
    Type.hasMany(models.Project, {
    });
  };

  return Type;
};
