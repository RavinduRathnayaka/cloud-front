import { useState, useMemo, useEffect } from "react";
import axios from "axios";
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
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSupplier } from "../../../hooks/useSupplier";
import { SelectChangeEvent } from "@mui/material";

// Define an interface for the supplier
interface Supplier {
  _id: string;
  name: string;
  address: string;
  mobile: string;
  itemId: string;
  email: string;
  company: string;
}

// Define an interface for the item
interface Item {
  _id: string;
  name: string;
}

const SupplierScreen = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplier();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSupplier, setCurrentSupplier] = useState<Supplier>({
    _id: "",
    name: "",
    address: "",
    mobile: "",
    itemId: "",
    email: "",
    company: "",
  });
  const [items, setItems] = useState<Item[]>([]); // State to hold items

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get<Item[]>("https://cloud-back-7qc4.onrender.com/api/auth/items"); // Update with your API endpoint
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, []);

  // Filter suppliers based on search term
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleOpen = () => {
    setIsUpdate(false);
    setCurrentSupplier({
      _id: "",
      name: "",
      address: "",
      mobile: "",
      itemId: "",
      email: "",
      company: "",
    });
    setOpen(true);
  };

  const handleUpdateOpen = (supplier: Supplier) => {
    setIsUpdate(true);
    setCurrentSupplier(supplier);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Update handleChange function to support Select component
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setCurrentSupplier({ ...currentSupplier, [name as string]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setCurrentSupplier({ ...currentSupplier, [name as string]: value });
  };

  const handleSave = async () => {
    if (isUpdate) {
      await updateSupplier(currentSupplier).then((success) => {
        if (success) {
          alert("Supplier updated successfully");
          handleClose();
        } else {
          alert("Failed to update supplier");
        }
      });
    } else {
      await addSupplier(currentSupplier).then((success) => {
        if (success) {
          alert("Supplier added successfully");
          handleClose();
        } else {
          alert("Failed to add supplier");
        }
      });
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
            Add Supplier
          </Button>
          <TextField
            label="Search suppliers"
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
                <TableCell>Address</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell className="no-print">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>{supplier.mobile}</TableCell>
                  <TableCell>{supplier.itemId}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.company}</TableCell>
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
                      onClick={() => handleUpdateOpen(supplier)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "red" }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this supplier?"
                          )
                        ) {
                          deleteSupplier(supplier._id);
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

      {/* Printable table */}
      <div className="print-only">
        <Typography variant="h5" gutterBottom>
          Supplier Report
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Item ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier._id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>{supplier.mobile}</TableCell>
                <TableCell>{supplier.itemId}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.company}</TableCell>
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
          <h2>{isUpdate ? "Update Supplier" : "Add Supplier"}</h2>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={currentSupplier.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={currentSupplier.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={currentSupplier.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Item ID</InputLabel>
              <Select
                name="itemId"
                value={currentSupplier.itemId}
                onChange={handleSelectChange} 
                fullWidth
              >
                {items.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Email"
              name="email"
              value={currentSupplier.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Company"
              name="company"
              value={currentSupplier.company}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginTop: 3 }}
          >
            {isUpdate ? "Update Supplier" : "Save Supplier"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SupplierScreen;