const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Course = sequelize.define(
    "Course",
    {
        course_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        students: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        assignments: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        color: {
            type: DataTypes.ENUM("blue", "orange", "purple", "green", "red", "pink"),
            defaultValue: "blue"
        }
    },
    {
        timestamps: true,
        tableName: "courses",
        underscored: true
    }
);

module.exports = Course;