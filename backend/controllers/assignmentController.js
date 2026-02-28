const Assignment = require("../models/assignmentModel");

// Add Assignment
const addAssignment = async (req, res) => {
    try {
        const { title, course, due_date } = req.body;

        if (!title || !course || !due_date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const assignment = await Assignment.create({
            title,
            course,
            due_date
        });

        return res.status(201).json({
            message: "Assignment created successfully",
            assignment
        });
    } catch (error) {
        console.error("addAssignment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Assignments
const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.findAll({
            order: [["due_date", "ASC"]]
        });

        return res.status(200).json({ assignments });
    } catch (error) {
        console.error("getAllAssignments error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Single Assignment
const getAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await Assignment.findByPk(id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        return res.status(200).json({ assignment });
    } catch (error) {
        console.error("getAssignment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update Assignment
const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, course, due_date, status } = req.body;

        const assignment = await Assignment.findByPk(id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        await assignment.update({
            title: title ?? assignment.title,
            course: course ?? assignment.course,
            due_date: due_date ?? assignment.due_date,
            status: status ?? assignment.status
        });

        return res.status(200).json({
            message: "Assignment updated successfully",
            assignment
        });
    } catch (error) {
        console.error("updateAssignment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Remove Assignment
const removeAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await Assignment.findByPk(id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        await assignment.destroy();

        return res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.error("removeAssignment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addAssignment,
    getAllAssignments,
    getAssignment,
    updateAssignment,
    removeAssignment
};