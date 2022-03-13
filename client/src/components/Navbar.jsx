import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import axios from 'axios';
import Cookies from 'js-cookie';

import {
    AppBar,
    Button,
    Toolbar,
    Typography,
    IconButton,
    CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function Navbar() {
    const [token, setToken] = useState('');

    const linkStyle = { textDecoration: 'none', color: 'inherit' };
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    useEffect(() => {
        setToken(() => Cookies.get('token'));
    }, []);

    async function handleLogout() {
        await axios.post(`${process.env.REACT_APP_DOMAIN_ROOT}/auth/logout`, {
            token: Cookies.get('token'),
        });
        Cookies.remove('token');
        Cookies.remove('userID');
        setToken(() => '');
    }

    return (
        <React.Fragment>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='menu'
                            sx={{ mr: 2 }}
                        >
                            <Link to='/' style={linkStyle}>
                                <MenuIcon />
                            </Link>
                        </IconButton>
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ flexGrow: 1 }}
                        >
                            KnowItAll
                        </Typography>

                        {token && (
                            <Button onClick={handleLogout} color='inherit'>
                                <Link to='/login' style={linkStyle}>
                                    Logout
                                </Link>
                            </Button>
                        )}
                        {!token && (
                            <React.Fragment>
                                <Button color='inherit'>
                                    <Link to='/login' style={linkStyle}>
                                        Login
                                    </Link>
                                </Button>
                                <Button color='inherit'>
                                    <Link to='/register' style={linkStyle}>
                                        Register
                                    </Link>
                                </Button>
                            </React.Fragment>
                        )}
                    </Toolbar>
                </AppBar>
                <Outlet />
            </ThemeProvider>
        </React.Fragment>
    );
}

export default Navbar;
