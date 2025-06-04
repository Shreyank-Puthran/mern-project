import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import api from "../../../api/axios";

const modalStyle = {
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 }, maxHeight: "90vh", overflowY: "auto",
  bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: { xs:2, sm:4 }
};

const AddOrderModal = ({ open, onClose, onSubmit }) => {
  const theme = useTheme(); const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ user: "", orderItems: [], shippingInfo: { address: "", city: "", postalCode: "", country: "" }, paymentInfo: { method: "Cash on Delivery" } });

  useEffect(() => {
    const loadData = async () => {
      const [uRes, pRes] = await Promise.all([api.get("/users"), api.get("/products")]);
      setUsers(uRes.data); setProducts(pRes.data);
    };
    if (open) loadData();
  }, [open]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleShippingChange = (e) => setFormData(prev => ({ ...prev, shippingInfo: { ...prev.shippingInfo, [e.target.name]: e.target.value }}));

  const addItem = () => setFormData(prev => ({ ...prev, orderItems: [...prev.orderItems, { product: "", quantity: 1 }]}));
  const updateItem = (idx, key, val) => {
    const items = [...formData.orderItems]; items[idx][key] = val; setFormData(prev => ({ ...prev, orderItems: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={colors.greenAccent[400]}>Add New Order</Typography>
          <IconButton onClick={onClose}><CloseIcon sx={{ color: colors.redAccent[400] }} /></IconButton>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField select fullWidth name="user" label="User" value={formData.user} onChange={handleChange} margin="normal" required>
            {users.map(u => <MenuItem key={u._id} value={u._id}>{u.name} ({u.email})</MenuItem>)}
          </TextField>
          <Typography variant="subtitle1" color={colors.gray[100]} mt={2}>Order Items</Typography>
          {formData.orderItems.map((item, i) => (
            <Box key={i} display="flex" gap={1} mt={1}>
              <TextField select sx={{ flex:1 }} label="Product" value={item.product} onChange={e => updateItem(i, 'product', e.target.value)} required>
                {products.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
              </TextField>
              <TextField type="number" label="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} InputProps={{ inputProps: { min:1 } }} required sx={{ width:80 }} />
            </Box>
          ))}
          <Button onClick={addItem} sx={{ mt:2 }}>Add Item</Button>

          <Typography variant="subtitle1" color={colors.gray[100]} mt={2}>Shipping Info</Typography>
          {['address','city','postalCode','country'].map(field => (
            <TextField key={field} fullWidth name={field} label={field.charAt(0).toUpperCase()+field.slice(1)} value={formData.shippingInfo[field]} onChange={handleShippingChange} margin="normal" required />
          ))}

          <TextField select fullWidth name="method" label="Payment Method" value={formData.paymentInfo.method} onChange={e => setFormData(prev => ({ ...prev, paymentInfo:{ method: e.target.value } }))} margin="normal">
            {['Cash on Delivery','Stripe'].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          <Button type="submit" fullWidth variant="contained" sx={{ mt:2, backgroundColor: colors.greenAccent[600], color:'#fff', '&:hover': { backgroundColor: colors.greenAccent[700] } }}>Add Order</Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddOrderModal;