import React, { useState, useEffect } from 'react';
import { ResponsivePie } from "@nivo/pie";

const PieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8000/api/team-members');
        const teamMembers = await response.json();

        // Aggregate data by roles
        const roleCount = teamMembers.reduce((acc, { role }) => {
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});

        // Transform data for the pie chart
        const transformedData = Object.keys(roleCount).map(role => ({
          id: role,
          label: role,
          value: roleCount[role]
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
    />
  );
};

export default PieChart;
