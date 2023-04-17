import React from 'react';

export default React.createContext({
    token: '',
    userId: '',
    city: '',
    login: (token: string, userId: string, tokenExpiration: number, city_located: string) => {},
    logout: () => {}
});
