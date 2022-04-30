module.exports = (sequelize, DataTypes) => {
    const Feature = sequelize.define('Feature', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
    return Feature;
};