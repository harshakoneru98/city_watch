import { FormEvent, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
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

const theme = createTheme();

export default function SignUp(): JSX.Element {
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        city?: string;
        password?: string;
    }>({});

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const firstName = data.get('firstName') as string;
        const lastName = data.get('lastName') as string;
        const email = data.get('email') as string;
        const city = data.get('city') as string;
        const password = data.get('password') as string;

        const firstNameError = !firstName ? 'Please enter your first name' : '';
        const lastNameError = !lastName ? 'Please enter your last name' : '';
        const emailError =
            !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? 'Please enter a valid email address'
                : '';
        const cityError = !city ? 'Please enter your city' : '';
        const passwordError =
            !password ||
            password.length < 8 ||
            password.length > 16 ||
            !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\';:"<,>.?/~`]).{8,16}/.test(
                password
            )
                ? 'Password must be between 8 and 16 characters long and contain at least one capital case letter, one lower case letter, one number, and one special character'
                : '';

        setErrors({
            firstName: firstNameError,
            lastName: lastNameError,
            email: emailError,
            city: cityError,
            password: passwordError
        });

        if (
            !firstNameError &&
            !lastNameError &&
            !emailError &&
            !cityError &&
            !passwordError
        ) {
            console.log({ firstName, lastName, email, city, password });
        }
    };

    return (
        <Fragment>
            <AuthHeader />
            <ThemeProvider theme={theme}>
                <Container
                    component="main"
                    maxWidth="xs"
                    sx={{
                        backgroundColor: '#F6F7FB',
                        py: 4,
                        px: 2,
                        borderRadius: 2,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '2.5rem'
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
                            Sign up
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        error={Boolean(errors.firstName)}
                                        helperText={errors.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        error={Boolean(errors.lastName)}
                                        helperText={errors.lastName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        error={Boolean(errors.email)}
                                        helperText={errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="city"
                                        label="City"
                                        name="city"
                                        autoComplete="city"
                                        error={Boolean(errors.city)}
                                        helperText={errors.city}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        error={Boolean(errors.password)}
                                        helperText={errors.password}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to="/signin">
                                        <p
                                            style={{
                                                fontSize: '14px',
                                                color: '#0077c2',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            Already have an account? Sign In
                                        </p>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Fragment>
    );
}
