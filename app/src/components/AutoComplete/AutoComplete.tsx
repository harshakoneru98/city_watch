import { Fragment } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import './AutoComplete.scss';

interface AutoCompleteProps {
    data: string[];
    selectedValues?: any;
    onSelectionChange?: (selectedValues: any) => void;
}

export default function AutoComplete({
    data,
    selectedValues,
    onSelectionChange
}: AutoCompleteProps) {
    const handleSelectionChange = (event: any, newValue: any) => {
        if (onSelectionChange) {
            onSelectionChange(newValue);
        }
    };

    return (
        <Fragment>
            <Autocomplete
                multiple
                id="size-small-outlined-multi"
                size="small"
                limitTags={1}
                options={data}
                value={selectedValues}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Cities"
                        value={selectedValues}
                    />
                )}
                className="dropdown-autocomplete"
                onChange={handleSelectionChange}
            />
        </Fragment>
    );
}
