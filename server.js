const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Atlas Connect
mongoose.connect("mongodb+srv://ac7412737_db_user:l7sjbjxnKd8DIv2X@cluster0.h7kc2qy.mongodb.net/?appName=Cluster0")
.then(() => {
  console.log("MongoDB Atlas Connected ✅");
})
.catch((err) => {
  console.log("MongoDB Error ❌", err);
});

// Multer
const upload = multer({ dest: "uploads/" });

// Schema
const admissionSchema = new mongoose.Schema({
  fullname: String,
  dob: String,
  gender: String,
  email: String,
  mobile: String,
  course: String,
  address: String,
  photo: String
});

const Admission = mongoose.model("Admission", admissionSchema);

// ✅ POST API (Form Save)
app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    const newData = new Admission({
      fullname: req.body.fullname,
      dob: req.body.dob,
      gender: req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      course: req.body.course,
      address: req.body.address,
      photo: req.file ? req.file.filename : ""
    });

    await newData.save();
    res.json({ message: "Form submitted successfully ✅" });


  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving data ❌");
  }
});

// ✅ GET API (All Data Fetch)
app.get("/admissions", async (req, res) => {
  try {
    const data = await Admission.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data ❌");
  }
});

// ✅ GET API (Specific ID Fetch)
app.get("/admissions/:id", async (req, res) => {
  try {
    const student = await Admission.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    res.json(student);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invalid ID ❌" });
  }
});

// Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
// DELETE Student by ID
app.delete("/admissions/:id", async (req, res) => {
  try {
    const deleted = await Admission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found ❌" });
    res.json({ message: "Student deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student ❌" });
  }
});

// UPDATE Student by ID
app.put("/admissions/:id", async (req, res) => {
  try {
    const updated = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found ❌" });
    res.json({ message: "Student updated successfully ✅", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating student ❌" });
  }
});