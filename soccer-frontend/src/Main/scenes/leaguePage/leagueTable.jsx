import api from "../../../api/axios";
import { useState, useEffect } from "react";

const LeagueTable = () => {
  const [league, setLeague] = useState([]);

  const bgClasses = ["bg-gray-100", "bg-gray-200"];

  const fetchLeagues = async () => {
    try {
      const response = await api.get("/league");

      const leagueData = response.data[response.data.length - 1].teams;
      setLeague(leagueData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);
  return (
    <>
      <div className="mx-auto md:px-20 px-15 py-12 flex flex-col">
        <div className="flex-grow overflow-x-auto">
  <table className="min-w-[900px] table-auto mb-4 w-full">
            <thead>
              <tr>
                <th
                  rowSpan={1}
                  className="bg-[#373737] border-r border-black text-white py-1 text-center text-xl"
                ></th>
                <th
                  rowSpan={1}
                  className="bg-[#373737] border-r border-l border-black text-white py-1 text-center text-xl"
                ></th>
                <th
                  rowSpan={1}
                  className="bg-[#373737] border-r border-l border-black text-white py-1 text-center text-xl"
                ></th>
                <th
                  colSpan={5}
                  className="bg-[#373737] border-r border-l border-black text-white py-1 text-center text-xl"
                >
                  HOME
                </th>
                <th
                  colSpan={5}
                  className="bg-[#373737] border-r border-l border-black text-white py-1 text-center text-xl"
                >
                  AWAY
                </th>
                <th
                  colSpan={5}
                  className="bg-[#373737]  border-l border-black text-white py-1 text-center text-xl"
                >
                  OVERALL
                </th>
              </tr>
              <tr>
                {[
                  "POS",
                  "Team",
                  "P",
                  "W",
                  "D",
                  "L",
                  "F",
                  "A",
                  "W",
                  "D",
                  "L",
                  "F",
                  "A",
                  "W",
                  "D",
                  "L",
                  "GD",
                  "Pts",
                ].map((head, idx) => (
                  <th
                    key={`${head}-${idx}`}
                    className={`bg-[#212121] text-white px-3 py-3 text-lg ${
                      head === "Team" ? "text-left" : "text-center"
                    }`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {league
                ?.sort((a, b) => b.overall.totalPoints - a.overall.totalPoints)
                .map((league, index) => (
                  <tr
                    key={index}
                    className={`${
                      bgClasses[index % 2]
                    } text-gray-500 text-center`}
                  >
                    <td className="px-2 md:py-4  border-r border-stone-300 ">
                      {index + 1}
                    </td>
                    <td className="px-2 py-2 flex items-center justify-normal border-r border-stone-300  ">
                      <img
                        className="w-10 h-10 mx-3"
                        src={league?.team?.logoUrl}
                      />{" "}
                      {league?.team?.name}
                    </td>
                    <td className="px-2 py-1 border-r border-stone-300">
                      {Math.floor(
                        league.home.matchesPlayed + league.away.matchesPlayed
                      )}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.home.wins)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.home.draws)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.home.losses)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300 ">
                      {Math.floor(league.home.goalsFor + 5)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300 ">
                      {Math.floor(league.home.goalsAgainst)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.away.wins)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.away.draws)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.away.losses)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300 ">
                      {Math.floor(league.away.goalsFor + 5)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300 ">
                      {Math.floor(league.away.goalsAgainst)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.overall.totalWins)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.overall.totalDraws)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300">
                      {Math.floor(league.overall.totalLosses)}
                    </td>
                    <td className=" px-2 py-1 border-r border-stone-300 ">
                      {Math.floor(
                        league.home.goalsFor +
                          league.away.goalsFor +
                          10 -
                          (league.home.goalsAgainst + league.away.goalsAgainst)
                      )}
                    </td>
                    <td className=" px-2 py-1">
                      {Math.floor(league.overall.totalPoints)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LeagueTable;
