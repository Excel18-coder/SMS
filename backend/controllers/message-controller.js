const Message = require("../models/messageSchema");

// Send Message
const sendMessage = async (req, res, next) => {
  try {
    const message = new Message(req.body);
    const result = await message.save();

    await result.populate([
      { path: "sender", select: "name email" },
      { path: "recipient", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Inbox Messages
const getInboxMessages = async (req, res) => {
  try {
    const { userId, userModel } = req.query;

    const messages = await Message.find({
      recipient: userId,
      recipientModel: userModel,
    })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching inbox messages",
      error: err.message,
    });
  }
};

// Get Sent Messages
const getSentMessages = async (req, res) => {
  try {
    const { userId, userModel } = req.query;

    const messages = await Message.find({
      sender: userId,
      senderModel: userModel,
    })
      .populate("recipient", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching sent messages",
      error: err.message,
    });
  }
};

// Get Message Details
const getMessageDetail = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("sender", "name email")
      .populate("recipient", "name email")
      .populate("replyTo");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching message details",
      error: err.message,
    });
  }
};

// Mark Message as Read
const markAsRead = async (req, res, next) => {
  try {
    const result = await Message.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Unread Count
const getUnreadCount = async (req, res) => {
  try {
    const { userId, userModel } = req.query;

    const count = await Message.countDocuments({
      recipient: userId,
      recipientModel: userModel,
      isRead: false,
    });

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: err.message,
    });
  }
};

// Get Conversation
const getConversation = async (req, res) => {
  try {
    const { user1Id, user1Model, user2Id, user2Model } = req.query;

    const messages = await Message.find({
      $or: [
        {
          sender: user1Id,
          senderModel: user1Model,
          recipient: user2Id,
          recipientModel: user2Model,
        },
        {
          sender: user2Id,
          senderModel: user2Model,
          recipient: user1Id,
          recipientModel: user1Model,
        },
      ],
    })
      .populate("sender", "name email")
      .populate("recipient", "name email")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching conversation",
      error: err.message,
    });
  }
};

// Reply to Message
const replyToMessage = async (req, res, next) => {
  try {
    const originalMessage = await Message.findById(req.params.id);

    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: "Original message not found",
      });
    }

    const reply = new Message({
      ...req.body,
      replyTo: req.params.id,
      recipient: originalMessage.sender,
      recipientModel: originalMessage.senderModel,
    });

    const result = await reply.save();

    await result.populate([
      { path: "sender", select: "name email" },
      { path: "recipient", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Message
const deleteMessage = async (req, res, next) => {
  try {
    const result = await Message.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Bulk Delete Messages
const bulkDeleteMessages = async (req, res, next) => {
  try {
    const { messageIds } = req.body;

    const result = await Message.deleteMany({
      _id: { $in: messageIds },
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} messages deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getInboxMessages,
  getSentMessages,
  getMessageDetail,
  markAsRead,
  getUnreadCount,
  getConversation,
  replyToMessage,
  deleteMessage,
  bulkDeleteMessages,
};
