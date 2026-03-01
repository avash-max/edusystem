const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");
const Assignment = require("./assignmentModel");
const Register   = require("./userModel"); // your user model

const StudentSubmission = sequelize.define(
    "StudentSubmission",
    {
        submission_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        assignment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "assignments", key: "assignment_id" }
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "user_id" }
        },
        student_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false  // original file name
        },
        file_path: {
            type: DataTypes.STRING,
            allowNull: false  // UUID filename on disk
        },
        file_size: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        file_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true  // optional message from student
        },
        status: {
            type: DataTypes.ENUM("submitted", "reviewed", "graded"),
            defaultValue: "submitted"
        },
        grade: {
            type: DataTypes.STRING,
            allowNull: true  // teacher fills this in
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: true  // teacher fills this in
        }
    },
    {
        timestamps: true,
        tableName: "student_submissions",
        underscored: true
    }
);

// Associations
Assignment.hasMany(StudentSubmission,      { foreignKey: "assignment_id", as: "submissions" });
StudentSubmission.belongsTo(Assignment,    { foreignKey: "assignment_id", as: "assignment"  });
StudentSubmission.belongsTo(Register,      { foreignKey: "student_id",    as: "student"     });

module.exports = StudentSubmission;