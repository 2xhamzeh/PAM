import React from "react";

interface MenuIconProps {
    className: string;
}

export const Access:React.FC<MenuIconProps> = ({className}) => {
    return (
        <svg className={className}
             width="17"
             height="16"
             viewBox="0 0 17 16"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.7777 5.25179C12.6846 6.52318 11.7256 7.5026 10.6798 7.5026C9.63403 7.5026 8.67344 6.5235 8.5819 5.25179C8.48654 3.92912 9.42011 3.00098 10.6798 3.00098C11.9395 3.00098 12.8731 3.95319 12.7777 5.25179Z"
                stroke="#7BC297"
                strokeWidth="1.00189"
                strokeLinecap="round"
                strokeLinejoin="round"/>
            <path
                d="M10.6793 9.50275C8.60804 9.50275 6.61626 10.5145 6.11728 12.485C6.05117 12.7456 6.21739 13.0035 6.48976 13.0035H14.8691C15.1415 13.0035 15.3068 12.7456 15.2416 12.485C14.7426 10.483 12.7508 9.50275 10.6793 9.50275Z"
                stroke="#7BC297"
                strokeWidth="1.00189"
                strokeMiterlimit="10"/>
            <path
                d="M6.35797 5.81316C6.28357 6.8288 5.50841 7.62867 4.67283 7.62867C3.83726 7.62867 3.06082 6.82911 2.98769 5.81316C2.9117 4.75656 3.6662 4.0014 4.67283 4.0014C5.67946 4.0014 6.43396 4.77595 6.35797 5.81316Z"
                stroke="#7BC297"
                strokeWidth="1.00189"
                strokeLinecap="round"
                strokeLinejoin="round"/>
            <path
                d="M6.54779 9.56479C5.97404 9.30626 5.34212 9.20685 4.67238 9.20685C3.01947 9.20685 1.42696 10.015 1.02804 11.589C0.97559 11.7972 1.10846 12.0032 1.32588 12.0032H4.89489"
                stroke="#7BC297"
                strokeWidth="1.00189"
                strokeMiterlimit="10"
                strokeLinecap="round"/>
        </svg>

    );
};