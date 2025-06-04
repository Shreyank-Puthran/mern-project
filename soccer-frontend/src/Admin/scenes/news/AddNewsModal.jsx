import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../../api/axios";

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

const AddNewsModal = ({ open, onClose, refreshNews }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    category: "",
    tags: "",
    author: "",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("image", formData.image);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      data.append("author", formData.author);
      data.append("date", formData.date);

      if (!formData.image) {
        setError("Please upload an image");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      await api.post("/news/add-news", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      refreshNews();
      onClose();
      setFormData({
        title: "",
        content: "",
        image: null,
        category: "",
        tags: "",
        author: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error(
        "News creation failed:",
        err.response?.data?.message || err.message
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
            Add News Article
          </Typography>
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", color: colors.redAccent[400] }}
          />
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <TextField
            name="content"
            label="Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            value={formData.content}
            onChange={handleInputChange}
            required
          />

          <TextField
            name="category"
            label="Category"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.category}
            onChange={handleInputChange}
            required
          />

          <TextField
            name="tags"
            label="Tags (comma separated)"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.tags}
            onChange={handleInputChange}
          />

          <TextField
            name="author"
            label="Author"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.author}
            onChange={handleInputChange}
            required
          />

          {/* <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          /> */}

          <Button
            variant="outlined"
            component="label"
            sx={{
              mt: { xs: 1, sm: 2 },
              mb: { xs: 1, sm: 2 },
              borderColor: colors.blueAccent[300],
              color: colors.blueAccent[300],
            }}
          >
            Upload Image
            <input
              type="file"
              name="image"
              hidden
              accept="image/*"
              onChange={handleInputChange}
              required
            />
          </Button>
              {formData.image && (
                <Typography variant="body2" mt={1}>
                  {formData.image.name}
                </Typography>
              )}
          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: "#fff",
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}
          >
            {loading ? "Adding..." : "Add News"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddNewsModal;
