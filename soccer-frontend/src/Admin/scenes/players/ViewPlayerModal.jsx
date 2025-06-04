import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ViewPlayerModal = ({ open, handleClose, player }) => {
  if (!player) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
        {player.name}
        <IconButton
          onClick={handleClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#f44336", // or your `colors.redAccent[400]`
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Avatar
              src={player.imageUrl || undefined}
              alt={player.name}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <Typography variant="h6" mt={1}>
              {player.position}
            </Typography>
            <Typography variant="body2" mt={1}>
              {player.biography}
            </Typography>
            <Typography variant="subtitle2" mt={1}>
              Team: {player.team?.name || "N/A"}
            </Typography>
          </Grid>
          {player.stats &&
            Object.entries(player.stats).map(([key, val]) => {
              const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase());

              return (
                <Grid item xs={4} key={key}>
                  <Typography mt={1}>
                    <strong>{label}</strong>: {val}
                  </Typography>
                </Grid>
              );
            })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPlayerModal;
