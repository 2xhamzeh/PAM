import React, { useEffect, useState } from 'react';
import { KeinZugriff } from '../pages/KeinZugriff';
import { GridLoader } from 'react-spinners';
import '../index.scss';

interface props {
    component: React.ComponentType;
}

const ProtectedRoute = ({ component: Component }: props) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {

        const checkAuthorization = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/users/", { credentials: 'include' });
                const userInfo = await response.json();

                if (userInfo.role === "Designer" || userInfo.role === "Admin" || userInfo.role === "Reader") {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error("Authorization check failed:", error);
                setIsAuthorized(false);
            }
        };

        checkAuthorization();
    }, []);


    if (isAuthorized === null) {
        return (
            <div className="loader-container">
                <GridLoader color="#37578A" size={50} />
            </div>
        );
    }

    return isAuthorized ? <Component /> : <KeinZugriff />;
};

export default ProtectedRoute;
