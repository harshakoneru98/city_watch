import { ResponsiveBar } from '@nivo/bar';

export default function StackedBarChart(){
  const stackedBarChartData = [
    { id: 'January', A: 20, B: 30, C: 50, D: 10, E: 40 },
    { id: 'February', A: 25, B: 35, C: 45, D: 15, E: 30 },
    { id: 'March', A: 30, B: 40, C: 60, D: 20, E: 50 }
  ];

  const stackedBarChartColors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854']

  return (
    <div style={{ height: '400px', width: '33%' }}>
      <ResponsiveBar
        data={stackedBarChartData}
        keys={['A', 'B', 'C', 'D', 'E']}
        indexBy="id"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Value',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};
