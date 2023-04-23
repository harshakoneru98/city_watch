import { FormEvent,useState, useEffect } from 'react';
import { Fragment } from 'react';
import Header from '../../components/Header/Header';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { fetchMetaDataInfoData } from '../../store/slices/metadataSlice';
import { fetchUserDataInfoData } from '../../store/slices/userdataSlice';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

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

    if (metaDataStatus === 'loading') {
        console.log('Loading');
    }

    if (metaDataStatus === 'failed') {
        console.log(metaDataError);
    }

    const { userData, userDataStatus, userDataError } = useSelector(
        (state: RootState) => state.userDataInfo
    );

    if (userDataStatus === 'loading') {
        console.log('user Loading');
    }

    if (userDataError === 'failed') {
        console.log(userDataError);
    }

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
    };

    const handleFirstNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(event.target.value);
    }
    const handleLastNameChange = (event2:React.ChangeEvent<HTMLInputElement>) => {
      setLastName(event2.target.value);
    }

    const handleSave = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const city = event.currentTarget.city.value as string;

      console.log('First Name : ', firstName)
      console.log('Last Name : ', lastName)
      console.log('City : ', city)
      // Set Localhost city item
    }

    return (
        <Fragment>
            <Header />
            <ThemeProvider theme={theme}>
                {userData.data && (
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
                                <AccountCircle
                                    sx={{ color: 'white', fontSize: 30 }}
                                />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                User Details
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
                                            onChange={handleFirstNameChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            disabled={disabledStatus}
                                            fullWidth
                                            id="lastName"
                                            value={lastName}
                                            onChange={handleLastNameChange}
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
                                                    value={selectedCity || ''}
                                                    disabled={disabledStatus}
                                                    onChange={(event) => {
                                                        const value = event
                                                            .target
                                                            .value as string;
                                                        setSelectedCity(value);
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
                                                    backgroundColor: 'green',
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
                                                    backgroundColor: 'red',
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
            </ThemeProvider>
        </Fragment>
    );
}
