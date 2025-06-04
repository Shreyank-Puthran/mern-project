import api from "../../../api/axios";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from 'react-router-dom';

const TeamPlayer = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  const fetchPlayers = async () => {
    try {
      const response = await api.get("/players");
      const playerData = response.data;
      setPlayers(playerData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get("/teams");
      const teamData = response.data;
      setTeams(teamData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  return (
    <>
      {/* Players section */}
      <section className="md:px-20 px-15 py-12">
        <h3 className="mx-auto text-center text-2xl font-semibold my-5 text-[#aa4344] underline underline-offset-8">Players</h3>
        <div className="grid container text-[#353535] mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-lg">
          
          {players.map((player, index) => (
            <Link key={player._id} to={`/players/${player._id}`}>
            <div
              
              className="text-center text-xl w-full h-auto cursor-pointer hover:shadow-lg transition duration-600 ease-in-out rounded overflow-hidden"
            >
              <img className="w-full h-auto rounded" src={player.imageUrl} />
              <p className="text-center font-semibold text-2xl my-2">
                {player.name}
              </p>
              <p>Position: {player.position}</p>
              <p>Team: {player.team.name}</p>
            </div>
            </Link>
          ))}
          
        </div>
      </section>
      {/* Teams Section */}
      <section className="md:px-20 px-15 py-12">
        <div className="mx-auto">
          <h3 className="mx-auto text-center text-2xl font-semibold my-5 text-[#aa4344] underline underline-offset-8">
            Featured Teams
          </h3>
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            modules={[Navigation, Autoplay]}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={2000}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {teams.map((team, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center my-5 justify-center text-center rounded transition duration-600 ease-in-out shadow-lg/40">
                  <img
                    src={team.logoUrl}
                    alt={`${team.name}`}
                    className="w-20 h-20 py-2 transition duration-600 ease-in-out"
                  />
                  <p className="mt-2 font-bold">{team.name}</p>
                  <p className="text-sm text-gray-600">{team.country}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default TeamPlayer;
