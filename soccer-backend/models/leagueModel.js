import mongoose from "mongoose";

// Define the schema for League
const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  teams: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
      home: {
        matchesPlayed: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        goalsFor: { type: Number, default: 0 },
        goalsAgainst: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      away: {
        matchesPlayed: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        goalsFor: { type: Number, default: 0 },
        goalsAgainst: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      overall: {
        totalMatchesPlayed: { type: Number, default: 0 },
        totalWins: { type: Number, default: 0 },
        totalDraws: { type: Number, default: 0 },
        totalLosses: { type: Number, default: 0 },
        totalPoints: { type: Number, default: 0 },
      },
    },
  ],
  logo: {
    public_id: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

leagueSchema.pre("save", function (next) {
  this.teams.forEach((entry) => {
    // Home points
    entry.home.points = entry.home.wins * 3 + entry.home.draws;
    // Away points
    entry.away.points = entry.away.wins * 3 + entry.away.draws;
    // Overall totals
    const totalWins = entry.home.wins + entry.away.wins;
    const totalLosses = entry.home.losses + entry.away.losses;
    const totalDraws = entry.home.draws + entry.away.draws;
    const totalMatches = entry.home.matchesPlayed + entry.away.matchesPlayed;
    const goalsFor = entry.home.goalsFor + entry.away.goalsFor;
    const goalsAgainst = entry.home.goalsAgainst + entry.away.goalsAgainst;

    entry.overall.totalWins = totalWins;
    entry.overall.totalDraws = totalDraws;
    entry.overall.totalLosses = totalLosses;
    entry.overall.totalMatchesPlayed = totalMatches;
    entry.overall.totalPoints = totalWins * 3 + totalDraws;
    entry.overall.goalDifference = goalsFor - goalsAgainst;
  });
  next();
});

const League = mongoose.model("League", leagueSchema);

export default League;

// 1. Wins, Draws, Losses:
// overall.wins = home.wins + away.wins;
// overall.draws = home.draws + away.draws;
// overall.losses = home.losses + away.losses;

// 2. Goals For and Against (for computing GD):
// const goalsFor = home.goalsFor + away.goalsFor;
// const goalsAgainst = home.goalsAgainst + away.goalsAgainst;
// overall.goalDifference = goalsFor - goalsAgainst;

// 3. Points:
// overall.points = overall.wins * 3 + overall.draws;

// 4. Optional - Matches Played:
// overall.matchesPlayed = overall.wins + overall.draws + overall.losses;
