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
