const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user.route");
const { noteRouter } = require("./routes/note.route");
const { authenticate } = require("./middleware/authenticate");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("HOME PAGE");
});

app.use("/users", userRouter);
app.use(authenticate); // making a authenticate middleware so that no one can visit the notes route before login himself !!
app.use("/notes", noteRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${process.env.port}`);
});
