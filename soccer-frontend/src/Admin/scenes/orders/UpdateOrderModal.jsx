import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, MenuItem, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const UpdateOrderModal = ({ open, onClose, onSubmit, order }) => {
  const theme = useTheme(); const colors = tokens(theme.palette.mode);
  const [status, setStatus] = useState('Processing');

  useEffect(() => { if(order) setStatus(order.status); },[order]);
  
  const handleSubmit = () => onSubmit(order.id, { status });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Update Order Status
          <IconButton onClick={onClose}><CloseIcon sx={{ color: colors.redAccent[400] }} /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colors.primary[400] }}>
        <Box component="form" display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField select label="Status" value={status} onChange={e => setStatus(e.target.value)}>
            {['Processing','Shipped','Delivered','Cancelled'].map(s=> <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: colors.primary[400], px:3, pb:2 }}>
        {/* <Button onClick={onClose} color="secondary">Cancel</Button> */}
        <Button onClick={handleSubmit} color="secondary" variant="contained">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateOrderModal;