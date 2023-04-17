import { Fragment, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import Dashboard from './pages/Dashboard/Dashboard';
import Housing from './pages/Housing/Housing';
import Compare from './pages/Compare/Compare';
import Profile from './pages/Profile/Profile';
import AuthContext from './context/auth-context';

export default function App() {
    const [token, setToken] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [city, setCity] = useState<string>('');

    const ls_token = localStorage.getItem('token');

    let login = (
        token: string,
        userId: string,
        tokenExpiration: number,
        city_located: string
    ) => {
        setToken(token);
        setUserId(userId);
        setCity(city_located);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('city', city_located);
    };

    let logout = () => {
        setToken('');
        setUserId('');
        setCity('');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('city');
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token') || '');
        }
        if (localStorage.getItem('userId')) {
            setUserId(localStorage.getItem('userId') || '');
        }
        if (localStorage.getItem('city')) {
            setCity(localStorage.getItem('city') || '');
        }
    }, [localStorage]);

    return (
        <Router>
            <Fragment>
                <AuthContext.Provider
                    value={{
                        token: token,
                        userId: userId,
                        city: city,
                        login: login,
                        logout: logout
                    }}
                >
                    <Routes>
                        {!ls_token && (
                            <Fragment>
                                <Route path="/" element={<Home />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                            </Fragment>
                        )}
                        {ls_token && (
                            <Fragment>
                                <Route
                                    path="/"
                                    element={<Navigate to="/dashboard" />}
                                />
                                <Route
                                    path="/signin"
                                    element={<Navigate to="/dashboard" />}
                                />
                                <Route
                                    path="/signup"
                                    element={<Navigate to="/dashboard" />}
                                />
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/housing" element={<Housing />} />
                                <Route path="/compare" element={<Compare />} />
                            </Fragment>
                        )}

                        <Route path="/*" element={<Navigate to="/signin" />} />
                    </Routes>
                </AuthContext.Provider>
            </Fragment>
        </Router>
    );
}
