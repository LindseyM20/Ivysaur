module.exports = function (sequelize, DataTypes) {
  let Calendar = sequelize.define("Calendar", {
    // The email cannot be null, and must be a proper email before creation
    // Variables Needed: Date, Comic Name, Image URL, Post Number (#) 
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.NOW
    },

    comicName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    imgURL: {
      type: DataTypes.STRING,
      allowNull: false
    },

    postNum: {
      type: DataTypes.INTEGER,
    }
  });

  Calendar.associate = function (models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Calendar.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Calendar.hasMany(models.Task, {
      onDelete: "cascade"
    });
  };

  return Calendar;
};