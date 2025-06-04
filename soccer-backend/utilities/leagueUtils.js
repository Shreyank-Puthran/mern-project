export const addTeamToLeagueHelper = async (league, teamId) => {
    const teamExists = league.teams.find((t) => t.team.toString() === teamId.toString());
    if (teamExists) {
      throw new Error("Team already in this league");
    }
  
    const defaultStats = {
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  
    league.teams.push({
      team: teamId,
      home: { ...defaultStats },
      away: { ...defaultStats },
      overall: { ...defaultStats },
    });
  
    await league.save();
  };