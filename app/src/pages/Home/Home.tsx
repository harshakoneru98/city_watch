import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Home() {
    return (
        <Fragment>
            <h1>Home Page</h1>
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
        </Fragment>
    );
}
