const Assignment = require("../models/assignmentModel");
const fs         = require("fs");
const path       = require("path");

const addAssignment = async (req, res) => {
    try {
        const { title, course, due_date } = req.body;

        if (!title || !course || !due_date) {
            // Clean up uploaded file if validation fails
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "All fields are required" });
        }

        const assignment = await Assignment.create({
            title,
            course,
            due_date,
            file_name: req.file ? req.file.originalname      : null,
            file_path: req.file ? req.file.filename          : null,
            file_size: req.file ? req.file.size              : null,
            file_type: req.file ? req.file.mimetype          : null,
        });

        return res.status(201).json({ message: "Assignment created", assignment });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("addAssignment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.findAll({ order: [["due_date", "ASC"]] });
        return res.status(200).json({ assignments });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });
        return res.status(200).json({ assignment });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        // If a new file is uploaded, delete the old one
        if (req.file && assignment.file_path) {
            const oldPath = path.join(__dirname, "../uploads", assignment.file_path);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const { title, course, due_date, status } = req.body;

        await assignment.update({
            title:     title     ?? assignment.title,
            course:    course    ?? assignment.course,
            due_date:  due_date  ?? assignment.due_date,
            file_name: req.file  ? req.file.originalname : assignment.file_name,
            file_path: req.file  ? req.file.filename     : assignment.file_path,
            file_size: req.file  ? req.file.size         : assignment.file_size,
            file_type: req.file  ? req.file.mimetype     : assignment.file_type,
        });

        return res.status(200).json({ message: "Assignment updated", assignment });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const removeAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        // Delete the file from disk too
        if (assignment.file_path) {
            const filePath = path.join(__dirname, "../uploads", assignment.file_path);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await assignment.destroy();
        return res.status(200).json({ message: "Assignment deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Serve file for download
const downloadFile = async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment || !assignment.file_path) {
            return res.status(404).json({ message: "File not found" });
        }

        const filePath = path.join(__dirname, "../uploads", assignment.file_path);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File no longer exists on server" });
        }

        res.download(filePath, assignment.file_name);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addAssignment,
    getAllAssignments,
    getAssignment,
    updateAssignment,
    removeAssignment,
    downloadFile
};