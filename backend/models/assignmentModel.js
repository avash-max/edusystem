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
        status: {
            type: DataTypes.ENUM("pending", "completed", "overdue"),
            allowNull: false,
            defaultValue: "pending"
        }
    },
    {
        timestamps: true,
        tableName: "assignments",
        underscored: true
    }
);

module.exports = Assignment;