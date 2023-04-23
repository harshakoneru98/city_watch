import { Fragment } from 'react';
import Header from '../../components/Header/Header';
import './Compare.scss'
import { Typography, Grid } from '@mui/material';

export default function Compare() {

  return (
    <Fragment>
        <Header />
        <div className="main-container">
          <Typography></Typography>
          <Grid container direction="column">
            <Grid item xs={6}>

            </Grid>
            <Grid item xs={6}>

            </Grid>
          </Grid>
        </div>
    </Fragment>
  );
}