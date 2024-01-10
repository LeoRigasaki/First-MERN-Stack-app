import React, { useState, useEffect } from 'react';
import { Box, useTheme, Button, IconButton } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const ErrorBanner = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', margin: '10px 0', borderRadius: '4px', animation: 'fade-in 0.5s ease-in' }}>
      <p>{message}</p>
    </div>
  );
};
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [teamMembers, setTeamMembers] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    role: '',
    email: '',
    contactNumber: '',
  });
  const [ageError, setAgeError] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  useEffect(() => {
    const userID = localStorage.getItem('userID'); // Retrieve user ID from localStorage
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/team-members?userID=${userID}`);
        if (!response.ok) {
          throw new Error('Server response was not ok.');
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
    if (ageError) setAgeError('');
  };
  const handleRowEditStart = (event, row) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (event, row) => {
    event.defaultMuiPrevented = true;
  };

  const processRowUpdate = async (updatedRow, originalRow) => {
    try {
      const response = await fetch(`http://localhost:8000/api/team-members/${updatedRow._id}`, {
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
  

  const handleProcessRowUpdateError = (error) => {
    console.error('An error occurred while updating the row:', error);
  };


  const handleDeleteRow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/team-members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team member.');
      }
      setTeamMembers(teamMembers.filter((member) => member._id !== id));

    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userID = localStorage.getItem('userID');
    const memberData = { ...newMember, userID };
    if (parseInt(newMember.age) < 10) {
      setAgeError('Age must be 10 or older.');
      setErrorKey(prevKey => prevKey + 1);
      return;
    }
    const phoneRegex = /^\+\d{12}$/;

    if (!phoneRegex.test(memberData.contactNumber)) {
      alert('Invalid phone number format. Expected format: + followed by 12 digits');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        throw new Error('Failed to post new team member.');
      }

      const addedMember = await response.json();
      setTeamMembers(prev => [...prev, { ...newMember, _id: addedMember.teamMemberID }]);
      setNewMember({
        name: '',
        age: '',
        role: '',
        email: '',
        contactNumber: '',
      });
    } catch (error) {
      console.error(error);
    }
  };
  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    color: 'black',
    backgroundColor: 'white',
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, editable: true },
    { field: "age", headerName: "Age", type: "number", flex: 1, editable: true },
    { field: "role", headerName: "Role", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "contactNumber", headerName: "Contact Number", flex: 1, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
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
              onClick={() => handleDeleteRow(params.id)}
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
      <Header title="TEAM" subtitle="Managing the Team Members" />
      {ageError && <ErrorBanner key={errorKey} message={ageError} />}
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '16px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f8f8f8', // Light background for the form

        }}
        noValidate
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newMember.name}
          onChange={handleInputChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newMember.age}
          onChange={handleInputChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={newMember.role}
          onChange={handleInputChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email (Optional)"
          value={newMember.email}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={newMember.contactNumber}
          onChange={handleInputChange}
          required
          style={inputStyle}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Member
        </Button>
      </form>
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        <DataGrid
          rows={teamMembers}
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

export default Team;
