import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const modalStyleDialog = { bgcolor: "background.paper" };

const UpdateProductModal = ({ open, onClose, onSubmit, product }) => {
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

  // useEffect(() => {
  //   if (product) {
  //     setFormData({
  //       name: product.name || "",
  //       description: product.description || "",
  //       price: product.price || "",
  //       category: product.category || "",
  //       stock: product.stock || "",
  //       sizes: product.sizes || [],
  //       images: [],
  //     });
  //   }
  // }, [product]);

  useEffect(() => {
    if (product) {
      // Normalize sizes into a real array
      let sizesArr = [];
      if (typeof product.sizes === "string") {
        sizesArr = product.sizes
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s); // remove any empty strings
      } else {
        sizesArr = product.sizes || [];
      }

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
        sizes: sizesArr,
        images: [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e) => {
    console.log(formData.sizes);
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
    const { name, description, price, category, stock } = formData;
    if (!name || !description || !price || !category || !stock) {
      setError("All fields except images are required.");
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
      Array.from(formData.images).forEach((file) =>
        data.append("images", file)
      );

      await onSubmit(product.id, data);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error updating product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Update Product
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", color: colors.redAccent[400] }}
          />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colors.primary[400] }}>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          mt={1}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={formData.price}
            onChange={handleChange}
            required
          />
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel id="sizes-label">Sizes</InputLabel>
            <Select
              labelId="sizes-label"
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

          <Button variant="contained" component="label">
            Change Images
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
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

          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: colors.primary[400], px: 3, pb: 2 }}>
        {/* <Button onClick={onClose} disabled={loading} color="secondary">
          Cancel
        </Button> */}
        <Button onClick={handleSubmit} variant="contained" disabled={loading} color="secondary">
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProductModal;
