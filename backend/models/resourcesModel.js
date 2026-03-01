const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Resource = sequelize.define("Resource", {
    resource_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title:       { type: DataTypes.STRING,  allowNull: false },
    description: { type: DataTypes.TEXT,    allowNull: true  },
    type:        { type: DataTypes.ENUM("document", "video", "link", "file"), defaultValue: "document" },
    course:      { type: DataTypes.STRING,  allowNull: false },
    url:         { type: DataTypes.STRING,  allowNull: true  },
}, { timestamps: true, tableName: "resources", underscored: true });

module.exports = Resource;