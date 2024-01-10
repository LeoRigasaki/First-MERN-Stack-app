import React, { useState, useEffect } from 'react';
import { Box, useTheme, Button, IconButton, Dialog, DialogTitle } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [invoices, setinvoices] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [newinvoices, setNewinvoices] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    cost: '',
    date: '',
  });
  const [openDialog, setOpenDialog] = useState(false);

  // invoices Component useEffect
  useEffect(() => {
    const userID = localStorage.getItem('userID');
    const fetchinvoices = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/invoices?userID=${userID}`);
        if (!response.ok) {
          throw new Error('Server response was not ok.');
        }
        const data = await response.json();
        const formattedData = data.map(invoice => ({
          ...invoice,
          date: invoice.date ? new Date(invoice.date).toISOString().split('T')[0] : ''
        }));
        setinvoices(formattedData);
      } catch (error) {
        console.error('Failed to fetch Invoices:', error);
      }
    };    
    fetchinvoices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewinvoices(prev => ({ ...prev, [name]: value }));
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
    const invoicesData = { ...newinvoices, userID,date: new Date(newinvoices.date).toISOString().split('T')[0], };

    try {
      const response = await fetch('http://localhost:8000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoicesData),
      });

      if (!response.ok) {
        throw new Error('Failed to post new invoices.');
      }

      const addedinvoices = await response.json();
      setinvoices(prev => [...prev, { ...newinvoices, _id: addedinvoices.invoiceID }]);
      setNewinvoices({
        name: '',
        phone: '',
        email: '',
        address: '',
        cost: '',
        date: '',
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
      // Ensure the date is in the correct format before sending it to the server
      // Adjust this based on your backend requirements
      const formattedRow = {
        ...updatedRow,
        date: new Date(updatedRow.date).toISOString().split('T')[0],
      };

      const response = await fetch(`http://localhost:8000/api/invoices/${updatedRow._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRow),
      });

      if (!response.ok) {
        throw new Error('Server error when updating row');
      }
      const data = await response.json();
      if (!data.updatedData._id) {
        return { ...updatedRow, id: originalRow._id };
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
      const response = await fetch(`http://localhost:8000/api/invoices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoices');
      }

      setinvoices(invoices.filter((invoices) => invoices.id !== id));
    } catch (error) {
      console.error('Failed to delete invoices:', error);
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
    { field: "phone", headerName: "Phone Number", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "address", headerName: "Address", flex: 1, editable: true },
    { field: "cost", headerName: "Cost", type: "number", flex: 1, editable: true },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <input
          type="date"
          defaultValue={params.value || ''}
          onBlur={(e) => {
            const updatedRow = { ...params.row, date: e.target.value };
            processRowUpdate(updatedRow, params.row);
          }}
          autoFocus
        />
      ),
    },
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
      <Header title="invoices" subtitle="List of invoices for Future Reference" />
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
        Add New invoices
      </button>
      <Dialog open={openDialog} onClose={handleDialogClose} PaperProps={{ style: dialogStyles }}>
        <DialogTitle>Add New invoices</DialogTitle>

        <form onSubmit={handleFormSubmit} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newinvoices.name}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newinvoices.phone}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email (Optional)"
            value={newinvoices.email}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newinvoices.address}
            onChange={handleInputChange}
            required
            style={inputStyle}
          /><input
            type="date"
            name="date"
            value={newinvoices.date}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="cost"
            placeholder="Cost"
            value={newinvoices.cost}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Invoice
          </Button>
        </form>
      </Dialog>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'black',
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
          rows={invoices}
          columns={columns}
          getRowId={(row) => row._id}
          editMode="row"
          rowModesModel={rowModesModel}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onRowModesModelChange={setRowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;