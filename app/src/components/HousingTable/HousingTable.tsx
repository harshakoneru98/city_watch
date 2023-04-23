import { ChangeEvent, Fragment, useState, MouseEvent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './HousingTable.scss';
import HousingLineChart from '../HousingLineChart/HousingLineChart';

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

function MoreInfoRow({ data }: MoreInfoTableRowProps) {
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

function HousingRow({ row, sqrt_selected }: HousingTableRowProps) {
    const [open, setOpen] = useState(false);

    let crime_data = row.year_data?.map(
        (obj: { year: any; crime_count: any }) => ({
            x: obj.year,
            y: obj.crime_count
        })
    );
    crime_data = [{ id: 'Crime', data: crime_data }];
    let persqrt_data = row.year_data?.map(
        (obj: { year: any; persqrt_price: any }) => ({
            x: obj.year,
            y: obj.persqrt_price
        })
    );
    persqrt_data = [{ id: 'House Pricing', data: persqrt_data }];

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
                    {'$' +
                        (
                            row.year_data[0].persqrt_price * sqrt_selected
                        ).toFixed(0)}
                    <span className="year_cost">
                        {' (as per ' + row.year_data[0].year + ')'}
                    </span>
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
                        <Grid container>
                            <Grid item xs={4}>
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
                                            <TableCell>Crime Count</TableCell>
                                            <TableCell>
                                                Per Sqft Value
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.year_data.map(
                                            (data: any, index: number) => (
                                                <MoreInfoRow
                                                    data={data}
                                                    key={index}
                                                />
                                            )
                                        )}
                                    </TableBody>
                                </Box>
                            </Grid>
                            {row.year_data.length > 1 && (
                                <Fragment>
                                    <Grid item xs={4}>
                                        <Box sx={{ margin: 1 }}>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                            >
                                                Crime Variation
                                            </Typography>
                                            <HousingLineChart
                                                data={crime_data}
                                                color="#1f77b4"
                                                x_axis="Year"
                                                y_axis="Crime Frequency"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ margin: 1 }}>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                            >
                                                Price Variation (per sqft)
                                            </Typography>
                                            <HousingLineChart
                                                data={persqrt_data}
                                                color="#d62728"
                                                x_axis="Year"
                                                y_axis="Per Sqft Price"
                                            />
                                        </Box>
                                    </Grid>
                                </Fragment>
                            )}
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function HousingTable({
    data,
    sqrt_selected
}: HousingTableProps) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleChangePage = (
        event: MouseEvent<HTMLElement>,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleFirstPageButtonClick = (event: MouseEvent<HTMLElement>) => {
        handleChangePage(event, 0);
    };

    const handleBackButtonClick = (event: MouseEvent<HTMLElement>) => {
        handleChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: MouseEvent<HTMLElement>) => {
        handleChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: MouseEvent<HTMLElement>) => {
        const count = data.length;
        handleChangePage(
            event,
            Math.max(0, Math.ceil(count / rowsPerPage) - 1)
        );
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt((event.target as HTMLSelectElement).value, 10));
        setPage(0);
    };

    return (
        <Fragment>
            {data && (
                <TableContainer
                    component={Paper}
                    className="housing-info-table"
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>ZIP Code</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>
                                    Cost ({sqrt_selected} sqft)
                                </TableCell>
                                <TableCell>Risk Zone</TableCell>
                                <TableCell>Crime Correlation</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                ?.map((row: any, index: number) => (
                                    <HousingRow
                                        key={index}
                                        row={row}
                                        sqrt_selected={sqrt_selected}
                                    />
                                ))}
                        </TableBody>
                        <TableFooter className="table-footer">
                            <td colSpan={12}>
                                <div className="table-footer-div">
                                    <p>Rows per page:</p>
                                    <div className="row-select">
                                        <select
                                            onChange={handleChangeRowsPerPage}
                                            value={rowsPerPage}
                                        >
                                            <optgroup>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                    <p>
                                        {(page * rowsPerPage + 1).toString() +
                                            ' - ' +
                                            (page * rowsPerPage + rowsPerPage <
                                            data.length
                                                ? page * rowsPerPage +
                                                  rowsPerPage
                                                : data.length) +
                                            ' of ' +
                                            data.length}
                                    </p>
                                    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                                        <IconButton
                                            onClick={handleFirstPageButtonClick}
                                            disabled={page === 0}
                                        >
                                            <FirstPageIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={handleBackButtonClick}
                                            disabled={page === 0}
                                        >
                                            <KeyboardArrowLeft />
                                        </IconButton>
                                        <IconButton
                                            onClick={handleNextButtonClick}
                                            disabled={
                                                page >=
                                                Math.ceil(
                                                    data.length / rowsPerPage
                                                ) -
                                                    1
                                            }
                                        >
                                            <KeyboardArrowRight />
                                        </IconButton>
                                        <IconButton
                                            onClick={handleLastPageButtonClick}
                                            disabled={
                                                page >=
                                                Math.ceil(
                                                    data.length / rowsPerPage
                                                ) -
                                                    1
                                            }
                                        >
                                            <LastPageIcon />
                                        </IconButton>
                                    </Box>
                                </div>
                            </td>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
        </Fragment>
    );
}
