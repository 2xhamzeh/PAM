import { RefObject, useEffect, useRef, useState } from "react"

const useDropdownStatus = () : [boolean , (() => void) , RefObject<HTMLInputElement>] => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLInputElement>(null); 

    const toggleDropdown = () => {
        setIsOpen(io => !io);
    };

    useEffect(() => {
        if(!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                toggleDropdown();
            }
        }


        document.addEventListener("mousedown", handleClickOutside);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);

        };
    }, [isOpen, ref])

    return [isOpen, toggleDropdown, ref];
}

export default useDropdownStatus;