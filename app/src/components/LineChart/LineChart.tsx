import { ResponsiveLine } from '@nivo/line';
import { AxisProps } from '@nivo/axes';
import './LineChart.scss';

export default function LineChart() {
    const axisBottom: AxisProps = {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Months',
        legendOffset: 36,
        legendPosition: 'middle'
    };

    const axisLeft: AxisProps = {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Number of Crimes',
        legendOffset: -40,
        legendPosition: 'middle'
    };

    const data = [
        {
            id: 'Actual',
            data: [
                { x: 'Jan', y: 12 },
                { x: 'Feb', y: 28 },
                { x: 'Mar', y: 23 },
                { x: 'Apr', y: 15 },
                { x: 'May', y: 20 },
                { x: 'Jun', y: 30 },
                { x: 'Jul', y: 12 },
                { x: 'Aug', y: 28 },
                { x: 'Sep', y: 23 },
                { x: 'Oct', y: 15 },
                { x: 'Nov', y: 20 },
                { x: 'Dec', y: 30 }
            ]
        },
        {
            id: 'Forecasted',
            data: [
                { x: 'Sep', y: 20 },
                { x: 'Oct', y: 17 },
                { x: 'Nov', y: 19 },
                { x: 'Dec', y: 32 }
            ]
        }
    ];

    const colors = ['#1f77b4', '#d62728'];

    return (
        <div className="linechart-container" style={{ height: '400px' }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                    reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={axisBottom}
                axisLeft={axisLeft}
                colors={colors}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: -15,
                        translateY: -15,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
}
