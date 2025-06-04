import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

const UpdateNewsModal = ({ open, onClose, onSubmit, news }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    date: "",
    image: null,
  });

  useEffect(() => {
    if (news) {
      // Normalize tags: if array join, if string use as is
      // let tagsString = "";
      // if (Array.isArray(news.tags)) {
      //   tagsString = news.tags.join(", ");
      // } else if (typeof news.tags === 'string') {
      //   tagsString = news.tags;
      // }

      setFormData({
        title: news.title || "",
        content: news.content || "",
        category: news.category || "",
        tags: news.tags,
        author: news.author || "",
        date: news.date ? new Date(news.date).toISOString().split("T")[0] : "",
        image: null,
      });
    }
  }, [news]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append('tags', formData.tags)
    data.append("author", formData.author);
    data.append("date", formData.date);
    if (formData.image) data.append("image", formData.image);
    onSubmit(news._id || news.id, data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={colors.greenAccent[400]}>Update News Article</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleFormSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <TextField
            name="content"
            label="Content"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.content}
            onChange={handleChange}
            required
          />

          <TextField
            name="category"
            label="Category"
            fullWidth
            variant="outlined"
            value={formData.category}
            onChange={handleChange}
          />

          <TextField
            name="tags"
            label="Tags (comma separated)"
            fullWidth
            variant="outlined"
            value={formData.tags}
            onChange={handleChange}
          />

          <TextField
            name="author"
            label="Author"
            fullWidth
            variant="outlined"
            value={formData.author}
            onChange={handleChange}
          />

          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
          />

          <Button
            variant="outlined"
            component="label"
            sx={{ borderColor: colors.blueAccent[300], color: colors.blueAccent[300] }}
          >
            Upload New Image
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {formData.image && <Typography variant="body2">{formData.image.name}</Typography>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: colors.greenAccent[600], color: "#fff", '&:hover': { backgroundColor: colors.greenAccent[700] } }}
          >
            Update News
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateNewsModal;
