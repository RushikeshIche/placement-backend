const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      trim: true,
    },
    isFormFilled: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: ["Admin", "User","Company"],
      default: "User",
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
