module.exports = (sequelize, DataTypes) => {
    const Type = sequelize.define('Type', {
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Features: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    });
    return Type;
};