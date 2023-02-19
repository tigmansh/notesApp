const express = require("express");
const { noteModel } = require("../model/note.model");
require("dotenv").config();
const noteRouter = express.Router();

// this route will get the notes of that particular user only who is looged in

noteRouter.get("/", async (req, res) => {
  try {
    const userData = await noteModel.find({ userID: req.body.userID });
    if (userData.length > 0) {
      res.send(userData);
    } else {
      res.send("You don't have any notes yet 😔");
    }
  } catch (err) {
    res.send({ Error: err.message });
  }
});

// this will help the logged in user to post his/her notes

noteRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_note = new noteModel(payload);
    await new_note.save();
    res.send("Created the note");
  } catch (err) {
    res.send({ msg: "Something went wrong !" });
  }
});

// this will help the logged in user to update/modify his already-existing notes

noteRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const note = await noteModel.findOne({ _id: id });
  const userID_in_note = note.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_note) {
      res.send({ msg: "You are not authorized" });
    } else {
      await noteModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("Updated the note");
    }
  } catch (err) {
    res.send({ Error: err.message });
  }
});

// this will help the logged in user to delete his/her already-existing notes..

noteRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const note = await noteModel.findOne({ _id: id });
  const userID_in_note = note.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_note) {
      res.send({ msg: "You are not authorized" });
    } else {
      await noteModel.findByIdAndDelete({ _id: id });
      res.send("Deleted the note");
    }
  } catch (err) {
    res.send({ Error: err.message });
  }
});

// exporting the route to index.js file...

module.exports = { noteRouter };
