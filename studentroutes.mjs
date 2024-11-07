import express from "express";
import connectDB from "./conn.mjs";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to authenticate and add user information to the request
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Failed to authenticate token.' });
  }
}

// Connect to the database
const db = await connectDB();
const collection = db.collection("students");

// Get a list of user's students
router.get("/", authenticate, async (req, res) => {
  const userId = req.user.userId;  // Extracted from token
  try {
    const results = await collection.find({ 'userId': userId }).toArray();
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Fetches the latest students
router.get("/latest", async (req, res) => {
  let collection = await db.collection("posts");
  let results = await collection.aggregate([
    { "$project": { "name": 1, "date": 1 } },
    { "$sort": { "date": -1 } },
    { "$limit": 3 }
  ]).toArray();
  res.send(results).status(200);
});

// Get a single post
router.get("/:id", async (req, res) => {
  let query = { _id: ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add a new document to the collection
router.post("/addStudent", authenticate, async (req, res) => {
  let newDocument = req.body;
  const userId = req.user.userId;  // Extracted from token
  //
  newDocument.date = new Date();
  newDocument.userId = userId;

  try {
    let result = await collection.insertOne(newDocument);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Update the post with a new comment
router.patch("/comment/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const updates = {
    $push: { comments: req.body }
  };

  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
