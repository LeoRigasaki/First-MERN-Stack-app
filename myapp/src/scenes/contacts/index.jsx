import React, { useState, useEffect } from 'react';
import { Box, useTheme, Button, IconButton, Dialog, DialogTitle } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contacts, setContacts] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [newContact, setNewContact] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Contacts Component useEffect
useEffect(() => {
  const userID = localStorage.getItem('userID');
  const fetchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/contacts?userID=${userID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  fetchContacts();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userID = localStorage.getItem('userID');
    const contactData = { ...newContact, userID };

    try {
      const response = await fetch('http://localhost:8000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error('Failed to post new contact.');
      }

      const addedContact = await response.json();
      setContacts(prev => [...prev, {...newContact,_id:addedContact.contactID}]);
      setNewContact({
        name: '',
        age: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        zipCode: ''
      });
      handleDialogClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowEditStart = (event, rowData) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (event, rowData) => {
    event.defaultMuiPrevented = true;
  };

  const processRowUpdate = async (updatedRow, originalRow) => {
    try {
      const response = await fetch(`http://localhost:8000/api/contacts/${updatedRow._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRow),
      });
  
      if (!response.ok) {
        throw new Error('Server error when updating row');
      }
  
      const data = await response.json();
      if (!data.updatedData._id) {
        return { ...updatedRow, id: originalRow._id }; // Use originalRow's _id if not present in response
      }
  
      return { ...data.updatedData, id: data.updatedData._id }; // Ensure id is included
    } catch (error) {
      console.error('Failed to update row:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    color: '#333333',
    backgroundColor: '#f8f8f8',
  };
  const handleProcessRowUpdateError = (error) => {
    console.error('An error occurred while updating the row:', error);
  };

  const dialogStyles = {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    color: '#333333',
    margin: 'auto'
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, editable: true },
    { field: "age", headerName: "Age", type: "number", flex: 1, editable: true },
    { field: "phone", headerName: "Phone Number", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "address", headerName: "Address", flex: 1, editable: true },
    { field: "city", headerName: "City", flex: 1, editable: true },
    { field: "zipCode", headerName: "Zip Code", flex: 1, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.id]?.mode === 'edit';
        if (isInEditMode) {
          return (
            <>
              <IconButton
                onClick={() => {
                  setRowModesModel({ ...rowModesModel, [params.id]: { mode: 'view' } });
                }}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  const newModel = { ...rowModesModel };
                  delete newModel[params.id];
                  setRowModesModel(newModel);
                }}
                color="secondary"
              >
                <CancelIcon />
              </IconButton>
            </>
          );
        }
        return (
          <>
            <IconButton
              onClick={() => {
                setRowModesModel({ ...rowModesModel, [params.id]: { mode: 'edit' } });
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="CONTACTS" subtitle="List of Contacts for Future Reference" />
      <button
        onClick={handleDialogOpen}
        style={{
          marginBottom: '20px',
          backgroundColor: '#1976d2', // Primary color
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Add New Contact
      </button>
      <Dialog open={openDialog} onClose={handleDialogClose} PaperProps={{ style: dialogStyles }}>
        <DialogTitle>Add New Contact</DialogTitle>

        <form onSubmit={handleFormSubmit} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newContact.name}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newContact.age}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newContact.address}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email (Optional)"
            value={newContact.email}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={newContact.zipCode}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newContact.city}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Member
          </Button>
        </form>
      </Dialog>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'black', // or any other color you prefer
            padding: '20px',
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={contacts}
          columns={columns}
          getRowId={(row) => row._id}
          editMode="row"
          rowModesModel={rowModesModel}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onRowModesModelChange={setRowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          components={{Toolbar: GridToolbar}}
        />
      </Box>
    </Box>
  );
};

export default Contacts;