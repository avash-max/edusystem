const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Assignment = sequelize.define(
    "Assignment",
    {
        assignment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        course: {
            type: DataTypes.STRING,
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        // --- New file fields ---
        file_name: {
            type: DataTypes.STRING,
            allowNull: true  // original file name shown to user
        },
        file_path: {
            type: DataTypes.STRING,
            allowNull: true  // stored filename on disk
        },
        file_size: {
            type: DataTypes.INTEGER,
            allowNull: true  // bytes
        },
        file_type: {
            type: DataTypes.STRING,
            allowNull: true  // mimetype
        }
    },
    {
        timestamps: true,
        tableName: "assignments",
        underscored: true
    }
);

module.exports = Assignment;