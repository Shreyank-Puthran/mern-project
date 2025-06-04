import { useState, useEffect } from "react";
import { Box, Button, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon, Edit, DeleteOutline } from "@mui/icons-material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import api from "../../../api/axios";
import AddProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";
import ViewProductModal from "./ViewProductModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const formatted = res.data.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description || "",
        category: p.category,
        price: p.price,
        stock: p.stock,
        sizes: p.sizes.join(", "),
        averageRating: p.averageRating,
        numReviews: p.numReviews,
      }));
      setProducts(formatted);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (formData) => {
    try {
      // await api.post("/products/create-product", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      await api.post("/products/create-product", formData);
      fetchProducts();
      setOpenAddModal(false);
    } catch (err) {
      console.error(
        "Error adding product",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setOpenViewModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenUpdateModal(true);
  };

  // const handleEditProduct = async (row) => {
  //   try {
  //     // fetch the full product (sizes will be an array)
  //     const res = await api.get(`/products/get-product/${row.id}`);
  //     setSelectedProduct(res.data);
  //     setOpenUpdateModal(true);
  //   } catch (err) {
  //     console.error("Error fetching product details", err);
  //   }
  // };

  const handleUpdateProduct = async (productId, formData) => {
    try {
      await api.patch(`/products/update-product/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchProducts();
      setOpenUpdateModal(false);
    } catch (err) {
      console.error(
        "Error updating product",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleDeleteProduct = async (product) => {
    if (confirm(`Delete product ${product.name}?`)) {
      try {
        await api.delete(`/products/delete-product/${product.id}`);
        fetchProducts();
      } catch (err) {
        console.error(
          "Error deleting product",
          err.response?.data?.message || err.message
        );
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "stock", headerName: "Stock", flex: 1 },
    { field: "sizes", headerName: "Sizes", flex: 1 },
    { field: "averageRating", headerName: "Rating", flex: 1 },
    { field: "numReviews", headerName: "Reviews", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="View Product">
            <IconButton onClick={() => handleViewProduct(row)} color="primary">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Product">
            <IconButton onClick={() => handleEditProduct(row)} color="info">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton onClick={() => handleDeleteProduct(row)} color="error">
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Products" subtitle="List of Products" />
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
      >
        Add New Product
      </Button>

      <AddProductModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddProduct}
      />

      <UpdateProductModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onSubmit={handleUpdateProduct}
        product={selectedProduct}
      />

      <ViewProductModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        product={selectedProduct}
      />

      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
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
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Products;
