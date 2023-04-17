import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

interface BarChartProps {
  data: any[]
}

export default function BarChart({data} : BarChartProps){
  const normalBarChartData = data

  const barChartColors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854']

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ResponsiveBar
        data={normalBarChartData}
        keys={['value']}
        indexBy="id"
        margin={{ top: 50, right: 10, bottom: 50, left: 70 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={(bar) => barChartColors[bar.index]}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        layout='horizontal'
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Value',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Age Range',
          legendPosition: 'middle',
          legendOffset: -65,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      />
    </div>
  );
};
