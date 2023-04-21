import { ResponsiveBar } from '@nivo/bar';

interface StackBarChartProps {
  data: any[];
}

export default function StackedBarChart({data} : StackBarChartProps){
  const stackedBarChartData = data

  const stackedBarChartColors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854']

  return (
    <div style={{ height: '407px', width: '100%' }}>
      <ResponsiveBar
        data={stackedBarChartData}
        keys={Object.keys(data[0]).slice(1)}
        indexBy="id"
        margin={{ top: 20, right: 10, bottom: 50, left: 60 }}
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
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      />
    </div>
  );
};
