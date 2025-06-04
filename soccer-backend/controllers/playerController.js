import Player from "../models/playerModel.js";
import cloudinary from "../cloudinaryConfig.js";
import Team from "../models/teamModel.js";
import upload from "../multerCloudinary.js";
import { extractPublicId } from "../utilities/cloudinaryUtil.js";
import mongoose from "mongoose";

const addPlayer = async (req, res) => {
  const { name, team, position, biography, stats = {} } = req.body;

  if (!name || !team || !position || !biography || !req.file) {
    return res.status(400).json({
      message:
        "All required fields (name, team, position, biography, imageUrl) must be provided",
    });
  }

  // checking for teams
  const teamExists = await Team.findById(team);
  if (!teamExists) {
    return res.status(400).json({
      message: "The team does not exist",
    });
  }

  const {
    goals = 0,
    assists = 0,
    matchesPlayed = 0,
    minutesPlayed = 0,
    passingAccuracy = 0,
    duelsWon = 0,
    duelsLost = 0,
    aerialDuelsWon = 0,
    aerialDuelsLost = 0,
    recoveries = 0,
  } = stats;

  const statsToValidate = {
    goals,
    assists,
    matchesPlayed,
    minutesPlayed,
    passingAccuracy,
    duelsWon,
    duelsLost,
    aerialDuelsWon,
    aerialDuelsLost,
    recoveries,
  };

  for (const [key, value] of Object.entries(statsToValidate)) {
    if (value < 0) {
      return res.status(400).json({
        message: `${key} cannot be negative`,
      });
    }
  }

  if (passingAccuracy < 0 || passingAccuracy > 100) {
    return res.status(400).json({
      message: "Passing accuracy must be between 0 and 100",
    });
  }

  try {
    // const imageUrl = {
    //   public_id: req.file.filename,
    //   url: req.file.path,
    // };

    const imageUrl = req.file.path;

    const player = new Player({
      name,
      team,
      position,
      biography,
      imageUrl, // Use the uploaded or existing image URL
      stats: {
        goals,
        assists,
        matchesPlayed,
        minutesPlayed,
        passingAccuracy,
        duelsWon,
        duelsLost,
        aerialDuelsWon,
        aerialDuelsLost,
        recoveries,
      },
    });

    await player.save();

    // Check if the player is already part of the team
    const teamUpdate = await Team.findById(team);
    const playerExistsInTeam = teamUpdate.players.some(
      (p) => p.playerId.toString() === player._id.toString()
    );

    if (playerExistsInTeam) {
      return res.status(400).json({
        message: "Player is already part of this team",
      });
    }

    // Update the team by adding the new player
    await Team.findByIdAndUpdate(team, {
      $push: {
        players: {
          playerId: player._id,
          playerName: player.name,
        },
      },
    });

    res.status(201).json({ message: "Player added successfully", player });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding player", error: err.message });
  }
};

const getPlayers = async (req, res) => {
  try {
    const players = await Player.find().populate("team", "name");
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({
      message: "Unable to fetch players",
      error: err.message,
    });
  }
};

const getSinglePlayer = async (req, res) => {
  const { playerId } = req.params;

  try {
    const player = await Player.findById(playerId).populate("team");
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to fetch player", error: err.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { name, team, position, biography } = req.body;
    const stats = JSON.parse(req.body.stats || "{}");
    const { file } = req;

    // Fetch the player
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Save the original team ID for comparison later
    const originalTeam = player.team?.toString() || null;
    const originalName = player.name;

    // Validate if team is being changed and exists
    if (team && team !== originalTeam) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return res.status(400).json({ message: "The team does not exist" });
      }
    }

    // Extract and validate stats
    const {
      goals = player.stats?.goals || 0,
      assists = player.stats?.assists || 0,
      matchesPlayed = player.stats?.matchesPlayed || 0,
      minutesPlayed = player.stats?.minutesPlayed || 0,
      passingAccuracy = player.stats?.passingAccuracy || 0,
      duelsWon = player.stats?.duelsWon || 0,
      duelsLost = player.stats?.duelsLost || 0,
      aerialDuelsWon = player.stats?.aerialDuelsWon || 0,
      aerialDuelsLost = player.stats?.aerialDuelsLost || 0,
      recoveries = player.stats?.recoveries || 0,
    } = stats || {};

    // Ensure stats are not negative
    for (const [key, value] of Object.entries({
      goals,
      assists,
      matchesPlayed,
      minutesPlayed,
      passingAccuracy,
      duelsWon,
      duelsLost,
      aerialDuelsWon,
      aerialDuelsLost,
      recoveries,
    })) {
      if (value < 0) {
        return res.status(400).json({ message: `${key} cannot be negative` });
      }
    }

    // Ensure passingAccuracy is between 0–100
    if (passingAccuracy < 0 || passingAccuracy > 100) {
      return res.status(400).json({
        message: "Passing accuracy must be between 0 and 100",
      });
    }

    // Required text fields validation
    const requiredFields = { name, team, position, biography };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (value && value.trim() === "") {
        return res.status(400).json({ message: `${key} cannot be empty` });
      }
    }

    // Handle image update
    if (file) {
      if (player.imageUrl) {
        try {
          const publicId = player.imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(
            "Error deleting old image from Cloudinary:",
            err.message
          );
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
      player.imageUrl = cloudinaryResponse.secure_url;
    }

    // Update player fields
    if (name) player.name = name;
    if (team) player.team = team;
    if (position) player.position = position;
    if (biography) player.biography = biography;

    player.stats = {
      goals,
      assists,
      matchesPlayed,
      minutesPlayed,
      passingAccuracy,
      duelsWon,
      duelsLost,
      aerialDuelsWon,
      aerialDuelsLost,
      recoveries,
    };

    await player.save();

    const newTeam = player.team?.toString();
    const newName = player.name;

    if (originalTeam && newTeam) {
      if (originalTeam === newTeam && originalName !== newName) {
        // 1) Name changed only — update in place
        await Team.findOneAndUpdate(
          { _id: newTeam, "players.playerId": player._id },
          { $set: { "players.$.playerName": newName } }
        );
      } else if (originalTeam !== newTeam) {
        // 2) Team changed — remove from old, add to new
        await Team.findByIdAndUpdate(originalTeam, {
          $pull: { players: { playerId: player._id } },
        });
        await Team.findByIdAndUpdate(newTeam, {
          $push: { players: { playerId: player._id, playerName: newName } },
        });
      }
    }

    res.status(200).json({
      message: "Player updated successfully",
      success: true,
      player,
    });
  } catch (err) {
    console.error("Error updating player:", err);
    res.status(500).json({
      message: "Error updating player",
      error: err.message,
      stack: err.stack,
    });
  }
};

const removePlayer = async (req, res) => {
  const { playerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    return res.status(400).json({ message: "Invalid player ID" });
  }

  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // If there's an image, delete it from Cloudinary
    if (player.imageUrl) {
      const publicId = extractPublicId(player.imageUrl);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // Remove player from the team
    if (player.team) {
      await Team.findByIdAndUpdate(player.team, {
        $pull: { players: { playerId: player._id } },
      });
    }

    // Delete the player from the database
    await Player.findByIdAndDelete(playerId);

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting player", error: err.message });
  }
};

export { addPlayer, getPlayers, getSinglePlayer, updatePlayer, removePlayer };
