import React, { useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [names, setNames] = useState([]);
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/invoices');
        const invoices = await response.json();

        // Collect all unique names
        const allNames = new Set();
        invoices.forEach(invoice => allNames.add(invoice.name));
        setNames(Array.from(allNames));

        // Transform data
        const transformedData = invoices.reduce((acc, invoice) => {
          const date = new Date(invoice.date).toLocaleDateString();
          const name = invoice.name;
          acc[date] = acc[date] || {};
          acc[date][name] = acc[date][name] || 0;
          acc[date][name] += parseFloat(invoice.cost);
          return acc;
        }, {});

        // Convert to chart data and sort by date
        const chartData = Object.keys(transformedData).map(date => ({
          date,
          ...transformedData[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };
  
    fetchInvoiceData();
  }, []);
  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={names}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Date',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Cost',
        legendPosition: 'middle',
        legendOffset: -40
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      role="application"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
    />
  );
};

export default BarChart;
