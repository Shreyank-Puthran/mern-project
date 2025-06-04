import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

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

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

const AddProductModal = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sizes: [],
    images: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e) => {
    const {
      target: { value },
    } = e;
    setFormData((prev) => ({
      ...prev,
      sizes: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, description, price, category, stock, images } = formData;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !stock ||
      images.length === 0
    ) {
      setError("All fields including at least one image are required.");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("price", price);
      data.append("category", category);
      data.append("stock", stock);
      formData.sizes.forEach((size) => data.append("sizes", size));
      Array.from(images).forEach((file) => data.append("images", file));

      await onSubmit(data);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        sizes: [],
        images: [],
      });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error adding product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" color={colors.greenAccent[400]}>
            Add New Product
          </Typography>
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", color: colors.redAccent[400] }}
          />
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            name="price"
            label="Price"
            type="number"
            InputProps={{ inputProps: { min: 0, step: 0.01,} }}
            value={formData.price}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="stock"
            label="Stock"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={formData.stock}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="add-sizes-label">Sizes</InputLabel>
            <Select
              labelId="add-sizes-label"
              multiple
              label="Sizes"
              value={formData.sizes}
              onChange={handleSizesChange}
              input={<OutlinedInput label="Sizes" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {sizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  <Checkbox checked={formData.sizes.includes(size)} />
                  <ListItemText primary={size} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Images
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              name="images"
              onChange={handleFileChange}
            />
          </Button>
          {formData.images.length > 0 && (
            <Box mt={1}>
              {Array.from(formData.images).map((file, index) => (
                <Typography key={index} variant="body2">
                  {file.name}
                </Typography>
              ))}
            </Box>
          )}
          {error && (
            <Typography color="error" variant="body2" mt={2}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.greenAccent[600],
              color: "#fff",
              "&:hover": { backgroundColor: colors.greenAccent[700] },
            }}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
