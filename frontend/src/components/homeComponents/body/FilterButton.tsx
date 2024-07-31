/*react*/
import { v4 as uuidv4 } from 'uuid';

/*components*/
import { FilterType } from "./Sort.tsx";

/*icons*/
import { DoubleArrow } from "../../../static/images/DoubleArrow.tsx";

/*style*/
import './style/components.scss'

/*hooks*/
import useDropdownStatus from "../../../hooks/useDropdownStatus.ts";
import { Filtering, Status } from "../../../models/enum.ts";



interface Props {
    filterType: FilterType,
    currentValue: Status[],
    setValue: (type: Filtering, value: Status | undefined) => () => void
}

export const FilterButton = ({ filterType, currentValue, setValue }: Props) => {
    const [isOpen, toggleDropdown, dropdownContentRef] = useDropdownStatus();

    const handleCheckboxChange = (type: Filtering, value: Status | undefined) => {
        return (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLLabelElement>) => {
            e.stopPropagation(); // Prevent the event from bubbling up to the button
            setValue(type, value)();
        };
    };

    return (
        <button id={filterType.buttonId}
            onClick={toggleDropdown}
            className={`sort-btn ${isOpen ? 'active-status' : ''} sort-btn-status`}
        >
            <span className='btn-name'>{filterType.buttonName}</span>
            <DoubleArrow className={`arrow ${isOpen ? 'up' : 'down'}`} />
            <div id='status' className={`dropdown-menu ${isOpen ? 'visible' : ''}`}
                ref={dropdownContentRef}
            >
                <div className='dropdown-menu-back dropdown-menu-back-status'>
                    {
                        filterType.options.map(option =>
                            <div key={uuidv4()}
                                className='dropdown-items'
                            >
                                <input
                                    type="checkbox"
                                    id={option.className}
                                    name={option.className}
                                    value={option.value}
                                    checked={currentValue.includes(option.value!)}
                                    onChange={setValue(filterType.type, option.value)}
                                    onClick={e => e.stopPropagation()} // this stops the menu from closing when clicking on the checkbox
                                />
                                <label htmlFor={option.className} onClick={handleCheckboxChange(filterType.type, option.value)}>{option.name}</label>
                            </div>
                        )
                    }
                </div>
            </div>
        </button>
    );
};