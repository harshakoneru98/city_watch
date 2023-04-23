import { useState, useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectInputProps {
    data: any[];
    name: string;
    defaultValue?: string;
    selectedValue?: any;
    onValChange: (value: any) => void;
}

export default function SelectInput({
    data,
    name,
    defaultValue,
    selectedValue,
    onValChange
}: SelectInputProps) {
    const [val, setVal] = useState(defaultValue || '');

    useEffect(() => {
        if (!defaultValue) {
            setVal(selectedValue || '');
        }
    }, [selectedValue]);

    const handleChange = (event: SelectChangeEvent) => {
        const value_selected = event.target.value as string;
        setVal(value_selected);
        onValChange(value_selected);
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
