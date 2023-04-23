import { ResponsiveLine } from '@nivo/line';
import { AxisProps } from '@nivo/axes';
import './HousingLineChart.scss';

interface LineChartProps {
    data: any[];
    color: string;
    x_axis: string;
    y_axis: string;
}

export default function HousingLineChart({ data, color, x_axis, y_axis }: LineChartProps) {
    const axisBottom: AxisProps = {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: x_axis,
        legendOffset: 36,
        legendPosition: 'middle'
    };

    const axisLeft: AxisProps = {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: y_axis,
        legendOffset: -50,
        legendPosition: 'middle'
    };

    const line_data = data;

    return (
        <div className="linechart-container" style={{ height: '400px' }}>
            <ResponsiveLine
                data={line_data}
                margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
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
                colors={color}
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
