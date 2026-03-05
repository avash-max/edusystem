const Resource = require("../models/resourcesModel");

const addResource    = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json({ message: "Resource created", resource });
    } catch (err) { res.status(500).json({ message: "Server error" }); }
};

const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll({ order: [["created_at", "DESC"]] });
        res.status(200).json({ resources });
    } catch (err) { res.status(500).json({ message: "Server error" }); }
};

const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);
        if (!resource) return res.status(404).json({ message: "Not found" });
        await resource.update(req.body);
        res.status(200).json({ message: "Resource updated", resource });
    } catch (err) { res.status(500).json({ message: "Server error" }); }
};

const removeResource = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);
        if (!resource) return res.status(404).json({ message: "Not found" });
        await resource.destroy();
        res.status(200).json({ message: "Resource deleted" });
    } catch (err) { res.status(500).json({ message: "Server error" }); }
};

module.exports = { addResource, getAllResources, updateResource, removeResource };