/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  SportsSoccer,
  DashboardOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import Groups2Icon from "@mui/icons-material/Groups2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import logo from "../../../assets/images/logo.png";
import Item from "./Item";

import { ToggledContext } from "../../../AdminApp";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  Admin
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          {/* <Avatar
            alt="avatar"
            src={avatar}
            sx={{ width: "100px", height: "100px" }}
          /> */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              {user.name}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/dashboard"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Data" : " "}
        </Typography>{" "}
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Manage Users"
            path="/users"
            colors={colors}
            icon={<AccountCircleIcon />}
          />
          <Item
            title="Manage Players"
            path="/players"
            colors={colors}
            icon={<SportsSoccer />}
          />
          <Item
            title="Manage Teams"
            path="/teams"
            colors={colors}
            icon={<Groups2Icon />}
          />
          <Item
            title="Manage Leagues"
            path="/leagues"
            colors={colors}
            icon={<EmojiEventsIcon />}
          />
          <Item
            title="Manage Fixtures"
            path="/fixtures"
            colors={colors}
            icon={<ScoreboardIcon />}
          />
          <Item
            title="Manage News"
            path="/news"
            colors={colors}
            icon={<NewspaperIcon />}
          />
          <Item
            title="Manage Products"
            path="/products"
            colors={colors}
            icon={<ShoppingCartIcon />}
          />
          <Item
            title="Manage Orders"
            path="/orders"
            colors={colors}
            icon={<ViewListOutlinedIcon />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
