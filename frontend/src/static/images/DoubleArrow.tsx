import React from "react";
import '../../index.scss'

interface DoubleArrowProps {
    className: string;
}

export const DoubleArrow: React.FC<DoubleArrowProps> = ({className}) => {
    return (
        <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.66675 8.66663L8.00008 12L11.3334 8.66663"
                  stroke="#21335B"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M4.66675 4L8.00008 7.33333L11.3334 4"
                  stroke="#21335B"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    );
};