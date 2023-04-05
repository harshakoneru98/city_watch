import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectInputProps {
    data: string[];
    name: string;
    defaultValue: string;
    onValChange: (value: string) => void;
}

export default function SelectInput({
    data,
    name,
    defaultValue,
    onValChange
}: SelectInputProps) {
    const [val, setVal] = React.useState(defaultValue);
    const handleChange = (event: SelectChangeEvent) => {
      const value_selected = event.target.value as string
        setVal(value_selected);
        onValChange(value_selected)
    };

    return (
        <Box sx={{ width: '200px' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{name}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={val}
                    label={name}
                    onChange={handleChange}
                >
                    {data.map((data_val) => {
                        return (
                            <MenuItem key={data_val} value={data_val}>
                                {data_val}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}
