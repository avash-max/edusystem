const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Register = sequelize.define(
    "User", // Model name is usually singular
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role: {
            type: DataTypes.ENUM("student", "teacher"),
            allowNull: false,
            defaultValue: "student"
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true // Ensures the string is a valid email format
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Added the missing 'info' field from your controller
        info: {
            type: DataTypes.TEXT, 
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        verificationTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: true,
        tableName: "users",
        underscored: true // Good practice: converts createdAt to created_at in DB
    }
);

module.exports = Register;