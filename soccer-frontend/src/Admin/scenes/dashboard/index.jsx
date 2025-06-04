import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  StatBox,
  LineChart,
  ProgressCircle,
  BarChart,
  GeographyChart,
} from "../../components";
import {
  DownloadOutlined,
  Email,
  PersonAdd,
  PointOfSale,
  Traffic,
  SportsSoccer,
} from "@mui/icons-material";
import Groups2Icon from "@mui/icons-material/Groups2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import api from "../../../api/axios";
import { useEffect } from "react";
import { useState } from "react";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const [totaldata, setTotalData] = useState([]);
  const [orders, setOrders] = useState([]);
  const fetchData = async () => {
    try {
      const response = await api.get("/admin/summary");
      console.log(response.data);
      setTotalData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      const mapped = res.data;
      setOrders(mapped);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOrders();
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        {/* <Header title="DASHBOARD" subtitle="Welcome to your dashboard" /> */}
        {!isXsDevices && (
          <Box>
            {/* <Button
              variant="contained"
              sx={{
                bgcolor: colors.blueAccent[700],
                color: "#fcfcfc",
                fontSize: isMdDevices ? "14px" : "10px",
                fontWeight: "bold",
                p: "10px 20px",
                mt: "18px",
                transition: ".3s ease",
                ":hover": {
                  bgcolor: colors.blueAccent[800],
                },
              }}
              startIcon={<DownloadOutlined />}
            >
              DOWNLOAD REPORTS
            </Button> */}
          </Box>
        )}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Statistic Items */}
        <Box
          gridColumn="span 3"
          bgcolor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalPlayers}
            subtitle="Players"
            progress={(totaldata.totalPlayers % 100) / 100}
            increase={(totaldata.totalPlayers % 100) + "%"}
            icon={
              <SportsSoccer
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalTeams}
            subtitle="Teams"
            progress={(totaldata.totalTeams % 100) / 100}
            increase={(totaldata.totalTeams % 100) + "%"}
            icon={
              <Groups2Icon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalLeagues}
            subtitle="Total Leagues"
            progress={(totaldata.totalLeagues % 100) / 100}
            increase={(totaldata.totalLeagues % 100) + "%"}
            icon={
              <EmojiEventsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalFixtures}
            subtitle="Total Fixtures"
            progress={(totaldata.totalFixtures % 100) / 100}
            increase={(totaldata.totalFixtures % 100) + "%"}
            icon={
              <ScoreboardIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalUsers}
            subtitle="Total Clients"
            progress={(totaldata.totalUsers % 100) / 100}
            increase={(totaldata.totalUsers % 100) + "%"}
            icon={
              <AccountCircleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalProducts}
            subtitle="Total Products"
            progress={(totaldata.totalProducts % 100) / 100}
            increase={(totaldata.totalProducts % 100) + "%"}
            icon={
              <ShoppingCartIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalOrders}
            subtitle="Total Orders"
            progress={(totaldata.totalOrders % 100) / 100}
            increase={(totaldata.totalOrders % 100) + "%"}
            icon={
              <ViewListOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ---------------- Row 2 ---------------- */}

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totaldata.totalRevenue}
            subtitle="Revenue Generated"
            progress={(totaldata.totalRevenue % 100) / 100}
            increase={(totaldata.totalRevenue % 100) + "%"}
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Line Chart */}
        {/* <Box
          gridColumn={
            isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
          }
          gridRow="span 2"
          bgcolor={colors.primary[400]}
        >
          <Box
            mt="25px"
            px="30px"
            display="flex"
            justifyContent="space-between"
          >
          <Box
            mt="25px"
            px="30px"
            display="flex"
            justifyContent="space-between"
          >
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.gray[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ${totaldata.totalRevenue}
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlined
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
              />
            </IconButton>
          </Box>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box> */}

        {/* Transaction Data */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          overflow="auto"
        >
          <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
              Recent Orders
            </Typography>
          </Box>

          {orders.map((order, index) => (
            <Box
              key={`${order._id}-${index}`}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {order._id}
                </Typography>
                <Typography color={colors.gray[100]}>
                  {order.user.name}
                </Typography>
              </Box>
              <Typography color={colors.gray[100]}>{order.date}</Typography>
              <Box
                bgcolor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${order.totalPrice}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Revenue Details */}
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              textAlign="center"
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography textAlign="center">
              Includes extra misc expenditures and costs
            </Typography>
          </Box>
        </Box> */}

        {/* Bar Chart */}
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ p: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="250px"
            mt="-20px"
          >
            <BarChart isDashboard={true} />
          </Box>
        </Box> */}

        {/* Geography Chart */}
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Geography Based Traffic
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="200px"
          >
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
}

export default Dashboard;
