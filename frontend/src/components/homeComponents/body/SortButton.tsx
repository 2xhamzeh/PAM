/*react*/
import { v4 as uuidv4 } from 'uuid';
import React from "react";

/*icons*/
import { DoubleArrow } from "../../../static/images/DoubleArrow.tsx";

/*style*/
import './style/components.scss'

/*hooks*/
import useDropdownStatus from "../../../hooks/useDropdownStatus.ts";
import { Sorting } from "../../../models/enum.ts";

/*components*/
import { SortType } from "./Sort.tsx";

interface Props {
    sortType: SortType,
    currentSorting: {
        type: Sorting,
        value: 1 | -1
    },
    setValue: (type: Sorting, value: 1 | -1) => () => void
}

export const SortButton = ({ sortType, currentSorting, setValue }: Props) => {
    const isActive = currentSorting.type === sortType.type;
    const [isOpen, toggleDropdown, dropdownContentRef] = useDropdownStatus();
    const handleCheckboxChange = (type: Sorting, value: 1 | -1) => {
        return (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLLabelElement>) => {
            e.stopPropagation();
            toggleDropdown();

            setTimeout(setValue(type, value), 500)
        };
    };

    return (
        <button id={sortType.buttonId}
            onClick={toggleDropdown}
            className={`sort-btn ${isOpen ? 'active' : ''}`}
            style={{
                borderColor: isActive ? "#7BC297" : "#131E36",
            }}
        >
            <span className='btn-name'>{sortType.buttonName}</span>
            <DoubleArrow className={`arrow ${isOpen ? 'up' : 'down'}`} />
            <div className={`dropdown-menu ${isOpen ? 'visible' : ''}`}
                ref={dropdownContentRef}
                style={{
                    borderColor: isActive ? "#7BC297" : "#131E36",
                }}
            >
                <div className='dropdown-menu-back'>
                    {
                        sortType.options.map(option =>
                            <div key={uuidv4()}
                                className='dropdown-items'>
                                <input
                                    type="checkbox"
                                    id={option.className}
                                    name={option.className}
                                    value={option.value}
                                    checked={option.value === currentSorting.value && isActive}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDropdown();
                                        setTimeout(setValue(sortType.type, option.value), 500)
                                    }}
                                    onChange={(e) => { e.preventDefault(); }}


                                />
                                <label htmlFor={option.className}
                                    onClick={handleCheckboxChange(sortType.type, option.value)}>{option.name}</label>
                            </div>
                        )
                    }
                </div>
            </div>
        </button>
    );
};