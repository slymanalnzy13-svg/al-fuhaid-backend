import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 }
  },
  { timestamps: true }
);

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    type: {
      type: String,
      enum: ["suggestion", "correction", "other"],
      default: "other"
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [messageSchema]
  },
  { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
