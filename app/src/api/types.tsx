// Metadata Info Types
export interface MetaData {
    primary_city: string;
    zip_code: string;
    latitude: number;
    longitude: number;
}

export interface MetaDataState {
    metaData: MetaData[];
    metaDataStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    metaDataError: string | null;
}

// Zipcode Data by Year and City Types
export interface ZipDataState {
    zipData: any;
    zipDataStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    zipDataError: string | null;
}

export interface CrimeData {
    zip_code: string;
    risk_zone: string;
    latitude: number;
    longitude: number;
    ethnicity_distribution: any;
    gender_distribution: any;
    age_distribution: any;
    top5_crimes: any;
    actual_month_crime_freq: any;
    actual_week_crime_freq: any;
    prediction_month_crime_freq?: any;
    prediction_week_crime_freq?: any;
}

// Zipcode Data by Year and City Types
export interface CrimeDataState {
    crimeData: CrimeData[];
    crimeDataStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    crimeDataError: string | null;
}

// Top 5 Recent Crime Data by Zipcodes
export interface Top5RecentCrimeDataState {
    top5RecentCrimeData: any;
    top5RecentCrimeDataStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    top5RecentCrimeDataError: string | null;
}

// Housing Cities
export interface HousingCitiesDataState {
    housingCitiesData: string[];
    housingCitiesDataStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    housingCitiesDataError: string | null;
}
