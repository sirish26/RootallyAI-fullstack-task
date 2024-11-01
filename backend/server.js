const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors()).use(express.json());

mongoose.connect("mongodb+srv://root:root@exerciseprogram.iixeu.mongodb.net/exerciseDB")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const exerciseSchema = new mongoose.Schema({
    id: Number,
    name: String,
    exercises: [String]
});

const programSchema = new mongoose.Schema({
    name: String,
    exercises: [{
        exerciseName: String,
        sets: Number,
        reps: Number,
        holdTime: Number,
        weight: Number,
        side: String,
    }],
    frequency: Number,
    breakInterval: Number,
    selectedDays: [String],
});

const Category = mongoose.model("Category", exerciseSchema);
const Program = mongoose.model("Program", programSchema);

const seedCategories = async () => {
    if (await Category.countDocuments() === 0) {
        await Category.insertMany([
            { id: 1, name: "Lower Body", exercises: ["Squats", "Lunges", "Deadlifts", "Leg Press"] },
            { id: 2, name: "Upper Body", exercises: ["Push-ups", "Pull-ups", "Bench Press", "Overhead Shoulder Press"] },
            { id: 3, name: "Core", exercises: ["Plank", "Sit-ups", "Russian Twists", "Side Plank"] }
        ]);
        console.log("Categories seeded!");
    }
};

app.get("/api/categories", async (req, res) => res.json(await Category.find()));

app.post("/api/saveCombo", async (req, res) => {
    console.log("Request Body:", req.body); 
    try {
        const { name, exercises, frequency, breakInterval, selectedDays } = req.body;

        if (!name || !Array.isArray(exercises)) {
            console.error("Invalid data:", req.body);
            return res.status(400).json({ message: "Invalid data" });
        }

        const program = new Program({
            name,
            exercises: exercises.map(exercise => ({
                exerciseName: exercise.exerciseName,
                sets: exercise.sets || 0,
                reps: exercise.reps || 0,
                holdTime: exercise.holdTime || 0,
                weight: exercise.weight || 0,
                side: exercise.side || '',
            })),
            breakInterval,
            frequency,
            selectedDays,
        });

        await program.save();
        console.log("Combo saved:", program);
        res.status(201).json({ message: "Combo saved" });
    } catch (error) {
        console.error("Error saving combo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/api/programs", async (req, res) => {
    try {
        res.json(await Program.find({}, 'name'));
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(5000, async () => {
    await seedCategories();
    console.log("Backend running on port 5000");
});
