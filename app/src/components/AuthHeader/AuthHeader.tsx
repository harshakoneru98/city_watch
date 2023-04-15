import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LocationCityIcon from '@mui/icons-material/LocationCity';

export default function AuthHeader() {
    const location = useLocation();

    const isActiveTab = (path: string) => {
        return location.pathname === path;
      };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LocationCityIcon
                        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 30 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        CITY WATCH
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'flex' },
                            justifyContent: 'flex-end',
                            mr: 5
                        }}
                    >
                        <Button
                            sx={{
                                my: 2,
                                mr: 2,
                                color: 'white',
                                display: 'block',
                                borderBottom: isActiveTab('/signup') ? '2px solid white' : ''
                            }}
                            component={Link}
                            to="/signup"
                        >
                            Sign Up
                        </Button>
                        <Button
                            sx={{
                                my: 2,
                                mr: 2,
                                color: 'white',
                                display: 'block',
                                borderBottom: isActiveTab('/signin') ? '2px solid white' : ''
                            }}
                            component={Link}
                            to="/signin"
                        >
                            Sign In
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
