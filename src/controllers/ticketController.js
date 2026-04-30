import { Ticket } from "../models/Ticket.js";

/* ── Create ticket ── */
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, type } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "العنوان والوصف مطلوبان" });
    }

    const ticket = await Ticket.create({
      title,
      description,
      type: type || "other",
      createdBy: req.user._id
    });

    await ticket.populate("createdBy", "full_name email role");

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

/* ── Get tickets (admin: all, user: own) ── */
export const getTickets = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(filter)
      .populate("createdBy", "full_name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

/* ── Get single ticket ── */
export const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "full_name email role")
      .populate("messages.sender", "full_name email role");

    if (!ticket) {
      return res.status(404).json({ success: false, message: "التكت غير موجود" });
    }

    // Non-admins can only see their own tickets
    if (req.user.role !== "admin" && String(ticket.createdBy._id) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "غير مصرح" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

/* ── Reply to ticket ── */
export const replyToTicket = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: "الرد مطلوب" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "التكت غير موجود" });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({ success: false, message: "التكت مغلق ولا يمكن الرد عليه" });
    }

    // Non-admins can only reply to their own tickets
    if (req.user.role !== "admin" && String(ticket.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "غير مصرح" });
    }

    ticket.messages.push({ sender: req.user._id, content });
    await ticket.save();

    await ticket.populate("createdBy", "full_name email role");
    await ticket.populate("messages.sender", "full_name email role");

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

/* ── Close ticket (admin only) ── */
export const closeTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "التكت غير موجود" });
    }

    ticket.status = "closed";
    await ticket.save();

    res.status(200).json({ success: true, data: { status: ticket.status } });
  } catch (error) {
    next(error);
  }
};

/* ── Delete ticket permanently (admin only) ── */
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "التكت غير موجود" });
    }
    res.status(200).json({ success: true, message: "تم حذف التكت نهائياً" });
  } catch (error) {
    next(error);
  }
};

/* ── Reopen ticket (admin only) ── */
export const reopenTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "التكت غير موجود" });
    }

    ticket.status = "open";
    await ticket.save();

    res.status(200).json({ success: true, data: { status: ticket.status } });
  } catch (error) {
    next(error);
  }
};
