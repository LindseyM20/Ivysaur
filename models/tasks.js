module.exports = function (sequelize, DataTypes) {
  let Task = sequelize.define("Task", {
    //Coulumns 
    taskTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.STRING,
      allowNull: false
    }

    // taskTime: {
    //     type: DataTypes.STRING,
    //     // allowNull: false
    // },

  });

  Task.associate = function (models) {
    // We're saying that a Task should belong to a User
    // A Task can't be created without an User due to the foreign key constraint
    Task.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Task;
};