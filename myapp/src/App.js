import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Home from "./LandingPage";
import LoginPage from "./LoginPage";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import SidebarComp from "./scenes/global/Sidebar";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      {/* <ThemeProvider theme={theme}> */}
        <CssBaseline />
        <div className="app">
          <Routes>
            <Route path="*" element={<NonDashboardLayout />} />
            <Route path="/dashboard/*" element={<DashboardLayout theme={theme} />} />
          </Routes>
        </div>
      {/* </ThemeProvider> */}
    </ColorModeContext.Provider>
  );
}
const mainContentStyle = {
  marginLeft: '250px',
  transition: 'margin-left 0.3s ease',
};

function NonDashboardLayout() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

function DashboardLayout({ theme }) {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <>
      <ColorModeContext.Provider value={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SidebarComp isSidebar={isSidebar} />
          <main style={mainContentStyle} className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="form" element={<Form />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
              <Route path="line" element={<Line />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="geography" element={<Geography />} />
            </Routes>
          </main>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}


export default App;
