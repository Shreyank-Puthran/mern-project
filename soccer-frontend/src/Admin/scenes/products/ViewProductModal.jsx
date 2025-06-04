import { Modal, Box, Typography, Grid, Divider, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

const ViewProductModal = ({ open, onClose, product }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={colors.greenAccent[400]}>Product Details</Typography>
          <IconButton onClick={onClose}><CloseIcon sx={{ color: colors.redAccent[400] }} /></IconButton>
        </Box>
        <Box mb={2}>
          <Typography variant="h5" color={colors.gray[100]} mb={1}>{product.name}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Category: {product.category}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Price: ${product.price}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Stock: {product.stock}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Sizes: {product.sizes}</Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>Rating: {product.averageRating} ({product.numReviews} reviews)</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {product.description && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color={colors.greenAccent[300]} mb={1}>Description</Typography>
              <Typography variant="body2" color={colors.gray[300]}>{product.description}</Typography>
            </Grid>
          )}
          {product.imageUrls && product.imageUrls.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color={colors.greenAccent[300]} mb={1}>Images</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {product.imageUrls.map((url, idx) => (
                  <Box key={idx} component="img" src={url} alt={product.name} sx={{ height: 80, borderRadius: 1 }} />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ViewProductModal;