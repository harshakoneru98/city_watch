import { ResponsivePie } from '@nivo/pie';

interface PieChartProps {
  data: any[]
}

export default function PieChart({data} : PieChartProps) {
  const pieChartData = data
  const pieChartColors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'];
  const selectedColors = pieChartColors.slice(0, pieChartData.length);

  return (
    <div style={{ height: '400px' }}>
      <ResponsivePie
        data={pieChartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={selectedColors}
        activeOuterRadiusOffset={8}
        sortByValue={true}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        enableArcLinkLabels={false}
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
