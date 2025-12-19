import { HttpSetup } from 'opensearch-dashboards/public';
import React, { createContext, useContext } from 'react';

interface ApiContextValue {
    http: HttpSetup;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export const ApiProvider: React.FC<{ http: HttpSetup; children: React.ReactNode }> = ({
    http,
    children,
}) => {
    return <ApiContext.Provider value={{ http }}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};
