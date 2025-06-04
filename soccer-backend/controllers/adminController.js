// controllers/adminController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Player from "../models/playerModel.js";
import Team from "../models/teamModel.js";
import League from "../models/leagueModel.js";
import Fixture from "../models/fixtureModel.js";
import News from "../models/newsModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

// Starts all 8 queries at the same time instead of runnning them one by one
export const getAdminSummary = asyncHandler(async (req, res) => {
  const [
    users,
    players,
    teams,
    leagues,
    fixtures,
    news,
    products,
    orders,
  ] = await Promise.all([
    User.find().select("-password"), // exclude passwords
    Player.find().populate("team", "name"),
    Team.find().populate("league", "name").populate("players.playerId", "name"),
    League.find(),
    Fixture.find(),
    News.find(),
    Product.find(),
    Order.find(),
  ]);

  const totalRevenue = orders
    .filter((order) => order.paymentInfo.status === "Paid")
    .reduce((acc, order) => acc + order.totalPrice, 0);

  res.json({
    totalUsers: users.length,
    totalPlayers: players.length,
    totalTeams: teams.length,
    totalLeagues: leagues.length,
    totalFixtures: fixtures.length,
    totalNews: news.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,

    // full data for frontend
    users,
    players,
    teams,
    leagues,
    fixtures,
    news,
    products,
    orders,
  });
});
