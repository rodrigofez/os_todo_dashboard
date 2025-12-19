import { EuiIcon, EuiPage, EuiPageBody, EuiSideNav } from '@elastic/eui';
import React, { ReactNode, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const ROUTES = {
    OVERVIEW: {
        label: 'Overview',
        path: '/',
        euiIconType: 'calendar'
    },
    METRICS: {
        label: 'Metrics',
        path: '/metrics',
        euiIconType: 'stats'
    }
}

export const MainLayout = ({ children }: { children: ReactNode }) => {
    const history = useHistory();
    const location = useLocation()

    const [isOpenOnMobile, setIsOpenInMobile] = useState(false);

    return (
        <>
            <EuiPage>
                <EuiSideNav
                    aria-label="TO-DO Plugin"
                    mobileTitle='TODO Plugin'
                    toggleOpenOnMobile={() => setIsOpenInMobile(prev => !prev)}
                    isOpenOnMobile={isOpenOnMobile}
                    style={{ width: 192 }}
                    items={[
                        {
                            name: 'TO-DO Plugin',
                            id: 'todo-plugin',
                            items: [
                                {
                                    name: ROUTES.OVERVIEW.label,
                                    icon: <EuiIcon type={ROUTES.OVERVIEW.euiIconType} />
                                    ,
                                    id: 'overview',
                                    isSelected: location.pathname == ROUTES.OVERVIEW.path, onClick: () => history.push(ROUTES.OVERVIEW.path)
                                },
                                {
                                    name: ROUTES.METRICS.label,
                                    icon: <EuiIcon type={ROUTES.METRICS.euiIconType} />
                                    ,
                                    id: 'metrics',
                                    isSelected: location.pathname == ROUTES.METRICS.path, onClick: () => history.push(ROUTES.METRICS.path)
                                },

                            ],
                        },
                    ]}
                />
                <EuiPageBody component="main">
                    {children}
                </EuiPageBody >
            </EuiPage >
        </>
    )
}
