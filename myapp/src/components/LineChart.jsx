import { useState, useEffect } from 'react';
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/invoices');
        const invoices = await response.json();

        // Generate a list of months in the format "MMM YYYY" for the current year
        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(i);
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });

        const revenueByMonth = {};
        invoices.forEach(invoice => {
          const monthYear = new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + parseFloat(invoice.cost);
        });

        // Fill in the revenue data for each month
        const chartData = months.map(month => ({
          x: month,
          y: revenueByMonth[month] || 0 // Use the revenue or 0 if there's no data
        }));

        setData([{ id: "Revenue", data: chartData }]);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

    fetchLineChartData();
  }, []);

  return (
    <ResponsiveLine
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
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Name',
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
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  );
};

export default LineChart;