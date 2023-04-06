import { ResponsivePie } from '@nivo/pie';

export default function PieChart() {
  const pieChartData = [
    { id: 'Los Angeles', value: 20 },
    { id: 'Pasedena', value: 30 },
    { id: 'Malibu', value: 50 },
    { id: 'Marina Del Rey', value: 10 },
    { id: 'La Canada Flintridge', value: 40 },
  ];

  const pieChartColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  return (
    <div style={{ height: '400px' }}>
      <ResponsivePie
        data={pieChartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={pieChartColors}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
      />
    </div>
  );
};