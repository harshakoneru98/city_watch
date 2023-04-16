import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import {postAxiosRequest} from '../../api'

const theme = createTheme();

export default function SignIn(): JSX.Element {
    let navigate = useNavigate();

    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {}
    );
    const [wrongCredentials, setWrongCredentials] = useState<string>('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        const emailError =
            !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? 'Please enter a valid email address'
                : '';
        const passwordError =
            !password ||
            password.length < 8 ||
            password.length > 16 ||
            !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\';:"<,>.?/~`]).{8,16}/.test(
                password
            )
                ? 'Password must be between 8 and 16 characters long and contain at least one capital case letter, one lower case letter, one number, and one special character'
                : '';

        setErrors({ email: emailError, password: passwordError });

        if (!emailError && !passwordError) {
            const body_data = { email, password };
            try {
                const user_response_message = await postAxiosRequest('user/check_user', JSON.stringify(body_data))
                if (user_response_message.message) {
                    setWrongCredentials(user_response_message.message)
                }else{
                    setWrongCredentials('')
                    navigate('/dashboard')
                }
            } catch (error) {
                console.log('Error : ', error);
            }
        }
    };

    return (
        <div style={{
            backgroundColor: '#f5f5f5',
            height: '100vh'
        }}>
            <AuthHeader />
            <ThemeProvider theme={theme}>
                <Container
                    component="main"
                    maxWidth="xs"
                    sx={{
                        backgroundColor: '#FFFFFF',
                        py: 4,
                        px: 2,
                        borderRadius: 2,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '5rem'
                    }}
                >
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            {wrongCredentials != '' && (
                                <Typography color="error" variant="body1">
                                    {wrongCredentials}
                                </Typography>
                            )}
                            <Grid container justifyContent="flex-end">
                                <Grid item sx={{ textAlign: 'right' }}>
                                    <Link to="/signup">
                                        <p
                                            style={{
                                                fontSize: '14px',
                                                color: '#0077c2',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            Don't have an account? Sign Up
                                        </p>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );
}
