import Team from "../models/teamModel.js";
import League from "../models/leagueModel.js";
import Player from "../models/playerModel.js";
import cloudinary from "../cloudinaryConfig.js";
import upload from "../multerCloudinary.js";
import { addTeamToLeagueHelper } from "../utilities/leagueUtils.js";
import { extractPublicId } from "../utilities/cloudinaryUtil.js";

const addTeam = async (req, res) => {
  console.log("REQ.BODY:", req.body);
  console.log("REQ.FILE:", req.file);
  const { name, country, players = [], league } = req.body;

  if (!name || !country || !league || !req.file) {
    return res.status(400).json({
      message:
        "Fields 'name', 'country', 'league', and logo image are required.",
    });
  }

  try {
    const leagueExists = await League.findById(league);
    if (!leagueExists) {
      return res.status(400).json({ message: "League not found" });
    }

    const logo = {
      public_id: req.file.filename,
      url: req.file.path,
    };

    const formattedPlayers = [];
    for (let playerId of players) {
      const player = await Player.findById(playerId);
      if (!player) {
        return res
          .status(400)
          .json({ message: `Player not found: ${playerId}` });
      }

      player.team = null; // Clear old team if any
      await player.save();

      formattedPlayers.push({
        playerId: player._id,
        playerName: player.name,
      });
    }

    const team = new Team({
      name,
      country,
      logoUrl: logo.url,
      players: formattedPlayers,
      league,
    });

    await team.save();
    await addTeamToLeagueHelper(leagueExists, team._id);
    res.status(201).json({ message: "Team added successfully", team });
  } catch (err) {
    console.log("Add Team Error:", err);
    res.status(500).json({
      message: "Error adding team",
      error: err.message || "Unknown error",
      stack: err.stack,
    });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("league", "name")
      .populate("players.playerId", "name");
    res.status(200).json(teams);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching teams", error: err.message });
  }
};

const getSingleTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId)
      .populate("league", "name")
      .populate("players.playerId", "name");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json(team);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching team", error: err.message });
  }
};

const updateTeam = async (req, res) => {
  const { teamId } = req.params;
  const { name, country, players = [], league } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Handle logo update only if a new file is uploaded
    let logoUrl = team.logoUrl;
    if (req.file) {
      // Delete the old image if it exists
      if (team.logoUrl) {
        const publicId = team.logoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload the new image (already handled by multer-cloudinary)
      logoUrl = req.file.path;
    }

    // Check if league has changed and validate new league
    if (league && league !== team.league?.toString()) {
      const leagueExists = await League.findById(league);
      if (!leagueExists) {
        return res.status(400).json({ message: "League not found" });
      }
    }

    // Handle player updates
    const incomingPlayerIds = players.map((p) => p.toString());
    const currentPlayerIds = team.players.map((p) => p.playerId.toString());

    const playersChanged =
      JSON.stringify([...incomingPlayerIds].sort()) !==
      JSON.stringify([...currentPlayerIds].sort());

    let formattedPlayers = team.players;

    if (playersChanged) {
      formattedPlayers = [];

      for (let playerId of players) {
        const player = await Player.findById(playerId);
        if (!player) {
          return res
            .status(400)
            .json({ message: `Player not found: ${playerId}` });
        }

        player.team = teamId;
        await player.save();

        formattedPlayers.push({
          playerId: player._id,
          playerName: player.name,
        });
      }
    }

    // Apply updates
    team.name = name || team.name;
    team.country = country || team.country;
    team.logoUrl = logoUrl;
    if (playersChanged) team.players = formattedPlayers;
    team.league = league || team.league;

    await team.save();

    res.status(200).json({ message: "Team updated successfully", team });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating team", error: err.message });
  }
};

const addPlayerToTeam = async (req, res) => {
  const { teamId } = req.params;
  const { playerId } = req.body;

  if (!playerId) {
    return res.status(400).json({ message: "Player ID is required" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // If player is already in another team, remove from that team
    if (player.team && player.team.toString() !== teamId) {
      await Team.findByIdAndUpdate(player.team, {
        $pull: { players: { playerId: player._id } },
      });
    }

    // Update player's team reference
    player.team = teamId;
    await player.save();

    // Add player to the new team if not already there
    const alreadyInTeam = team.players.some(
      (p) => p.playerId.toString() === playerId
    );

    if (!alreadyInTeam) {
      team.players.push({
        playerId: player._id,
        playerName: player.name,
      });
      await team.save();
    }

    res.status(200).json({ message: "Player added to team", team });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add player", error: error.message });
  }
};

const removeTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.logoUrl) {
      const publicId = extractPublicId(team.logoUrl);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // if (team.logoUrl) {
    //   const publicId = team.logoUrl.split("/").slice(-2, -1).join("/") + "/" + team.logoUrl.split("/").pop().split(".")[0];
    //   const result = await cloudinary.uploader.destroy(publicId);

    //   console.log("Cloudinary result:", result);
    //   if (result.result !== 'ok') {
    //     console.error("Failed to delete image from Cloudinary", result);
    //   }
    // }

    for (const player of team.players) {
      await Player.findByIdAndUpdate(player.playerId, { $unset: { team: "" } });
    }

    // await League.updateMany({}, { $pull: { teams: { team: team._id } } });
    await League.findByIdAndUpdate(team.league, {
      $pull: { teams: { team: team._id } },
    });

    await Team.findByIdAndDelete(teamId);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting team", error: err.message });
  }
};

export {
  addTeam,
  getAllTeams,
  getSingleTeam,
  updateTeam,
  removeTeam,
  addPlayerToTeam,
};
