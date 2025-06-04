import ImageSlider from "../../components/imageSlider";
import shop from "../../assets/banner-shop-2.jpg";
import fixtureBanner1 from "../../assets/banner-fixture1.jpg";
import fixtureBanner2 from "../../assets/banner-fixture2.jpg";
import smallBanner1 from "../../assets/smallBanner1.jpg";
import smallBanner2 from "../../assets/smallBanner2.jpg";
import smallBanner3 from "../../assets/smallBanner3.jpg";
import api from "../../../api/axios";
import { useState, useEffect } from "react";
//For Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import { Link } from "react-router-dom";
import { IoPricetagSharp } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import DotSpinner from "../../components/loading";

const Home = () => {
  const [league, setLeague] = useState([]);
  const [news, setNews] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [fixtureData, setFixtureData] = useState([]);
  const [players, setPlayers] = useState([]);

  const bgClasses = ["bg-gray-100", "bg-gray-200", "bg-gray-300"];

  const fetchFixtures = async () => {
    try {
      const response = await api.get("/fixtures");

      const fixtureData = response.data;
      const sortedAndLimited = fixtureData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 1);
      const sorted = fixtureData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFixtures(sortedAndLimited);
      setFixtureData(sorted);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get("/players");
      const playerData = response.data;
      setPlayers(playerData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchLeagues = async () => {
    try {
      const response = await api.get("/league");

      const leagueData = response.data[response.data.length - 1].teams;
      setLeague(leagueData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await api.get("/news");
      const newsData = response.data;
      // const sortedAndLimited = fixtureData
      //   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setNews(newsData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchFixtures();
    fetchPlayers();
    fetchLeagues();
    fetchNews();
  }, []);

  if (!league || !news || !fixtures || !fixtureData || !players) {
    return <DotSpinner className="mx-auto my-20" />;
  }

  return (
    <>
      <ImageSlider />

      {/* Upcoming Match */}
      <section className="py-12 bg-[f0f0f0]">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <img
                src={fixtures[0]?.teamHome?.logoUrl}
                alt="Team 1"
                className="h-16 mx-auto"
              />
              <p className="mt-2 uppercase font-semibold">
                {fixtures[0]?.teamHome?.name}
              </p>
            </div>
            <div className="text-xl font-bold">VS</div>
            <div>
              <img
                src={fixtures[0]?.teamAway?.logoUrl}
                alt="Team 2"
                className="h-16 mx-auto"
              />
              <p className="mt-2 uppercase font-semibold">
                {fixtures[0]?.teamAway?.name}
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            {new Date(fixtures[0]?.date).toLocaleDateString()} -{" "}
            {fixtures[0]?.time} · {fixtures[0]?.location}
          </p>
          <Link to={"/fixture-page"}>
            <button className="mt-4 px-6 py-2 bg-[#aa4344] text-white rounded hover:bg-[#aa4344]/90 cursor-pointer">
              View All
            </button>
          </Link>
        </div>
      </section>

      {/* Players Carousel */}

      <section className="md:px-20 px-15 py-12 bg-[url('/player-bg.jpg')] bg-cover bg-center text-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-3xl text-center font-semibold mb-6">
                || Players
              </h2>
              <a
                className="block mx-auto text-sm text-center w-30 font-semibold mb-6 hover:text-[#aa4344] cursor-pointer"
                href="#"
              >
                View all players
              </a>
            </div>
            <div className="flex items-center mb-6">
              <button className="swiper-button-prev-custom text-xl bg-[#aa4344] p-2 rounded-full mx-2 text-white hover:cursor-pointer">
                <FaChevronLeft />
              </button>
              <button className="swiper-button-next-custom text-xl bg-[#aa4344] p-2 rounded-full mx-2 text-white hover:cursor-pointer">
                <FaChevronRight />
              </button>
            </div>
          </div>
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
              disabledClass: "swiper-button-disabled",
            }}
            loop={players.length > 5}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {players.map((player, index) => (
              <SwiperSlide key={index}>
                <Link key={player._id} to={`/players/${player._id}`}>
                  <div className="text-center rounded shadow">
                    <img
                      src={player.imageUrl}
                      alt={`The player ${player.name}`}
                      className="w-full h-auto object-cover rounded hover:cursor-pointer transition duration-600 ease-in-out hover:scale-105"
                    />
                    <p className="mt-2 font-bold">{player.name}</p>
                    <p className="text-sm text-gray-300">{player.position}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* League Table - Shop - Recent News */}
      <section className="py-12 md:px-20 px-15 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-stretch">
          {/* League Table*/}
          <div className="md:col-start-1 md:col-end-2 h-full flex flex-col md:row-start-1 md:row-end-3">
            <h3 className="text-3xl font-semibold text-[#aa4344] mb-4 whitespace-nowrap">
              || League Table
            </h3>
            <div className="flex-grow">
              <table className="w-full min-h-full table-auto mb-4">
                <thead>
                  <tr>
                    {["Team", "W", "D", "L", "Pts"].map((head) => (
                      <th
                        key={head}
                        className=" bg-[#212121] text-white px-2 py-1 text-left text-md"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {league
                    ?.sort(
                      (a, b) => b.overall.totalPoints - a.overall.totalPoints
                    )
                    .map((league, index) => (
                      <tr
                        key={index}
                        className="bg-[#f5f5f5] hover:bg-gray-100"
                      >
                        <td className="px-2 py-1 flex items-center text-[#93959f]">
                          <img
                            className="w-5 h-5 mx-1"
                            src={league?.team?.logoUrl}
                          />{" "}
                          {league?.team?.name}
                        </td>
                        <td className=" px-2 py-1">
                          {Math.floor(league.overall.totalWins)}
                        </td>
                        <td className=" px-2 py-1">
                          {Math.floor(league.overall.totalDraws)}
                        </td>
                        <td className=" px-2 py-1">
                          {Math.floor(league.overall.totalLosses)}
                        </td>
                        <td className=" px-2 py-1 font-bold">
                          {Math.floor(league.overall.totalPoints)}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot className="px-4 py-2 bg-[#aa4344] hover:bg-[#aa4344]/90 text-white text-center hover:cursor-pointer">
                  <tr>
                    <td className=" px-2 py-2 font-bold" colSpan={5}>
                      <a href="/league-page" className="hover:cursor-pointer">
                        View Full Table
                      </a>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Shop Link Image */}
          <div className="md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4 relative group">
            <a href="/shop">
              <img
                src={shop}
                alt="Shop Link"
                className="w-full md:h-full rounded block"
              />

              <div className="hidden md:flex absolute top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center text-white opacity-0 hover:cursor-pointer group-hover:opacity-100 transition-opacity duration-500 delay-300">
                <span className="bg-[#aa4344] text-white p-2 rounded text-3xl">
                  <FaLink />
                </span>
              </div>
            </a>
          </div>
          {/* Recent News: */}
          <div className="md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-4">
            <h3 className="text-3xl text-[#aa4344] font-semibold mb-4">
              || Recent News
            </h3>
            <div className="grid cols-1 md:grid-cols-2 grid-rows-2 gap-6">
              {news
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 4)
                .map((news, index) => (
                  <Link key={news._id} to={`/news/${news._id}`}>
                    <div
                      key={index}
                      className="space-x-4 flex flex-col h-full "
                    >
                      <div className="w-full h-auto mb-4">
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full "
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h4 className="font-semibold mb-1">{news.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-x-2 mb-2">
                          <FaRegCalendarAlt />
                          {new Date(news.date).toLocaleDateString()}
                          <IoPricetagSharp />
                          {news.tags.join(", ")}
                        </p>
                        <p className="flex-grow mb-2 text-[#93959f]">
                          {news.content.length > 100
                            ? news.content.slice(0, 100) + "..."
                            : news.content}
                        </p>
                        <button className="text-[#aa4344] cursor-pointer font-bold text-md hover:text-[#aa4344] mt-auto self-start">
                          Read More
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Scorers & Featured Video */}
      <section className="py-12 md:px-20 px-15 bg-[url('/video-bg.jpg')] bg-cover bg-center text-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Top Scorers */}
          <div className="h-full">
            <h3 className="text-2xl font-semibold mb-4">|| Top Scorers</h3>
            <ul className="space-y-4">
              {players
                .sort((a, b) => b.stats.goals - a.stats.goals)
                .slice(0, 4)
                .map((name, i) => (
                  <Link key={name._id} to={`/players/${name._id}`}>
                    <li
                      key={name._id}
                      className="flex items-center space-x-3 pb-5 border-b-2 border-white"
                    >
                      <div className="w-20 h-20 flex items-center justify-center">
                        <img
                          className="h-full w-full rounded-full"
                          src={name.imageUrl}
                        />
                      </div>
                      <div className="text-xl">
                        <p className="font-bold">{name.name}</p>

                        <p>{name.stats.goals} Goals</p>
                        <p>
                          {name.biography.length > 50
                            ? name.biography.slice(0, 50) + "..."
                            : name.biography}
                        </p>
                      </div>
                    </li>
                  </Link>
                ))}
            </ul>
          </div>
          {/* Featured Video */}
          <div className="h-full">
            <h3 className="text-2xl font-semibold mb-4">|| Featured Video</h3>
            <div className="w-full aspect-video bg-black">
              {/* Embed iframe or video player here */}
              <iframe
                title="Highlight From Last Match"
                src="https://player.vimeo.com/video/81042264?"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen"
              ></iframe>
              <h3 className="text-2xl bg-[#212121] text-center font-semibold py-5 text-white mb-4">
                Highlight From Last Match
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Fixtures & Promotions */}
      <section className="py-12 md:px-20 px-15 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fixtures List */}
          <div className="w-full">
            <h3 className="text-2xl text-[#aa4344] font-semibold mb-4">
              || Fixtures & Results
            </h3>
            <ul>
              {fixtureData.map((match, i) => (
                <li
                  key={i}
                  className={`${
                    bgClasses[i % 3]
                  } text-[#5b5e63] text-lg text-center px-3 py-2 cursor-pointer`}
                >
                  <a
                    href="#"
                    className="flex items-center justify-between w-full"
                  >
                    <p className="flex-1 text-left">{match.teamHome.name}</p>
                    <p className="w-10 text-center">VS</p>
                    <p className="flex-1 text-right">{match.teamAway.name}</p>
                  </a>
                </li>
              ))}
              <li className="px-4 py-2 bg-[#aa4344] cursor-pointer text-center text-white hover:bg-[#aa4344]/90">
                <Link to={"/fixture-page"}>View All Fixtures</Link>
              </li>
            </ul>
          </div>

          {/* Promotion Section */}
          <div className="col-span-1 md:col-span-2 w-full space-y-4">
            {/* Row 1: Two big banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y-2 border-gray-200">
              <div className="text-center border-r-0 sm:border-r-2 border-gray-200">
                <a href="#">
                  <img src={fixtureBanner1} className="w-full h-auto" />
                </a>
              </div>
              <div className="text-center">
                <a href="#">
                  <img src={fixtureBanner2} className="w-full h-auto" />
                </a>
              </div>
            </div>

            {/* Row 2: Three small banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <img src={smallBanner1} className="w-full h-auto" />
              <img src={smallBanner2} className="w-full h-auto" />
              <img src={smallBanner3} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
