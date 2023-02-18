const express = require("express");
const { noteModel } = require("../model/note.model");

const noteRouter = express.Router();

noteRouter.get("/", async(req, res) => {
  const all_notes =  await noteModel.find();
  res.send(all_notes);
});

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

module.exports = { noteRouter };