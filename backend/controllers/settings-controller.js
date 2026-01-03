const Student = require("../models/studentSchema");
const Teacher = require("../models/teacherSchema");
const Admin = require("../models/adminSchema");
const Parent = require("../models/parentSchema");
const bcrypt = require("bcrypt");

// Update Profile (Generic for all user types)
const updateProfile = async (req, res, next) => {
  try {
    const { userId, userModel } = req.body;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      case "admin":
        Model = Admin;
        break;
      case "parent":
        Model = Parent;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const result = await Model.findByIdAndUpdate(
      userId,
      { $set: req.body.updates },
      { new: true }
    ).select("-password");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { userId, userModel, currentPassword, newPassword } = req.body;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      case "admin":
        Model = Admin;
        break;
      case "parent":
        Model = Parent;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Update Preferences
const updatePreferences = async (req, res, next) => {
  try {
    const { userId, userModel, preferences } = req.body;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      case "admin":
        Model = Admin;
        break;
      case "parent":
        Model = Parent;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const result = await Model.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true }
    ).select("preferences");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: result.preferences,
    });
  } catch (err) {
    next(err);
  }
};

// Upload Profile Picture
const uploadProfilePicture = async (req, res, next) => {
  try {
    const { userId, userModel, profilePicture } = req.body;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      case "admin":
        Model = Admin;
        break;
      case "parent":
        Model = Parent;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const result = await Model.findByIdAndUpdate(
      userId,
      { $set: { profilePicture } },
      { new: true }
    ).select("profilePicture");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: { profilePicture: result.profilePicture },
    });
  } catch (err) {
    next(err);
  }
};

// Add Notification
const addNotification = async (req, res, next) => {
  try {
    const { userId, userModel, notification } = req.body;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.notifications.push(notification);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification added successfully",
      data: user.notifications,
    });
  } catch (err) {
    next(err);
  }
};

// Get Notifications
const getNotifications = async (req, res) => {
  try {
    const { userId, userModel } = req.query;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const user = await Model.findById(userId).select("notifications");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.notifications.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: err.message,
    });
  }
};

// Mark Notification as Read
const markNotificationRead = async (req, res, next) => {
  try {
    const { userId, userModel, notificationId } = req.body;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notification = user.notifications.id(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    next(err);
  }
};

// Clear All Notifications
const clearAllNotifications = async (req, res, next) => {
  try {
    const { userId, userModel } = req.body;

    let Model;
    switch (userModel) {
      case "student":
        Model = Student;
        break;
      case "teacher":
        Model = Teacher;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user model",
        });
    }

    const result = await Model.findByIdAndUpdate(
      userId,
      { $set: { notifications: [] } },
      { new: true }
    ).select("notifications");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateProfile,
  changePassword,
  updatePreferences,
  uploadProfilePicture,
  addNotification,
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
};
