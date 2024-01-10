import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

const SidebarComp = () => {
  const [username, setUsername] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);

  // Define the inline styles
  const sidebarStyle = {
    position: 'fixed', // Fixed or absolute, depending on your needs
    left: 0,
    top: 0,
    bottom: 0,
    width: isCollapsed ? '80px' : '240px',
    backgroundColor: '#20232a',
    transition: 'width 0.5s',
    zIndex: 1, // Lower z-index so it goes behind main content
  };
  
  const sidebarHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns items on opposite ends
    padding: '0.5rem 1rem', // Adds padding inside the header
    backgroundColor: '#333', // Sets a background color for the header
    color: 'white', // Sets text color
    zIndex: 1,
  };

  const profileStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  };

  const profileImageStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '10px',
  };

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    color: 'white',
    textDecoration: 'none',
  };

  const iconStyle = {
    marginRight: isCollapsed ? '0' : '20px',
  };

  const menuTextStyle = {
    display: isCollapsed ? 'none' : 'inline',
  };

  return (
    <div style={sidebarStyle}>
      <div style={sidebarHeaderStyle}>
        <MenuOutlinedIcon style={{ color: 'white', marginBottom: '10px' }} onClick={() => setIsCollapsed(!isCollapsed)} />
        {!isCollapsed && <h3 style={{ color: 'white' }}>ADMIN PANEL</h3>}
      </div>
      <div style={profileStyle}>
        <img src={`../../assets/user.png`} style={profileImageStyle} alt="profile" />
        {!isCollapsed && <p style={{ color: 'white', margin: 0 }}>{username}</p>}
      </div>
      <Link to="/dashboard" style={menuItemStyle}>
        <HomeOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Dashboard</span>
      </Link>

      <Link to="/dashboard/team" style={menuItemStyle}>
        <PeopleOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Manage Team</span>
      </Link>

      <Link to="/dashboard/contacts" style={menuItemStyle}>
        <ContactsOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Contacts Information</span>
      </Link>

      <Link to="/dashboard/invoices" style={menuItemStyle}>
        <ReceiptOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Invoices Balances</span>
      </Link>

      <Link to="/dashboard/form" style={menuItemStyle}>
        <PersonOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Profile Form</span>
      </Link>

      <Link to="/dashboard/calendar" style={menuItemStyle}>
        <CalendarTodayOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Calendar</span>
      </Link>

      <Link to="/dashboard/faq" style={menuItemStyle}>
        <HelpOutlineOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>FAQ Page</span>
      </Link>

      <Link to="/dashboard/bar" style={menuItemStyle}>
        <BarChartOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Bar Chart</span>
      </Link>

      <Link to="/dashboard/pie" style={menuItemStyle}>
        <PieChartOutlineOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Pie Chart</span>
      </Link>

      <Link to="/dashboard/line" style={menuItemStyle}>
        <TimelineOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Line Chart</span>
      </Link>

      <Link to="/dashboard/geography" style={menuItemStyle}>
        <MapOutlinedIcon style={iconStyle} />
        <span style={menuTextStyle}>Geography Chart</span>
      </Link>
    </div>
  );
};

export default SidebarComp;
