import api from "../../../api/axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import { TfiYoutube } from "react-icons/tfi";
import DotSpinner from "../../components/loading.jsx";
import { Link } from "react-router-dom";

// Images
import {
  battle,
  beach,
  card,
  france,
  player,
  player2,
  manager,
  yacht,
  resort,
  architect,
  exercise,
  bridge,
} from "../../assets/gallery/index.js";
// Images

const SinglePlayer = () => {
  const [players, setPlayers] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");
  const [fadeOut, setFadeOut] = useState(false);
  const [displayedTab, setDisplayedTab] = useState("stats");

  // Random data for dob, height and weight
  const [dob, setDob] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  const { playerId } = useParams();

  const fetchPlayers = async () => {
    try {
      const response = await api.get(`/players/get-player/${playerId}`);
      const playersArray = response.data;
      setPlayers(playersArray);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get("/products/reviews");
      setReviews(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchReviews();
  }, [playerId]);

  //Random Data for DOB, Height, Weight
  useEffect(() => {
    const randomDateOfBirth = () => {
      const start = new Date(1980, 0, 1);
      const end = new Date(2005, 11, 31);
      const dob = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
      return dob.toLocaleDateString("en-GB");
    };

    const randomHeight = () => Math.floor(160 + Math.random() * 40);
    const randomWeight = () => Math.floor(60 + Math.random() * 40);

    setDob(randomDateOfBirth());
    setHeight(randomHeight());
    setWeight(randomWeight());
  }, []);

  const handleTabClick = (tab) => {
    if (tab === activeTab) return;
    setFadeOut(true);
    setTimeout(() => {
      setDisplayedTab(tab);
      setFadeOut(false);
      setActiveTab(tab);
    }, 300);
  };

  const tabClass = (tab) =>
    `font-semibold text-lg md:text-xl cursor-pointer ${
      activeTab === tab
        ? "text-[#393939]"
        : "text-[#787878] hover:text-[#393939]"
    }`;

  if (!players || !reviews) {
    return <DotSpinner className="mx-auto mt-20" />;
  }

  const gallery = [
    { src: battle, alt: "Battle" },
    { src: beach, alt: "Beach" },
    { src: card, alt: "Card" },
    { src: france, alt: "France" },
    { src: player, alt: "Player" },
    { src: player2, alt: "Another Player" },
    { src: manager, alt: "Manager" },
    { src: yacht, alt: "Yacht" },
    { src: resort, alt: "Resort" },
    { src: architect, alt: "Architect" },
    { src: exercise, alt: "Exercise" },
    { src: bridge, alt: "Bridge" },
  ];

  return (
    <>
      {/* TopBar */}
      <div className="bg-[#a73333] text-white mt-30 py-12 px-15 md:px-20 flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            className="w-20 h-20 md:w-32 md:h-32 rounded-full"
            src={players.imageUrl}
            alt={players.name}
          />
          <div>
            <p className="text-2xl md:text-4xl font-bold">{players.name}</p>
            <p className="text-xl md:text-2xl font-light">{players.position}</p>
          </div>
        </div>
        <div className="text-sm md:text-base space-y-2">
          <p>
            <strong>Nationality</strong>: English
          </p>
          <p>
            <strong>Date Of Birth</strong>: {dob}
          </p>
          <p>
            <strong>Height</strong>: {height}cm
          </p>
          <p>
            <strong>Weight</strong>: {weight}kg
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 py-6 px-15 md:px-20 flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span
            onClick={() => handleTabClick("stats")}
            className={tabClass("stats")}
          >
            PLAYER STATS
          </span>
          <span className="text-xl text-gray-400">|</span>
          <span
            onClick={() => handleTabClick("bio")}
            className={tabClass("bio")}
          >
            BIOGRAPHY
          </span>
          <span className="text-xl text-gray-400">|</span>
          <span
            onClick={() => handleTabClick("gallery")}
            className={tabClass("gallery")}
          >
            GALLERY
          </span>
        </div>
        <div className="flex space-x-3 text-2xl text-[#787878]">
          <FaFacebookF className="cursor-pointer hover:text-[#393939]" />
          <FaTwitter className="cursor-pointer hover:text-[#393939]" />
          <ImInstagram className="cursor-pointer hover:text-[#393939]" />
          <TfiYoutube className="cursor-pointer hover:text-[#393939]" />
        </div>
      </div>

      {/* Content */}
      <section className="py-12 px-15 md:px-20 bg-white flex flex-col md:flex-row gap-8">
        {/* Left Section */}
        <div
          className={`w-full md:w-2/3 transition-opacity duration-300 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {displayedTab === "stats" && (
            <div className="">
              {Object.entries(players.stats).map(([key, value]) => (
                <div
                  key={key}
                  className="py-3 px-4 bg-gray-100 grid grid-cols-[20%_1fr] border-b border-gray-300"
                >
                  <p className="text-[#787878]">{value}</p>
                  <p>
                    <strong className="text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </strong>
                  </p>
                </div>
              ))}
            </div>
          )}

          {displayedTab === "bio" && (
            <div className="text-[#787878] space-y-4">
              <p>{players.biography}</p>
              <p className="my-4">
                Cras mattis consectetur purus sit amet fermentum. Etiam porta
                sem malesuada magna mollis euismod. Cras justo odio, dapibus ac
                facilisis in, egestas eget quam. Cum sociis natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Sed
                posuere consectetur est at lobortis. Sed posuere consectetur est
                at lobortis. Duis mollis, est non commodo luctus, nisi erat
                porttitor ligula, eget lacinia odio sem nec elit.
              </p>
              <p>
                Cum sociis natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus. Etiam porta sem malesuada magna mollis
                euismod. Nulla vitae elit libero, a pharetra augue. Vivamus
                sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
                Aenean eu leo quam. Pellentesque ornare sem lacinia quam
                venenatis vestibulum.
              </p>
            </div>
          )}

          {displayedTab === "gallery" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((img, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    className="w-full h-auto rounded"
                    src={img.src}
                    alt={img.alt}
                  />
                  <p className="mt-2 text-center text-[#787878] font-semibold">
                    {img.alt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/3 space-y-8">
          <div>
            <h3 className="text-xl md:text-2xl text-[#aa4344] font-bold flex items-center">
              Justo Sit Ultricies
            </h3>
            <p className="text-[#787878] my-4">
              Nullam quis risus eget urna mollis ornare vel eu leo. Donec
              ullamcorper nulla non metus auctor fringilla. Donec id elit non mi
              porta gravida at eget metus. Cras mattis consectetur purus sit
              amet fermentum.
            </p>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl text-[#aa4344] font-bold flex items-center">
              Recent Comments
            </h3>
            <div className="mt-3 space-y-4">
              {reviews
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((review, index) => (
                  <p key={index} className="text-[#787878] border-b pb-2">
                    {review.name} on{" "}
                    <Link to={`/shop/${review.productId}`} className="text-[#aa4344] hover:text-[#aa4344]/80 cursor-pointer">
                      {review.productName}
                    </Link>
                  </p>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SinglePlayer;
