import { useState, Fragment } from 'react';
import { Slider } from '@mui/material';

function createMarks(min: number, max: number, step: number, alias: string) {
    let output = [];
    for (let i = min; i <= max; i += step) {
        if (i !== max) {
            if ([min, 4 * step, 7 * step].includes(i)) {
                output.push({
                    value: i,
                    label: i.toString() + alias
                });
            } else {
                output.push({
                    value: i,
                    label: ''
                });
            }
        } else {
            output.push({
                value: i,
                label: i.toString() + alias + '+'
            });
        }
    }

    return output;
}

interface SingleSliderProps {
    step: number;
    min: number;
    max: number;
    defaultValue: number;
    alias: string;
    onValChange: (value: number) => void;
}

export default function SingleSlider({
    defaultValue,
    step,
    min,
    max,
    alias,
    onValChange
}: SingleSliderProps) {
    let marks = createMarks(min, max, step, alias);
    const [value, setValue] = useState(defaultValue);

    const handleChange = (event: Event, newValue: any) => {
        setValue(newValue);
        onValChange(newValue);
    };

    return (
        <Fragment>
            <Slider
                valueLabelDisplay="auto"
                marks={marks}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={handleChange}
                className="slider"
            />
        </Fragment>
    );
}
