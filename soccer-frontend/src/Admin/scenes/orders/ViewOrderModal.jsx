
import { Modal, Box, Typography, Grid, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const modalStyle = {
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
  width: { xs:"90%", sm:500 }, maxHeight:"90vh", overflowY:"auto",
  bgcolor:"background.paper", borderRadius:2, boxShadow:24, p:{xs:2, sm:4}
};

const ViewOrderModal = ({ open, onClose, order }) => {
  const theme = useTheme(); const colors = tokens(theme.palette.mode);
  if(!order) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={colors.greenAccent[400]}>Order Details</Typography>
          <IconButton onClick={onClose}><CloseIcon sx={{ color: colors.redAccent[400] }} /></IconButton>
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1" color={colors.gray[200]}>Order ID: {order.id}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>User: {order.user}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Status: {order.status}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Payment: {order.payment}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Total: ${order.totalPrice}</Typography>
        </Box>
        <Divider sx={{ mb:2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color={colors.greenAccent[300]} mb={1}>Items</Typography>
            <Typography variant="body2" color={colors.gray[300]}>Count: {order.itemsCount}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color={colors.greenAccent[300]} mb={1}>Shipping Info</Typography>
            <Typography variant="body2" color={colors.gray[300]}
              >Address: {order.shippingInfo?.address || "N/A"}, City: {order.shippingInfo?.city || "N/A"},
              Postal Code: {order.shippingInfo?.postalCode || "N/A"}, Country: {order.shippingInfo?.country || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color={colors.greenAccent[300]} mb={1}>Payment Info</Typography>
            <Typography variant="body2" color={colors.gray[300]}
              >Method: {order.paymentInfo?.method || "N/A"}, Status: {order.paymentInfo?.status || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ViewOrderModal;