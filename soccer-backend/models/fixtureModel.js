import mongoose from "mongoose";

const fixtureSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    teamHome: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    teamAway: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    scoreHome: {
      type: Number,
      default: null,
    },
    scoreAway: {
      type: Number,
      default: null,
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed"],
      default: "Scheduled",
    },
    reportText: {
      type: String,
      default: "",
    },
    starPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    extraInfo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Fixture = mongoose.model("Fixture", fixtureSchema);

export default Fixture;
