import { timeStamp } from "console";
import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the player"],
    },
    position: {
      type: String,
      required: [true, "Please provide the position of the player"],
    },
    biography: {
      type: String,
      required: [true, "Please provide a biography for the player"],
    },
    imageUrl: {
      type: String,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    stats: {
      goals: {
        type: Number,
        default: 0,
      },
      assists: {
        type: Number,
        default: 0,
      },
      matchesPlayed: {
        type: Number,
        default: 0,
      },
      minutesPlayed: {
        type: Number,
        default: 0,
      },
      passingAccuracy: {
        type: Number,
        default: 0, //In percentage
        min: 0,
        max: 100,
      },
      duelsWon: {
        type: Number,
        default: 0,
      },
      duelsLost: {
        type: Number,
        default: 0,
      },
      aerialDuelsWon: {
        type: Number,
        default: 0,
      },
      aerialDuelsLost: {
        type: Number,
        default: 0,
      },
      recoveries: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;
