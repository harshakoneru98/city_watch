import { ResponsiveBar } from '@nivo/bar';

export default function StackedBarChart(){
  const stackedBarChartData = [
    { id: '2022', A: 20, B: 30, C: 50, D: 10, E: 40 },
    { id: '2021', A: 25, B: 35, C: 45, D: 15, E: 30 },
    { id: '2020', A: 30, B: 40, C: 60, D: 20, E: 50 },
    { id: '2019', A: 25, B: 35, C: 45, D: 15, E: 30 },
    { id: '2018', A: 30, B: 40, C: 60, D: 20, E: 50 }
  ];

  const stackedBarChartColors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854']

  return (
    <div style={{ height: '455px', width: '100%' }}>
      <ResponsiveBar
        data={stackedBarChartData}
        keys={['A', 'B', 'C', 'D', 'E']}
        indexBy="id"
        margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={stackedBarChartColors}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Year',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Crime Distribution',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      />
    </div>
  );
};
