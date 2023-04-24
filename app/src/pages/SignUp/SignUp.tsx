import { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchMetaDataInfoData } from '../../store/slices/metadataSlice';
import { postAxiosRequest } from '../../api';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import loading_gif from '../../assets/loading.gif';

const theme = createTheme();

export default function SignUp(): JSX.Element {
    const dispatch =
        useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();
    let navigate = useNavigate();

    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [emailExists, setEmailExists] = useState<boolean>(false);

    const { metaData, metaDataStatus, metaDataError } = useSelector(
        (state: RootState) => state.metaDataInfo
    );

    useEffect(() => {
        dispatch(fetchMetaDataInfoData('crime/get_metadata_info/'));
    }, [dispatch]);

    if (metaDataStatus === 'loading') {
        console.log('Loading');
    }

    if (metaDataStatus === 'failed') {
        console.log(metaDataError);
    }

    useEffect(() => {
        if (metaData) {
            const cities = [
                ...new Set(metaData.map((obj: any) => obj.primary_city))
            ].sort();
            setCities(cities);
        }
    }, [metaData]);

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        city?: string;
        password?: string;
    }>({});

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const firstName = data.get('firstName') as string;
        const lastName = data.get('lastName') as string;
        const email = data.get('email') as string;
        const city = event.currentTarget.city.value as string;
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
            const body_data = { firstName, lastName, email, city, password };
            try {
                const user_response_message = await postAxiosRequest(
                    'user/create_user',
                    JSON.stringify(body_data)
                );
                if (user_response_message.message) {
                    if (
                        user_response_message.message === 'Email already exists'
                    ) {
                        setEmailExists(true);
                    } else {
                        setEmailExists(false);
                        navigate('/signin');
                    }
                }
            } catch (error) {
                console.log('Error : ', error);
            }
        }
    };

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        setShowLoader(
            metaDataStatus === 'loading'
        );
    }, [metaDataStatus]);

    return (
        <div
            style={{
                backgroundColor: '#f5f5f5',
                height: '100vh'
            }}
        >
            <AuthHeader />
            <ThemeProvider theme={theme}>
                {showLoader && (
                    <div className="overlay">
                        <img src={loading_gif} alt="Loading..." />
                    </div>
                )}
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
                                    <FormControl fullWidth>
                                        <InputLabel
                                            id="city-label"
                                            required
                                            shrink={Boolean(selectedCity)}
                                        >
                                            City in LA County
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            id="city"
                                            name="city"
                                            autoComplete="city"
                                            error={Boolean(errors.city)}
                                            value={selectedCity}
                                            onChange={(event) => {
                                                const value = event.target
                                                    .value as string;
                                                setSelectedCity(value);
                                                setErrors({
                                                    ...errors,
                                                    city: !value
                                                        ? 'Please enter your city'
                                                        : ''
                                                });
                                            }}
                                            placeholder="City"
                                            labelId="city-label"
                                            label="City in LA County"
                                        >
                                            <MenuItem
                                                value="Other City"
                                                style={{
                                                    borderBottom:
                                                        '1px solid #ccc'
                                                }}
                                            >
                                                Other City
                                            </MenuItem>
                                            {cities?.map((city) => (
                                                <MenuItem
                                                    key={city}
                                                    value={city}
                                                >
                                                    {city}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {Boolean(errors.city) && (
                                        <Typography
                                            color="error"
                                            variant="caption"
                                        >
                                            {errors.city}
                                        </Typography>
                                    )}
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
                            {emailExists && (
                                <Typography color="error" variant="body1">
                                    Email already exists
                                </Typography>
                            )}
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
        </div>
    );
}
