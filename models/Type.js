module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Type', {
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Features: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      
    });
    return Type;
  };