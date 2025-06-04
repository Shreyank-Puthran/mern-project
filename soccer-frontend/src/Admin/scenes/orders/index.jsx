import { useState, useEffect } from "react";
import { Box, Button, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon, Edit } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Header } from "../../components";
import { tokens } from "../../theme";
import api from "../../../api/axios";
import AddOrderModal from "./AddOrderModal";
import UpdateOrderModal from "./UpdateOrderModal";
import ViewOrderModal from "./ViewOrderModal";

const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orders, setOrders] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      const mapped = res.data.map((o) => ({
        id: o._id,
        user: o.user.name,
        itemsCount: o.orderItems.length,
        totalPrice: o.totalPrice,
        status: o.orderStatus,
        payment: o.paymentInfo.status,
        date: new Date(o.createdAt).toLocaleDateString(),
        shippingInfo: o.shippingInfo,
        paymentInfo: o.paymentInfo,
      }));
      setOrders(mapped);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAdd = () => setOpenAdd(true);
  const handleView = async (row) => {
    try {
      // Fetch full order details from backend
      const res = await api.get(`/orders/get-order/${row.id}`);
      const o = res.data;
      // Map to view model
      setSelectedOrder({
        id: o._id,
        user: o.user.name,
        itemsCount: o.orderItems.length,
        totalPrice: o.totalPrice,
        status: o.orderStatus,
        payment: o.paymentInfo.status,
        date: new Date(o.createdAt).toLocaleDateString(),
        shippingInfo: o.shippingInfo,
        paymentInfo: o.paymentInfo,
        orderItems: o.orderItems,
      });
      setOpenView(true);
    } catch (err) {
      console.error("Error fetching order details", err);
    }
  };
  const handleEdit = (row) => { setSelectedOrder(row); setOpenUpdate(true); };

  const handleAddSubmit = async (data) => {
    try {
      await api.post("/orders/create-order", data);
      fetchOrders();
      setOpenAdd(false);
    } catch (err) {
      console.error("Error creating order", err);
    }
  };

  const handleUpdateSubmit = async (id, payload) => {
    try {
      await api.patch(`/orders/update-order/${id}/status`, payload);
      fetchOrders();
      setOpenUpdate(false);
    } catch (err) {
      console.error("Error updating order status", err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "user", headerName: "User", flex: 1 },
    { field: "itemsCount", headerName: "Items", flex: 0.5 },
    { field: "totalPrice", headerName: "Total", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "payment", headerName: "Payment", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="View Order">
            <IconButton onClick={() => handleView(row)} color="primary">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Status">
            <IconButton onClick={() => handleEdit(row)} color="info">
              <Edit />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Orders" subtitle="Manage Orders" />
      <Button variant="contained" color="success" sx={{ mb: 2 }} startIcon={<AddIcon />} onClick={handleAdd}>
        Add Order
      </Button>
      <AddOrderModal open={openAdd} onClose={() => setOpenAdd(false)} onSubmit={handleAddSubmit} />
      <UpdateOrderModal open={openUpdate} onClose={() => setOpenUpdate(false)} onSubmit={handleUpdateSubmit} order={selectedOrder} />
      <ViewOrderModal open={openView} onClose={() => setOpenView(false)} order={selectedOrder} />
      <Box mt="40px" height="75vh" sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { border: "none" },
        "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
        "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
        "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
      }}>
        <DataGrid rows={orders} columns={columns} pageSizeOptions={[10,25,50]} initialState={{ pagination: { paginationModel: { pageSize: 10 }}}} checkboxSelection />
      </Box>
    </Box>
  );
};

export default Orders;