import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  father_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const Person = mongoose.model("Person", personSchema);
