/*react*/
import { RefObject } from "react"
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from 'react-tooltip'
import classNames from 'classnames';

/*styles*/
import "./optionDropdown.scss"

/*hooks*/
import useDropdownStatus from "../../../hooks/useDropdownStatus.ts";

/*icons*/
import { MenuIcon } from "../../../static/images/MenuIcon.tsx";
import {Access} from "../../../static/images/iconsModel/react-components/Access.tsx";
import {Rename} from "../../../static/images/iconsModel/react-components/Rename.tsx";
import {Delete} from "../../../static/images/iconsModel/react-components/Delete.tsx";
import {Description} from "../../../static/images/iconsModel/react-components/Description.tsx";
import {Move} from "../../../static/images/iconsModel/react-components/Move.tsx";
import {Status} from "../../../static/images/iconsModel/react-components/Status.tsx";

export enum DropdownOwner {
    DIRECTORY,
    MODEL
}

export enum DropDownActions {
    UMBENENNEN = "Umbenennen",
    BESCHREIBUNG = "Beschreibung",
    LOESCHEN = "Löschen",
    ZUGREIFF_BEARBEITEN = "Zugriff bearbeiten",
    VERSCHIEBEN = "Verschieben",
    STATUS_AENDERN = "Status ändern"
}

interface OptionData {
    type: DropDownActions,
    action: () => void
}

const OptionDropdown = ({ options, cardType }: { options: OptionData[], cardType: DropdownOwner }) => {
    const [isOpen, toggleDropdown, dropdownContentRef]: [boolean, (() => void), RefObject<HTMLInputElement>] = useDropdownStatus();
    const buttonIconClass = classNames('dropdown__button-icon', {
        'dropdown__button-icon-blue': cardType === DropdownOwner.DIRECTORY,
        'dropdown__button-icon-green': cardType === DropdownOwner.MODEL,
    });

    const handleOptionClick = (action: () => void) => {
        toggleDropdown();
        action();
    }
    const dropdownContentClass = classNames('dropdown__content', { 'open': isOpen });

    return (
        <div className="dropdown__container" onClick={e => e.stopPropagation()}>
            <button type="button" className="dropdown__button"
                onClick={toggleDropdown}
                /*data-tooltip-id="dropdown-tooltip"
                data-tooltip-content="More Options"*/>
                <MenuIcon className={buttonIconClass} />
            </button>

            {isOpen &&
                <div className={dropdownContentClass}
                    ref={dropdownContentRef}>
                    {
                        options.map(option => (
                            <div key={uuidv4()}
                                className="dropdown__option"
                                onClick={() => handleOptionClick(option.action)}>
                                <DropdownOptionIcon type={option.type} cardType={cardType} />
                                <div className="dropdown__option-name">{option.type}</div>
                            </div>
                        ))
                    }
                </div>
            }
            {
                !isOpen &&
                <Tooltip id="dropdown-tooltip" place="left" noArrow />
            }
        </div>
    )

}

const DropdownOptionIcon = ({ type, cardType }: { type: DropDownActions, cardType: DropdownOwner }) => {

    const iconClass = classNames('dropdown__option-icon', {
        'dropdown__option-icon-blue': cardType === DropdownOwner.DIRECTORY,
        'dropdown__option-icon-green': cardType === DropdownOwner.MODEL,
    });
    switch (type) {
        case DropDownActions.BESCHREIBUNG:
            return <Description className={iconClass} />;
        case DropDownActions.LOESCHEN:
            return <Delete className={iconClass} />;
        case DropDownActions.UMBENENNEN:
            return <Rename className={iconClass} />;
        case DropDownActions.ZUGREIFF_BEARBEITEN:
            return <Access className={iconClass} />;
        case DropDownActions.VERSCHIEBEN:
            return <Move className={iconClass} />;
        case DropDownActions.STATUS_AENDERN:
            return <Status className={iconClass} />;
        default:
            return null;
    }
}

export default OptionDropdown;