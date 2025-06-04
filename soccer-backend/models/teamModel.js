import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the team"],
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Please provide a country for the team"],
    },
    logoUrl: {
      type: String,
    },
    players: [
      {
        playerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
        },
        playerName: {
          type: String,
        },
      },
    ],
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
    },
  },
  { timestamps: true }
);


const Team = mongoose.model("Team", teamSchema);

export default Team;