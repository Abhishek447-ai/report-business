require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

const Submission = require("./models/Submission");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Submission Routes
app.post("/api/submissions", async (req, res) => {
  try {
    const submission = new Submission(req.body);

    await submission.save();

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({
      createdAt: -1,
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    const { reportCount } = req.body;

    const amount = reportCount * 200 * 100; // Razorpay expects paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create order",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});