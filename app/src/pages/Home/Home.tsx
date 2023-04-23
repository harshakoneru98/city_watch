import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Grid, Box, Typography } from '@mui/material';
import './Home.scss';
import crime_housing from '../../assets/crime_housing.gif';

const Img = styled('img')({
    display: 'block',
    height: '100%'
});

export default function Home() {
    return (
        <Fragment>
            <Grid container direction="row" className="home_header" spacing={2}>
                <Grid item xs={4} className="home_grid_item" spacing={2}>
                    <Box className="home_box">
                        <Typography
                            className="home_summary"
                            variant="body1"
                            sx={{ mt: 3, ml: 3, mr: 3 }}
                        >
                            Our team at City Watch is dedicated to providing
                            valuable insights and analytics on crime activity
                            trends to help homeowners make informed decisions
                            about their safety and security. By utilizing
                            advanced forecasting techniques, we are able to
                            predict future crime activity and allocate resources
                            accordingly, ensuring the safety of our community.
                            Our services also provide a unique perspective on
                            how crime activity impacts the housing market,
                            allowing homeowners to make informed decisions about
                            pricing and location. With our data-driven approach,
                            we strive to create a safer and more secure
                            environment for all residents in Los Angeles.
                        </Typography>
                        <div className="girdItemCenter">
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: 200 }}
                                component={Link}
                                to="/signin"
                            >
                                Get Started
                            </Button>
                        </div>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={8}
                    className="home_image"
                    sx={{ padding: 0, height: '100vh' }}
                >
                    <Img alt="complex" src={crime_housing} />
                </Grid>
            </Grid>
        </Fragment>
    );
}
