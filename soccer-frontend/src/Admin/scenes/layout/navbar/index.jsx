import {
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useContext, useState } from "react";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../AdminApp";
import { useNavigate } from "react-router-dom";
import { eventTupleToStore } from "@fullcalendar/core/internal";
import { Header } from "../../../components";
const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const handleMenuOpen = ({ currentTarget }) => {
    setAnchor(currentTarget);
  };

  const handleMenuClose = () => {
    setAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
        <Box
          display="flex"
          alignItems="center"
          bgcolor={colors.primary[400]}
          borderRadius="3px"
          sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
        >
          {/* <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton> */}
          <Typography
            variant="h2"
            color={colors.gray[100]}
            // sx={{fontWeight: "bold", bgcolor: "#141b2d" }}
            sx={
              theme.palette.mode === "dark"
                ? { fontWeight: "bold", bgcolor: "#141b2d" }
                : { fontWeight: "bold", bgcolor: "#f2f0f0" }
            }
          >
            {/* bgcolor: "#141b2d" */}
            Dashboard
          </Typography>
        </Box>
      </Box>

      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton> */}
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlined />
        </IconButton>

        <Menu
          anchor={anchor}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {/* <MenuItem onClick={navigate('/')}>Home</MenuItem> */}
          <MenuItem onClick={handleHome}>Home</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
