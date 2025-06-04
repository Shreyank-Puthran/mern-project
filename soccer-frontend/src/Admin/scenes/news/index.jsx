import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Avatar,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  DeleteOutline,
  Visibility,
  Edit,
  Add as AddIcon,
  Category,
} from "@mui/icons-material";
import api from "../../../api/axios";
import AddNewsModal from "./AddNewsModal";
import UpdateNewsModal from "./UpdateNewsModal";

const News = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [news, setNews] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  // Fetch news for the table
  const fetchNews = async () => {
    try {
      const response = await api.get("/admin/summary");
      console.log(response.data);
      const formattedNews = response.data.news.map((news, index) => ({
        id: news._id || index,
        title: news.title,
        content: news.content,
        image: news.imageUrl,
        author: news.author,
        category: news.category,
        tags: news.tags.join(", "),
        date: new Date(news.date).toLocaleDateString(),
      }));
      setNews(formattedNews);
      console.log(news)
    } catch (error) {
      console.log(error.message, "Failed to load news");
    }
  };

  const handleEditNews = (news) => {
    setSelectedNews(news);
    setOpenUpdateModal(true);
  };

  const handleDeleteNews = async (news) => {
    if (confirm(`Delete news ${news.title}?`)) {
      try {
        await api.delete(`/news/delete-news/${news.id}`);
        fetchNews();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle add news form submit from AddNewsModal
  const handleAddNews = async (formData) => {
    try {
      const res = await api.post("/news/add-news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Refresh news list after adding
      fetchNews();
      setOpenAddModal(false);
    } catch (error) {
      console.error("Error adding news:", error);
    }
  };

  const handleUpdateNews = async (newsId, formData) => {
    try {
      await api.patch(`/news/update-news/${newsId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchNews(); // Refresh the table
      setOpenUpdateModal(false);
    } catch (error) {
      console.error("Error updating news:", error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "content",
      headerName: "Content",
      flex: 1,
    },
    {
      field: "author",
      headerName: "Author",
      flex: 0.7,
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
    },
    {
      field: "image",
      headerName: "Image",
      width: 90,
      sortable: false,
      renderCell: ({ value }) => (
        <Avatar src={value} alt="News Image" sx={{ width: 40, height: 40 }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 80,
      flex: 0,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          {/* <Tooltip title="View Player">
            <IconButton onClick={() => handleViewPlayer(row)} color="primary">
              <Visibility />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Edit News">
            <IconButton onClick={() => handleEditNews(row)} color="info">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete News">
            <IconButton onClick={() => handleDeleteNews(row)} color="error">
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="News" subtitle="List of News Articles" />
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
      >
        Add New News
      </Button>

      <AddNewsModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddNews}
        refreshNews={fetchNews}
      />

      <UpdateNewsModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onSubmit={handleUpdateNews}
        news={selectedNews}
      />

      <Box
        mt="40px"
        height="75vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-root": { border: "none", minWidth: 900 },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={news}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default News;
