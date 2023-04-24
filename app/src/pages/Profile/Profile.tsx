import { FormEvent, useState, useEffect } from 'react';
import { Fragment } from 'react';
import Header from '../../components/Header/Header';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { fetchMetaDataInfoData } from '../../store/slices/metadataSlice';
import { fetchUserDataInfoData } from '../../store/slices/userdataSlice';
import { fetchUpdateUserDataInfoData } from '../../store/slices/updateuserdataSlice';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import loading_gif from '../../assets/loading.gif';
import './Profile.scss';

const theme = createTheme();

export default function Profile() {
    const dispatch =
        useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const user_id = localStorage.getItem('userId');

    const [cities, setCities] = useState<string[]>([]);
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [selectedCity, setSelectedCity] = useState<string>();

    const [disabledStatus, setDisabledStatus] = useState<boolean>(true);

    const { metaData, metaDataStatus, metaDataError } = useSelector(
        (state: RootState) => state.metaDataInfo
    );

    useEffect(() => {
        dispatch(fetchMetaDataInfoData('crime/get_metadata_info/'));
    }, [dispatch]);

    if (metaDataStatus === 'failed') {
        console.log(metaDataError);
    }

    const { userData, userDataStatus, userDataError } = useSelector(
        (state: RootState) => state.userDataInfo
    );

    if (userDataError === 'failed') {
        console.log(userDataError);
    }

    const { updateUserData, updateUserDataStatus, updateUserDataError } =
        useSelector((state: RootState) => state.updateUserDataInfo);

    if (updateUserDataError === 'failed') {
        console.log(updateUserDataError);
    }

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        city?: string;
    }>({});

    useEffect(() => {
        if (metaData) {
            const cities = [
                ...new Set(metaData.map((obj: any) => obj.primary_city))
            ].sort();
            dispatch(
                fetchUserDataInfoData({
                    endpoint: 'user/get_user_data',
                    userId: user_id
                })
            );
            setCities(cities);
        }
    }, [metaData]);

    useEffect(() => {
        if (userData.data) {
            setFirstName(userData.data.firstName);
            setLastName(userData.data.lastName);
            setEmail(userData.data.email);
            setSelectedCity(userData.data.city_located);
        }
    }, [userData]);

    const handleEdit = () => {
        setDisabledStatus(false);
    };

    const handleCancel = () => {
        setFirstName(userData.data.firstName);
        setLastName(userData.data.lastName);
        setSelectedCity(userData.data.city_located);
        setDisabledStatus(true);
        setErrors({
            firstName: '',
            lastName: '',
            city: ''
        });
    };

    const handleFirstNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFirstName(event.target.value);
    };
    const handleLastNameChange = (
        event2: React.ChangeEvent<HTMLInputElement>
    ) => {
        setLastName(event2.target.value);
    };

    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const city = event.currentTarget.city.value as string;

        const firstNameError = !firstName ? 'Please enter your first name' : '';
        const lastNameError = !lastName ? 'Please enter your last name' : '';
        const cityError = !city ? 'Please enter your city' : '';

        setErrors({
            firstName: firstNameError,
            lastName: lastNameError,
            city: cityError
        });

        if (!firstNameError && !lastNameError && !cityError) {
            dispatch(
                fetchUpdateUserDataInfoData({
                    endpoint: 'user/update_user_data',
                    userId: user_id || '',
                    firstName: firstName || '',
                    lastName: lastName || '',
                    city_located: city
                })
            );
        }
    };

    useEffect(() => {
        if (updateUserData.message) {
            localStorage.setItem('city', selectedCity || '');
            setDisabledStatus(true);
        }
    }, [updateUserData]);

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        setShowLoader(
            metaDataStatus === 'loading' ||
            userDataStatus === 'loading' ||
            updateUserDataStatus === 'loading'
        );
    }, [metaDataStatus, userDataStatus, updateUserDataStatus]);

    return (
        <Fragment>
            <Header />
            <ThemeProvider theme={theme}>
                <div className="main-container">
                    {showLoader && (
                        <div className="overlay">
                            <img src={loading_gif} alt="Loading..." />
                        </div>
                    )}
                    <div className="profile-container">
                        {userData.data && (
                            <Container
                                component="main"
                                maxWidth="xs"
                                sx={{
                                    backgroundColor: '#FFFFFF',
                                    py: 4,
                                    px: 2,
                                    borderRadius: 2,
                                    boxShadow:
                                        '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
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
                                    <Avatar
                                        sx={{ m: 1, bgcolor: 'secondary.main' }}
                                    >
                                        <AccountCircle
                                            sx={{
                                                color: 'white',
                                                fontSize: 30
                                            }}
                                        />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Profile
                                    </Typography>
                                    <Box
                                        component="form"
                                        noValidate
                                        onSubmit={handleSave}
                                        sx={{ mt: 3 }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    disabled={disabledStatus}
                                                    value={firstName}
                                                    fullWidth
                                                    id="firstName"
                                                    onChange={
                                                        handleFirstNameChange
                                                    }
                                                    error={Boolean(
                                                        errors.firstName
                                                    )}
                                                    helperText={
                                                        errors.firstName
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    disabled={disabledStatus}
                                                    fullWidth
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={
                                                        handleLastNameChange
                                                    }
                                                    error={Boolean(
                                                        errors.lastName
                                                    )}
                                                    helperText={errors.lastName}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
                                                    value={email}
                                                    fullWidth
                                                    id="email"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                {cities && (
                                                    <FormControl fullWidth>
                                                        <InputLabel
                                                            id="city-label"
                                                            required
                                                        >
                                                            City in LA County
                                                        </InputLabel>
                                                        <Select
                                                            fullWidth
                                                            id="city"
                                                            name="city"
                                                            autoComplete="city"
                                                            value={
                                                                selectedCity ||
                                                                ''
                                                            }
                                                            disabled={
                                                                disabledStatus
                                                            }
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                const value =
                                                                    event.target
                                                                        .value as string;
                                                                setSelectedCity(
                                                                    value
                                                                );
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
                                                            {cities?.map(
                                                                (city) => (
                                                                    <MenuItem
                                                                        key={
                                                                            city
                                                                        }
                                                                        value={
                                                                            city
                                                                        }
                                                                    >
                                                                        {city}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                                {Boolean(errors.city) && (
                                                    <Typography
                                                        color="error"
                                                        variant="caption"
                                                    >
                                                        {errors.city}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>

                                        {disabledStatus ? (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                                onClick={handleEdit}
                                            >
                                                EDIT
                                            </Button>
                                        ) : (
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{
                                                            mt: 3,
                                                            mb: 2,
                                                            backgroundColor:
                                                                'green',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'darkgreen'
                                                            }
                                                        }}
                                                        type="submit"
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{
                                                            mt: 3,
                                                            mb: 2,
                                                            backgroundColor:
                                                                'red',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'darkred'
                                                            }
                                                        }}
                                                        onClick={handleCancel}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Box>
                                </Box>
                            </Container>
                        )}
                    </div>
                </div>
            </ThemeProvider>
        </Fragment>
    );
}
