import api from "../../../api/axios";
import { useState, useEffect } from "react";
import DotSpinner from "../../components/loading";

const FixtureTable = () => {
  const [groupedFixtures, setGroupedFixtures] = useState(null);
  const bgClasses = ["bg-gray-100", "bg-gray-200"];

  // Fetch and group
  const fetchFixtures = async () => {
    try {
      const response = await api.get("/fixtures");
      const fixtureData = response.data;

      // Sort fixtures by date ascending
      const sorted = fixtureData.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Group by month + year
      const grouped = groupFixturesByMonth(sorted);
      setGroupedFixtures(grouped);
    } catch (error) {
      console.log(error.message);
    }
  };

  const groupFixturesByMonth = (fixtures) => {
  return fixtures.reduce((acc, fixture) => {
    // 1) Turn fixture.date into a JS Date
    const date = new Date(fixture.date);

    // 2) Extract the month name ("May", "June", etc.)
    const month = date.toLocaleString("default", { month: "long" });
    
    // 3) Extract the year (e.g. 2025)
    const year = date.getFullYear();
    
    // 4) Build a string key like "May 2025"
    const key = `${month} ${year}`;

    // 5) If acc[key] doesn't exist yet, create it as an empty array
    if (!acc[key]) {
      acc[key] = [];
    }

    // 6) Push this fixture into the correct array
    acc[key].push(fixture);

    // 7) Return the accumulator for the next iteration
    return acc;
  }, {});
};


  useEffect(() => {
    fetchFixtures();
  }, []);

  if (!groupedFixtures) {
    return <DotSpinner className="mx-auto mt-20" />;
  }

  return (
    <section className="md:px-20 px-5 py-12">
      {console.log(groupedFixtures)}
      {Object.entries(groupedFixtures).map(([monthYear, fixtures]) => (
        <div key={monthYear} className="mb-8">
          {/* Month Header */}
          <h2 className="text-xl font-bold text-[#aa4344] mb-5">
            || {monthYear.toUpperCase()}
          </h2>

          {/* Matches List */}
          <ul>
            {fixtures.map((match, i) => (
              <li
                key={match._id}
                className={`${
                  bgClasses[i % bgClasses.length]
                } text-[#5b5e63] text-lg text-center px-3 py-4`}
              >
                <div className="flex items-center w-full">
                  <div className="flex-1 flex items-center   gap-2">
                    <img
                      className="w-8 h-8 object-contain"
                      src={match.teamHome.logoUrl}
                      alt={match.teamHome.name}
                    />
                    <span className="font-semibold">{match.teamHome.name}</span>
                  </div>

                  <div className="text-center">VS</div>

                  <div className="flex-1 flex items-center gap-2 justify-end">
                    <span className="font-semibold">{match.teamAway.name}</span>
                    <img
                      className="w-8 h-8 object-contain"
                      src={match.teamAway.logoUrl}
                      alt={match.teamAway.name}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  {new Date(match.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    weekday: "short",
                  })}{" "}
                  - {match.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default FixtureTable;
