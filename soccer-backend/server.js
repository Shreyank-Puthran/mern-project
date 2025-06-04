import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./database/connect.js";
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import leagueRoutes from "./routes/leagueRoutes.js";
import fixtureRoutes from "./routes/fixtureRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
// Test
import testEmailRoutes from "./routes/testEmailRoutes.js";

dotenv.config();

const app = express();

// Middleware
// const corsOptions = {
//   origin: process.env.APP_URL_CLIENT,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// };

const allowedOrigins = [
  "http://localhost:5173",
  "https://soccer-frontend-znyk.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like mobile apps or curl requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Vite frontend default
//     credentials: true,
//   })
// );
app.use(express.json());

// MongoDB Connection
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/league", leagueRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orders", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

// Test
app.use("/api", testEmailRoutes);
// Test

app.get("/", (req, res) => {
  res.send("Soccer Backend running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:3000/`);
});
