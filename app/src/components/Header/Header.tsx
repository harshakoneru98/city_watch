import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocationCityIcon from '@mui/icons-material/LocationCity';

export default function Header() {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
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
                        to="/dashboard"
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
                                display: 'block'
                            }}
                            component={Link}
                            to="/dashboard"
                        >
                            Dashboard
                        </Button>
                        <Button
                            sx={{
                                my: 2,
                                mr: 2,
                                color: 'white',
                                display: 'block'
                            }}
                            component={Link}
                            to="/housing"
                        >
                            Housing
                        </Button>
                        <Button
                            sx={{
                                my: 2,
                                mr: 2,
                                color: 'white',
                                display: 'block'
                            }}
                            component={Link}
                            to="/compare"
                        >
                            Compare
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <AccountCircle sx={{color: 'white', fontSize: 30}}/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem
                                onClick={handleCloseUserMenu}
                                sx={{
                                    width: '100px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                                component={Link}
                                to="/profile"
                            >
                                <Typography textAlign="center">
                                    Profile
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={handleCloseUserMenu}
                                sx={{
                                    width: '100px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                                component={Link}
                                to="/"
                            >
                                <Typography textAlign="center">
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
