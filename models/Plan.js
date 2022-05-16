module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define("Plan", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projects: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    features: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  Plan.associate = (models) => {
    Plan.hasMany(models.User, {
      onDelete: "cascade",
    });
    models.User.belongsTo(Plan);
  };

  return Plan;
};
