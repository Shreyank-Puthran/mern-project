import api from "../../../api/axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { IoPricetagSharp } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import { TfiYoutube } from "react-icons/tfi";
import DotSpinner from "../../components/loading.jsx";
import quote from "../../assets/quote-small.png";

const NewsArticle = () => {
  const [reviews, setReviews] = useState([]);
  const [news, setNews] = useState(null);
  const [fullNews, setFullNews] = useState([]);

  const { id } = useParams();
  const uniqueCategories = [...new Set(fullNews.map((n) => n.category))];

  const fetchNews = async () => {
    try {
      const raw = await api.get("/news");
      const response = await api.get(`/news/get-news/${id}`);
      const newsData = response.data;
      const rawData = raw.data;
      setNews(newsData);
      setFullNews(rawData);
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
    fetchNews();
    fetchReviews();
  }, [id]);

  if (!news || !reviews) {
    return <DotSpinner className="mx-auto mt-20" />;
  }

  return (
    <>
      <section className="py-12 px-15 md:px-20 bg-white flex flex-col md:flex-row gap-8">
        {/* Left Section */}
        <div className="w-full md:w-2/3">
          <div>
            <img
              className="w-full h-auto md:h-[400px] object-cover object-center"
              src={news.imageUrl}
            />
          </div>
          <h3 className="text-2xl my-6 text-[#393939] font-semibold md:text-4xl">
            {news.title}
          </h3>
          <div className="text-sm capitalize py-2 text-[#787878] border-[#787878] border-t-1 border-b-1 flex flex-wrap items-center gap-x-2 mb-2">
            <FaRegCalendarAlt />
            {new Date(news.date).toLocaleDateString()}
            <IoPricetagSharp />
            {news.tags.join(", ")}
            <FaUserAlt />
            {news.author}
          </div>
          <div className="text-[#787878] space-y-4">
            <p>{news.content}</p>
            <p className="my-4">
              Cras mattis consectetur purus sit amet fermentum. Etiam porta sem
              malesuada magna mollis euismod. Cras justo odio, dapibus ac
              facilisis in, egestas eget quam. Cum sociis natoque penatibus et
              magnis dis parturient montes, nascetur ridiculus mus. Sed posuere
              consectetur est at lobortis. Sed posuere consectetur est at
              lobortis. Duis mollis, est non commodo luctus, nisi erat porttitor
              ligula, eget lacinia odio sem nec elit.
            </p>
            <p>
              Cum sociis natoque penatibus et magnis dis parturient montes,
              nascetur ridiculus mus. Etiam porta sem malesuada magna mollis
              euismod. Nulla vitae elit libero, a pharetra augue. Vivamus
              sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
              Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis
              vestibulum.
            </p>
          </div>
          <blockquote className="flex items-start my-4 px-5 py-2 border-t-1 border-b-1 border-[#787878] text-2xl font-semibold text-[#787878]">
            <img src={quote} className="mr-4" />
            Cum sociis natoque penatus etaed pnis dis parturient montes, scettr
            aieo ridus mus. Etiam portaem mleyo.
          </blockquote>
          <div className="text-[#787878] space-y-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisici elit, sed
              eiusmod tempor incidunt ut labore et dolore magna aliqua. Idque
              Caesaris facere voluntate liceret: sese habere. Magna pars
              studiorum, prodita quaerimus. Magna pars studiorum, prodita
              quaerimus. Fabio vel iudice vincam, sunt in culpa qui officia.
              Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
            </p>
            <p className="my-4">
              Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae. Non
              equidem invideo, miror magis posuere velit aliquet. Qui ipsorum
              lingua Celtae, nostra Galli appellantur. Prima luce, cum quibus
              mons aliud consensu ab eo. Petierunt uti sibi concilium totius
              Galliae in diem certam indicere.
            </p>
          </div>
          <div className="bg-gray-100 py-6 px-15 md:px-20 flex flex-col md:flex-row items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-semibold text-[#787878]">
                Share Post :
              </span>
            </div>
            <div className="flex space-x-3 text-2xl text-[#787878]">
              <FaFacebookF className="cursor-pointer hover:text-[#393939]" />
              <FaTwitter className="cursor-pointer hover:text-[#393939]" />
              <ImInstagram className="cursor-pointer hover:text-[#393939]" />
              <TfiYoutube className="cursor-pointer hover:text-[#393939]" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/3 space-y-8">
          <div>
            <h3 className="text-xl md:text-2xl text-[#aa4344] font-bold flex items-center">
              <span className="text-gray-500 mr-2">||</span>Donec id elit
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
              <span className="text-gray-500 mr-2">||</span>Recent Comments
            </h3>
            <div className="mt-3 space-y-4">
              {reviews
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((review, index) => (
                  <p key={index} className="text-[#787878] border-b pb-2">
                    {review.name} on{" "}
                    <a href="#" className="text-[#aa4344]">
                      {review.productName}
                    </a>
                  </p>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl text-[#aa4344] font-bold flex items-center">
              <span className="text-gray-500 mr-2">||</span>News Categories
            </h3>
            <div className="mt-3 space-y-4">
              {uniqueCategories.map((category, index) => (
                <Link to={`/articles/category/${encodeURIComponent(category)}`}>
                  <p
                    key={index}
                    className="text-[#787878] hover:text-[#aa4344] border-b py-2"
                  >
                    {category}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsArticle;
