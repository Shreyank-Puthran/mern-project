import Fixture from "../models/fixtureModel.js";
import League from "../models/leagueModel.js";
import Team from "../models/teamModel.js";
import Player from "../models/playerModel.js";

export const createFixture = async (req, res) => {
  try {
    const {
      date,
      time,
      teamHome,
      teamAway,
      location,
      scoreHome,
      scoreAway,
      league,
      status,
      reportText,
      starPlayer,
      extraInfo,
    } = req.body;

    if (!date || !time || !teamHome || !teamAway || !location || !league) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const homeExists = await Team.findById(teamHome).populate(
      "players.playerId",
      "_id"
    );
    const awayExists = await Team.findById(teamAway).populate(
      "players.playerId",
      "_id"
    );
    const leagueExists = await League.findById(league);

    if (!homeExists || !awayExists || !leagueExists) {
      return res.status(404).json({
        message: "One or more teams or league not found.",
      });
    }

    if (starPlayer) {
      const playerExists = await Player.findById(starPlayer);

      if (!playerExists) {
        return res.status(404).json({ message: "Player not found." });
      }

      // Console checks for debugging
      console.log("→ Incoming starPlayer ID:", starPlayer);
      console.log(
        "→ Home roster IDs:",
        homeExists.players.map((p) => p.playerId.toString())
      );
      console.log(
        "→ Away roster IDs:",
        awayExists.players.map((p) => p.playerId.toString())
      );
      // Console checks for debugging

      // Equals from mongoose
      const isHomePlayer = homeExists.players.some((p) =>
        p.playerId.equals(starPlayer)
      );
      const isAwayPlayer = awayExists.players.some((p) =>
        p.playerId.equals(starPlayer)
      );

      if (!isHomePlayer && !isAwayPlayer) {
        return res.status(400).json({
          message: "Star player must belong to either the home or away team.",
        });
      }
    }

    const fixture = await Fixture.create({
      date,
      time,
      teamHome,
      teamAway,
      location,
      scoreHome,
      scoreAway,
      league,
      status,
      reportText,
      starPlayer,
      extraInfo,
    });

    res.status(201).json(fixture);
  } catch (error) {
    console.log("Error creating fixture", error);
    res.status(500).json({ message: "Server error while creating fixture." });
  }
};

export const getAllFixtures = async (req, res) => {
  try {
    const fixtures = await Fixture.find({})
      .sort({ date: -1 }) // Newest to Oldest
      .populate("teamHome", "name logoUrl")
      .populate("teamAway", "name logoUrl")
      .populate("league", "name country")
      .populate("starPlayer", "name imageUrl position");

    res.status(200).json(fixtures);
  } catch (error) {
    console.log("Error gettting fixtures", error);
    res.status(500).json({ message: "Failed to fetch fixtures." });
  }
};

export const getFixturesById = async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id)
      .populate("teamHome", "name logoUrl")
      .populate("teamAway", "name logoUrl")
      .populate("league", "name country")
      .populate("starPlayer", "name imageUrl position");

    if (!fixture) {
      return res.status(404).json({
        message: "Fixture not found.",
      });
    }

    res.status(200).json(fixture);
  } catch (error) {
    console.log("Error getting fixture", error);
    res.status(500).json({ message: "Failed to fetch fixture." });
  }
};

export const updateFixture = async (req, res) => {
  try {
    const {
      date,
      time,
      teamHome,
      teamAway,
      location,
      scoreHome,
      scoreAway,
      league,
      status,
      reportText,
      extraInfo,
      starPlayer,
    } = req.body;

    const fixture = await Fixture.findById(req.params.id);

    if (!fixture) {
      return res.status(404).json({ message: "Fixture not found." });
    }

    const homeExists = await Team.findById(teamHome).populate(
      "players.playerId",
      "_id"
    );
    const awayExists = await Team.findById(teamAway).populate(
      "players.playerId",
      "_id"
    );
    const leagueExists = await League.findById(league);

    if (!homeExists || !awayExists || !leagueExists) {
      return res.status(404).json({
        message: "One or more teams or league not found.",
      });
    }

    if (starPlayer) {
      const playerExists = await Player.findById(starPlayer);

      if (!playerExists) {
        return res.status(404).json({ message: "Player not found." });
      }

      const isHomePlayer = homeExists.players.some((p) =>
        p.playerId.equals(starPlayer)
      );
      const isAwayPlayer = awayExists.players.some((p) =>
        p.playerId.equals(starPlayer)
      );

      if (!isHomePlayer && !isAwayPlayer) {
        return res.status(400).json({
          message: "Star player must belong to either the home or away team.",
        });
      }
    }

    // Apply updates
    fixture.date = date || fixture.date;
    fixture.time = time || fixture.time;
    fixture.teamHome = teamHome || fixture.teamHome;
    fixture.teamAway = teamAway || fixture.teamAway;
    fixture.location = location || fixture.location;
    fixture.scoreHome = scoreHome ?? fixture.scoreHome; // nullish coalescing operator in JavaScript '??'.
    fixture.scoreAway = scoreAway ?? fixture.scoreAway; // nullish coalescing operator in JavaScript '??'.
    fixture.status = status || fixture.status;
    fixture.reportText = reportText || fixture.reportText;
    fixture.extraInfo = extraInfo || fixture.extraInfo;
    fixture.league = league || fixture.league;
    fixture.starPlayer = starPlayer || fixture.starPlayer;
    
    const updatedFixture = await fixture.save();
    res.status(200).json(updatedFixture);
  } catch (error) {
    console.error("Error updating fixture:", error);
    res.status(500).json({ message: "Failed to update fixture." });
  }
};

export const deleteFixture = async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id);

    if (!fixture) {
      return res.status(404).json({ message: "Fixture not found." });
    }

    await fixture.deleteOne();
    res.status(200).json({ message: "Fixture deleted successfully." });
  } catch (error) {
    console.log("Error deleting fixture", error);
    res.status(500).json({ message: "Failed to delete fixture." });
  }
};
