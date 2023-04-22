import { Fragment, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import './HousingTable.scss';

interface HousingTableProps {
    data: any;
    sqrt_selected: number;
}

interface HousingTableRowProps {
    row: any;
    key: number;
    sqrt_selected: number;
}

interface MoreInfoTableRowProps {
    data: any;
    key: number;
}

function MoreInfoRow({data}: MoreInfoTableRowProps) {
    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    {data.year}
                </TableCell>
                <TableCell component="th" scope="row">
                    {data.crime_count}
                </TableCell>
                <TableCell component="th" scope="row">
                    {data.persqrt_price}  
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

function HousingRow({row, sqrt_selected}: HousingTableRowProps) {
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.zip_code}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.housing_city}
                </TableCell>
                <TableCell component="th" scope="row">
                    {'$' + (row.year_data[0].persqrt_price * sqrt_selected).toFixed(0)}  
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.year_data[0].risk_zone}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.year_data[0].house_crime_correlation}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                More Info
                            </Typography>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Year</TableCell>
                                    <TableCell>
                                        Crime Count
                                    </TableCell>
                                    <TableCell>Per Sqrt Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    row.year_data.map((data: any, index: number) => (
                                        <MoreInfoRow data={data} key={index} />
                                    ))
                                }
                            </TableBody>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function HousingTable({ data, sqrt_selected }: HousingTableProps) {
    console.log('Data : ', data);
    return (
        <Fragment>
            <TableContainer component={Paper} className="housing-info-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>ZIP Code</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Cost ({sqrt_selected} sqft)</TableCell>
                            <TableCell>Risk Zone</TableCell>
                            <TableCell>Crime Correlation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((row: any, index: number) => (
                            <HousingRow key={index} row={row} sqrt_selected={sqrt_selected} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    );
}
