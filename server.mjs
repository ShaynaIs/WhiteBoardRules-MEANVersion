import express from "express";
import cors from "cors";
import "express-async-errors";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import studentroutes from "./studentroutes.mjs";
import contactroutes from "./contactroutes.mjs";
import userRoutes from "./userRoutes.mjs";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

// Load the /recipes routes
app.use("/students", studentroutes);
app.use("/contact", contactroutes);
app.use("/users", userRoutes);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// login page
app.get('/login', (req, res) => {
  //if logged in/out
  res.render('login', {
      title: 'Login Page'
  });
});

// home
app.get(['/', '/home', '/students'], (req, res) => {
  //if logged in/out
  res.render('students', {
      title: 'Home'
  });
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
