import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Outlet } from "react-router-dom";
import AdminApp from "./Admin/AdminApp";
import Dashboard from "./Admin/scenes/dashboard";
import Teams from "./Admin/scenes/teams";
import Users from "./Admin/scenes/users";
import Login from "./Admin/scenes/login";
import Leagues from "./Admin/scenes/leagues";
import AdminRoute from "./Admin/AdminRoute";
import Players from "./Admin/scenes/players";
import Fixtures from "./Admin/scenes/fixtures";
import Products from "./Admin/scenes/products";
import Orders from "./Admin/scenes/orders";
import News from "./Admin/scenes/news";
// import App from "./Main/App"
import Header from "./Main/components/header";
import Footer from "./Main/components/footer";
import Home from "./Main/scenes/homePage/homePage";
import Register from "./Main/scenes/register/register";
import LeagueTable from "./Main/scenes/leaguePage/leagueTable";
import TeamPlayer from "./Main/scenes/teamPage/teamPage";
import SinglePlayer from "./Main/scenes/playerPage/playerPage";
import FixtureTable from "./Main/scenes/FixturePage/fixturePage";
import NotFound from "./Main/scenes/404/404page";
import Articles from "./Main/scenes/newsPage/newsPage";
import NewsArticle from "./Main/scenes/newsPage/singleNews";
import ScrollToTop from "./Main/components/scrollToTop";
import Shop from "./Main/scenes/shopPage/shopPage";
import SingleProduct from "./Main/scenes/shopPage/singleProduct";
import CartPage from "./Main/scenes/CartPage/CartPage";
import CheckoutPage from "./Main/scenes/CheckoutPage/checkout";
import PaymentPage from "./Main/scenes/PaymentPage/paymentPage";
import OrderStatusPage from "./Main/scenes/PaymentPage/orderStatusPage";
import Profile from "./Main/scenes/UserProfile/userProfile";

const PublicLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

const AppRouter = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/league-page" element={<LeagueTable />} />
          <Route path="/team-page" element={<TeamPlayer />} />
          <Route path="/fixture-page" element={<FixtureTable />} />
          <Route path="/players/:playerId" element={<SinglePlayer />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/category/:category" element={<Articles />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order/:id" element={<OrderStatusPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={<AdminApp />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/players" element={<Players />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/news" element={<News />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
