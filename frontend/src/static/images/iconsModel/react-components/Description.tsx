import React from "react";

interface MenuIconProps {
    className: string;
}

export const Description:React.FC<MenuIconProps> = ({className}) => {
    return (
        <svg className={className}
             width="16"
             height="16"
             viewBox="0 0 16 16"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.5663 2.86235L1.44905 14.007L0.775391
                15.6379L2.40624 14.9642L13.5509 3.84691L12.5663
                2.86235ZM13.6199 1.80915L13.1383 2.2904L14.1228
                3.27495L14.6045 2.7933C14.7309 2.66682 14.8019
                2.49534 14.8019 2.31654C14.8019 2.13775 14.7309
                1.96626 14.6045 1.83979L14.5739 1.80915C14.5112
                1.74651 14.4369 1.69682 14.355 1.66292C14.2732
                1.62902 14.1855 1.61157 14.0969 1.61157C14.0083
                1.61157 13.9206 1.62902 13.8388 1.66292C13.7569
                1.69682 13.6826 1.74651 13.6199 1.80915Z"
                fill="#7BC297"/>
        </svg>

    );
};