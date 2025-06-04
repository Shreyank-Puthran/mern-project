import League from "../models/leagueModel.js";
import Team from "../models/teamModel.js";
import cloudinary from "../cloudinaryConfig.js";
import { addTeamToLeagueHelper } from "../utilities/leagueUtils.js";
import { extractPublicId } from "../utilities/cloudinaryUtil.js";


const homeAwayTemplate = {
  matchesPlayed: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
};
const overallTemplate = {
  totalMatchesPlayed: 0,
  totalWins: 0,
  totalDraws: 0,
  totalLosses: 0,
  totalPoints: 0,
};


// const createLeague = async (req, res) => {
//   try {
//     const { name, country } = req.body;

//     if (!name || !country || !req.file) {
//       return res.status(400).json({
//         message: "Fields 'name', 'country', and logo image are required.",
//       });
//     }

//     const logo = {
//       public_id: req.file.filename,
//       url: req.file.path,
//     };

//     const league = await League.create({ name, country, logo });

//     res.status(201).json({ message: "League created successfully", league });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create league", error: error.message });
//   }
// };

const createLeague = async (req, res) => {
  try {
    const { name, country, teams } = req.body;
    if (!name || !country || !req.file) {
      return res.status(400).json({
        message: "Fields 'name', 'country', and logo image are required.",
      });
    }

    // 1️⃣ Upload logo
    const logo = { public_id: req.file.filename, url: req.file.path };

    // 2️⃣ Build league
    const league = new League({ name, country, logo, teams: [] });

    // 3️⃣ Bulk‑add any provided teams
    if (teams) {
      const arr = JSON.parse(teams);
      for (const t of arr) {
        // skip duplicates
        if (league.teams.some((e) => e.team.toString() === t.team)) continue;

        const home    = { ...homeAwayTemplate, ...t.home };
        const away    = { ...homeAwayTemplate, ...t.away };
        const overall = { ...overallTemplate, ...t.overall };

        league.teams.push({ team: t.team, home, away, overall });
      }
    }

    await league.save();
    await league.populate("teams.team");

    res.status(201).json({
      message: "League created (with teams) successfully",
      league,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create league", error: error.message });
  }
};


const updateLeague = async (req, res) => {
  try {
    const { leagueId } = req.params;
    const { name, country, teams } = req.body;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }

    // 1️⃣ Update basic fields
    if (name)    league.name = name;
    if (country) league.country = country;

    // 2️⃣ Replace logo if new file
    if (req.file) {
      if (league.logo?.public_id) {
        await cloudinary.uploader.destroy(league.logo.public_id);
      }
      league.logo = { public_id: req.file.filename, url: req.file.path };
    }

    // 3️⃣ Bulk update/add team stats
    if (teams) {
      const arr = JSON.parse(teams);
      for (const t of arr) {
        const existing = league.teams.find((e) => e.team.toString() === t.team);

        const home    = { ...homeAwayTemplate, ...t.home };
        const away    = { ...homeAwayTemplate, ...t.away };
        const overall = { ...overallTemplate, ...t.overall };

        if (existing) {
          // overwrite existing stats
          existing.home    = home;
          existing.away    = away;
          existing.overall = overall;
        } else {
          // new team
          league.teams.push({ team: t.team, home, away, overall });
        }
      }
    }

    await league.save();
    await league.populate("teams.team");

    res.status(200).json({
      message: "League and team‑stats updated successfully",
      league,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update league", error: error.message });
  }
};

const getAllLeagues = async (req, res) => {
  try {
    const leagues = await League.find().populate("teams.team");
    res.status(200).json(leagues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leagues", error: error.message });
  }
};


const getSingleLeague = async (req, res) => {
  try {
    const { leagueId } = req.params;
    const league = await League.findById(leagueId).populate("teams.team");

    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }

    res.status(200).json(league);
  } catch (error) {
    res.status(500).json({ message: "Failed to get league", error: error.message });
  }
};


// const updateLeague = async (req, res) => {
//   try {
//     const { leagueId } = req.params;
//     const { name, country } = req.body;

//     const league = await League.findById(leagueId);
//     if (!league) {
//       return res.status(404).json({ message: "League not found" });
//     }

//     if (name) league.name = name;
//     if (country) league.country = country;

//     if (req.file) {
//       // Delete old image if it exists
//       if (league.logo?.public_id) {
//         await cloudinary.uploader.destroy(league.logo.public_id);
//       }

//       league.logo = {
//         public_id: req.file.filename,
//         url: req.file.path,
//       };
//     }

//     await league.save();
//     res.status(200).json({ message: "League updated successfully", league });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update league", error: error.message });
//   }
// };


const updateTeamStats = async (req, res) => {
  try {
    const { leagueId, teamId } = req.params;
    const { venue, result, goalsFor = 0, goalsAgainst = 0 } = req.body;
    // venue should be "home" or "away"
    // result should be "win", "draw", or "loss"

    const league = await League.findById(leagueId);
    if (!league) return res.status(404).json({ message: "League not found" });

    // find the team entry
    const entry = league.teams.find(t => t.team.toString() === teamId);
    if (!entry) return res.status(404).json({ message: "Team not in this league" });

    // 1️⃣ Update home/away stats
    entry[venue].matchesPlayed += 1;
    entry[venue].goalsFor      += goalsFor;
    entry[venue].goalsAgainst  += goalsAgainst;
    if (result === "win")  entry[venue].wins++;
    if (result === "draw") entry[venue].draws++;
    if (result === "loss") entry[venue].losses++;
    // recompute points for this venue
    entry[venue].points = entry[venue].wins * 3 + entry[venue].draws;

    // 2️⃣ Recalculate overall
    const h = entry.home;
    const a = entry.away;
    entry.overall.totalMatchesPlayed = h.matchesPlayed + a.matchesPlayed;
    entry.overall.totalWins           = h.wins + a.wins;
    entry.overall.totalDraws          = h.draws + a.draws;
    entry.overall.totalLosses         = h.losses + a.losses;
    entry.overall.totalPoints         = entry.overall.totalWins * 3 + entry.overall.totalDraws;

    // (optional) goal difference:
    entry.overall.goalDifference = (h.goalsFor + a.goalsFor) - (h.goalsAgainst + a.goalsAgainst);

    await league.save();
    res.status(200).json({ message: "Team stats updated", teamEntry: entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update team stats", error: error.message });
  }
};


// const addTeamToLeague = async (req, res) => {
//   try {
//     const { leagueId } = req.params;
//     const { teamId } = req.body;

//     const league = await League.findById(leagueId);
//     if (!league) {
//       return res.status(404).json({ message: "League not found" });
//     }

//     await addTeamToLeagueHelper(league, teamId);

//     res.status(200).json({ message: "Team added to league", league });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to add team", error: error.message });
//   }
// };


const addTeamToLeague = async (req, res) => {
  try {
    const { leagueId } = req.params;
    const { teamId } = req.body;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }

    // Prevent duplicates
    if (league.teams.some(t => t.team.toString() === teamId)) {
      return res.status(400).json({ message: "Team already in league" });
    }

    // Create a fresh stats object
    const newEntry = {
      team: teamId,
      home:    { matchesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      away:    { matchesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      overall: { totalMatchesPlayed: 0, totalWins: 0, totalDraws: 0, totalLosses: 0, totalPoints: 0, goalDifference: 0 }
    };

    // Push into league
    league.teams.push(newEntry);

    // Recalculate overall for the newly added entry
    const entry = league.teams.find(t => t.team.toString() === teamId);
    const h = entry.home;
    const a = entry.away;

    entry.overall.totalMatchesPlayed = h.matchesPlayed + a.matchesPlayed;
    entry.overall.totalWins           = h.wins + a.wins;
    entry.overall.totalDraws          = h.draws + a.draws;
    entry.overall.totalLosses         = h.losses + a.losses;
    entry.overall.totalPoints         = entry.overall.totalWins * 3 + entry.overall.totalDraws;
    entry.overall.goalDifference      = (h.goalsFor + a.goalsFor) - (h.goalsAgainst + a.goalsAgainst);

    await league.save();

    // Populate team details before sending back
    await league.populate("teams.team");

    res.status(200).json({ message: "Team added to league", teamEntry: entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add team", error: error.message });
  }
};


const removeLeague = async (req, res) => {
  try {
    const { leagueId } = req.params;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }

    if (league.logo?.url) {
      const publicId = extractPublicId(league.logo.url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await league.deleteOne();
    res.status(200).json({ message: "League deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete league", error: error.message });
  }
};


export {
  createLeague,
  getAllLeagues,
  getSingleLeague,
  updateLeague,
  updateTeamStats,
  addTeamToLeague,
  removeLeague,
};
