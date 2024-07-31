import { ReactNode } from "react";
import '../../../index.scss'

type Props = {
    handleOutsideClick: () => void,
    children: ReactNode
}

const BlurBackground = ({handleOutsideClick, children} : Props) => {
    return (
        <div className="blur-background"
            onClick={handleOutsideClick}>
            { children }
        </div>
    )
}

export default BlurBackground;