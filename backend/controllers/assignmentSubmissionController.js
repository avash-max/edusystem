const StudentSubmission = require("../models/studentSubmission");
const Assignment        = require("../models/assignmentModel");
const path              = require("path");
const fs                = require("fs");
const Register = require("../models/userModel");

// ── Teacher: get all submissions for one assignment ──
const getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.params;

        const assignment = await Assignment.findByPk(assignment_id);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const submissions = await StudentSubmission.findAll({
            where: { assignment_id },
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json({
            assignment,
            submissions,
            total: submissions.length
        });
    } catch (error) {
        console.error("getSubmissionsByAssignment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── Teacher: get all submissions across all assignments ──
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await StudentSubmission.findAll({
            include: [{
                model:      Assignment,
                as:         "assignment",
                attributes: ["assignment_id", "title", "course", "due_date"]
            }],
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json({ submissions, total: submissions.length });
    } catch (error) {
        console.error("getAllSubmissions error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── Teacher: review a submission — add grade + feedback ──
const reviewSubmission = async (req, res) => {
    try {
        const { id }               = req.params;
        const { grade, feedback }  = req.body;

        const submission = await StudentSubmission.findByPk(id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        await submission.update({
            grade:    grade    ?? submission.grade,
            feedback: feedback ?? submission.feedback,
            status:   grade ? "graded" : "reviewed"
        });

        return res.status(200).json({ message: "Submission reviewed", submission });
    } catch (error) {
        console.error("reviewSubmission error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── Teacher: download a student's submitted file ──
const downloadSubmission = async (req, res) => {
    try {
        const submission = await StudentSubmission.findByPk(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const filePath = path.join(__dirname, "../uploads", submission.file_path);
        console.log("Attempting to download file at:", filePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File no longer exists on server" });
        }

        res.download(filePath, submission.file_name);
    } catch (error) {
        console.error("downloadSubmission error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── Student: submit assignment ──
const submitAssignment = async (req, res) => {
    try {
        const { assignment_id, student_id, note } = req.body;

        if (!assignment_id || !student_id) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "assignment_id and student_id are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "A file is required for submission" });
        }

        // Prevent duplicate submissions from the same student
        const existing = await StudentSubmission.findOne({ where: { assignment_id, student_id } });
        if (existing) {
            fs.unlinkSync(req.file.path);
            return res.status(409).json({ message: "You have already submitted this assignment. Use the update endpoint instead." });
        }
        const user = await Register.findByPk(student_id); // Assuming student_id is the primary key in the users table

        const submission = await StudentSubmission.create({
            assignment_id,
            student_id,
            student_name : user.username,
            note,
            file_name: req.file.originalname,
            file_path: req.file.filename,
            file_size: req.file.size,
            file_type: req.file.mimetype
        });

        return res.status(201).json({ message: "Assignment submitted successfully", submission });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("submitAssignment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── Student: resubmit / update their submission ──
const resubmitAssignment = async (req, res) => {
    try {
        const submission = await StudentSubmission.findByPk(req.params.id);
        if (!submission) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Submission not found" });
        }

        // Delete old file
        if (req.file) {
            const oldPath = path.join(__dirname, "../uploads/submissions", submission.file_path);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await submission.update({
            note:      req.body.note ?? submission.note,
            file_name: req.file ? req.file.originalname : submission.file_name,
            file_path: req.file ? req.file.filename     : submission.file_path,
            file_size: req.file ? req.file.size         : submission.file_size,
            file_type: req.file ? req.file.mimetype     : submission.file_type,
            status:    "submitted",  // reset to submitted on resubmit
            grade:     null,
            feedback:  null
        });

        return res.status(200).json({ message: "Resubmitted successfully", submission });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getSubmissionsByAssignment,
    getAllSubmissions,
    reviewSubmission,
    downloadSubmission,
    submitAssignment,
    resubmitAssignment
};