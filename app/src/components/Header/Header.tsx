import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    Tooltip,
    MenuItem
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AuthContext from '../../context/auth-context';

export default function Header() {
    let contextType = useContext(AuthContext);

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const clickLogout = () => {
        handleCloseUserMenu();
        contextType.logout();
    };

    const location = useLocation();

    const isActiveTab = (path: string) => {
        return location.pathname === path;
    };

    return (
        <AppBar position="static" style={{ height: '9vh' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LocationCityIcon
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            mr: 1,
                            fontSize: 30
                        }}
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
                                display: 'block',
                                borderBottom: isActiveTab('/dashboard')
                                    ? '2px solid white'
                                    : ''
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
                                display: 'block',
                                borderBottom: isActiveTab('/housing')
                                    ? '2px solid white'
                                    : ''
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
                                display: 'block',
                                borderBottom: isActiveTab('/compare')
                                    ? '2px solid white'
                                    : ''
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
                                <AccountCircle
                                    sx={{ color: 'white', fontSize: 30 }}
                                />
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
                                onClick={clickLogout}
                                sx={{
                                    width: '100px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
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
