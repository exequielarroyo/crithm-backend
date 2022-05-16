module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define("Plan", {
    name: {
      type: DataTypes.STRING,
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
