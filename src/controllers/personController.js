import mongoose from "mongoose";

import { Person } from "../models/Person.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getRootPerson = async (req, res, next) => {
  try {
    const root = await Person.findOne({ father_id: null }).lean();
    if (!root) {
      return res.status(404).json({ success: false, message: "Root person not found" });
    }

    res.status(200).json({ success: true, data: root });
  } catch (error) {
    next(error);
  }
};

export const searchPersons = async (req, res, next) => {
  try {
    const query = (req.query.q || "").trim();
    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const persons = await Person.find({
      name: { $regex: query, $options: "i" }
    })
      .select("_id name father_id")
      .limit(20)
      .lean();

    res.status(200).json({ success: true, data: persons });
  } catch (error) {
    next(error);
  }
};

export const getPersonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid person id" });
    }

    const person = await Person.findById(id).lean();
    if (!person) {
      return res.status(404).json({ success: false, message: "Person not found" });
    }

    res.status(200).json({ success: true, data: person });
  } catch (error) {
    next(error);
  }
};

export const getChildrenByPersonId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid person id" });
    }

    const children = await Person.find({ father_id: id }).sort({ created_at: 1 }).lean();
    res.status(200).json({ success: true, data: children });
  } catch (error) {
    next(error);
  }
};

export const createChild = async (req, res, next) => {
  try {
    const { name, father_id } = req.body;

    if (!name || !father_id) {
      return res.status(400).json({ success: false, message: "name and father_id are required" });
    }

    if (!isValidObjectId(father_id)) {
      return res.status(400).json({ success: false, message: "Invalid father id" });
    }

    const father = await Person.findById(father_id).select("_id");
    if (!father) {
      return res.status(404).json({ success: false, message: "Father not found" });
    }

    const child = await Person.create({ name, father_id });
    res.status(201).json({ success: true, data: child });
  } catch (error) {
    next(error);
  }
};

export const updatePerson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "name is required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid person id" });
    }

    const updated = await Person.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: "Person not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteBranch = async (personId) => {
  const children = await Person.find({ father_id: personId }).select("_id").lean();

  for (const child of children) {
    await deleteBranch(child._id);
  }

  await Person.findByIdAndDelete(personId);
};

export const deletePerson = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid person id" });
    }

    const person = await Person.findById(id).lean();
    if (!person) {
      return res.status(404).json({ success: false, message: "Person not found" });
    }

    if (!person.father_id) {
      return res
        .status(400)
        .json({ success: false, message: "Root person cannot be deleted" });
    }

    await deleteBranch(person._id);

    res.status(200).json({ success: true, message: "Person and descendants deleted" });
  } catch (error) {
    next(error);
  }
};
