import React, { useState, useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent type
import { useDelivery } from "../../../hooks/useDelivery";
import { Delivery } from "../../../context/deliveryContext";

const DeliveryScreen = () => {
  const { deliveries, addDelivery, updateDelivery, deleteDelivery } =
    useDelivery();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDelivery, setCurrentDelivery] = useState({
    _id: "",
    name: "",
    mobile: "",
    vehicleId: "",
    category: "",
    orderStatus: "",
    nic: "",
    email: "",
    image: "",
    address: "",
    assignedOrders: [] as string[],
  });

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(
      (delivery) =>
        delivery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [deliveries, searchTerm]);

  const handleOpen = () => {
    setIsUpdate(false);
    setCurrentDelivery({
      _id: "",
      name: "",
      mobile: "",
      vehicleId: "",
      category: "",
      orderStatus: "",
      nic: "",
      email: "",
      image: "",
      address: "",
      assignedOrders: [] as string[],
    });
    setOpen(true);
  };

  const handleUpdateOpen = (delivery: Delivery) => {
    setIsUpdate(true);
    setCurrentDelivery({
      _id: delivery._id || "",
      name: delivery.name,
      mobile: delivery.mobile,
      vehicleId: delivery.vehicleId,
      category: delivery.category,
      orderStatus: delivery.orderStatus,
      nic: delivery.nic || "",
      email: delivery.email || "",
      image: delivery.image || "",
      address: delivery.address || "",
      assignedOrders: delivery.assignedOrders || [],
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDelivery({ ...currentDelivery, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentDelivery({ ...currentDelivery, [name]: value });
  };

  const handleSave = async () => {
    const { _id, ...currentDeliveryWithoutId } = currentDelivery;
    if (isUpdate) {
      if (await updateDelivery({ _id, ...currentDeliveryWithoutId })) {
        handleClose();
      } else {
        alert("Failed to update delivery");
      }
    } else {
      if (await addDelivery(currentDeliveryWithoutId)) {
        handleClose();
      } else {
        alert("Failed to add delivery");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ marginTop: 5 }} className="no-print">
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
            backgroundColor: "inherit",
            border: "none",
            boxShadow: "none",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Delivery
          </Button>
          <TextField
            label="Search deliveries"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button variant="contained" color="inherit" onClick={handlePrint}>
            Print Report
          </Button>
        </Paper>
        <TableContainer component={Paper} sx={{ marginBottom: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact No</TableCell>
                <TableCell>Vehicle No</TableCell>
                <TableCell>NIC</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Image</TableCell>
                <TableCell className="no-print">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery._id}>
                  <TableCell>{delivery.name}</TableCell>
                  <TableCell>{delivery.mobile}</TableCell>
                  <TableCell>{delivery.vehicleId}</TableCell>
                  <TableCell>{delivery.nic}</TableCell>
                  <TableCell>{delivery.email}</TableCell>
                  <TableCell>{delivery.category}</TableCell>
                  <TableCell>{delivery.orderStatus}</TableCell>
                  <TableCell>{delivery.address}</TableCell>
                  <TableCell>
                    <img
                      src={`/drivers/${delivery.image}`}
                      // alt={delivery.name}
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  </TableCell>
                  <TableCell
                    className="no-print"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateOpen(delivery)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "red" }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this delivery?"
                          )
                        ) {
                          deleteDelivery(delivery._id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <div className="print-only">
        <Typography variant="h5" gutterBottom>
          Delivery Report
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact No</TableCell>
              <TableCell>Vehicle No</TableCell>
              <TableCell>NIC</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery._id}>
                <TableCell>{delivery.name}</TableCell>
                <TableCell>{delivery.mobile}</TableCell>
                <TableCell>{delivery.vehicleId}</TableCell>
                <TableCell>{delivery.nic}</TableCell>
                <TableCell>{delivery.email}</TableCell>
                <TableCell>{delivery.category}</TableCell>
                <TableCell>{delivery.orderStatus}</TableCell>
                <TableCell>{delivery.address}</TableCell>
                <TableCell>
                  <img
                    src={`/drivers/${delivery.image}`}
                    // alt={delivery.name}
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>{isUpdate ? "Update Delivery" : "Add Delivery"}</h2>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={currentDelivery.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact No"
              name="mobile"
              value={currentDelivery.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Vehicle No"
              name="vehicleId"
              value={currentDelivery.vehicleId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="NIC"
              name="nic"
              value={currentDelivery.nic}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={currentDelivery.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={currentDelivery.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={currentDelivery.category}
                onChange={handleSelectChange} // Use the new handleSelectChange
              >
                <MenuItem value="truck">truck</MenuItem>
                <MenuItem value="Car">car</MenuItem>
                <MenuItem value="bike">bike</MenuItem>
                {/* Add more categories as needed */}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="order-status-label">Order Status</InputLabel>
              <Select
                labelId="order-status-label"
                name="orderStatus"
                value={currentDelivery.orderStatus}
                onChange={handleSelectChange} // Use the new handleSelectChange
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Transit">In Transit</MenuItem>
                {/* Add more statuses as needed */}
              </Select>
            </FormControl>
            <TextField
              label="Image URL"
              name="image"
              value={currentDelivery.image}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DeliveryScreen;
