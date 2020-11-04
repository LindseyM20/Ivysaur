module.exports = function (sequelize, DataTypes) {
    let Task = sequelize.define("Task", {
        //Coulumns 
        date: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: sequelize.NOW
        },

        taskName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        taskBody: {
            type: DataTypes.STRING,
            // allowNull: false
        },

    });

    Task.associate = function (models) {
      // We're saying that a Task should belong to a User
      // A Task can't be created without an User due to the foreign key constraint
      Task.belongsTo(models.Calendar, {
        foreignKey: {
          allowNull: false
        }
      });
    };

    return Task;
};