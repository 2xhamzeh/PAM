import { useState } from "react"
import { DisplayStatus, Status } from "../../../models/enum.ts"
import {Status as StatusIcon} from "../../../static/images/iconsModel/react-components/Status.tsx"

type Props = {
    initialValue: Status,
    closeDialog: () => void,
    handleSubmit: (status: Status) => () => void
}

const StatusDialog = ({ initialValue, closeDialog, handleSubmit }: Props) => {
    const [currentStatus, setCurrentStatus] = useState<Status>(initialValue)

    return (
        <div className="dialog dialog-green dialog-status" onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">
                    <StatusIcon className='dialog__icon dropdown__button-icon-green' />
                    <h3 className="dialog__title">Status ändern?</h3>
                </div>

                <p className="dialog__description">
                    {/* description */}
                </p>

                {
                    (Object.keys(Status) as Array<keyof typeof Status>).map(s => (
                        <div className='status-container' key={s}>
                            <input type="radio"
                                name="status"
                                id={"status-radio-" + s}
                                value={s}
                                checked={s === currentStatus}
                                onChange={() => setCurrentStatus(Status[s])} />
                                
                            <label htmlFor={"status-radio-" + s}>{DisplayStatus[s]}</label>
                        </div>
                    ))
                }

            </div>
            <div className="dialog__button-groups">
                <button className="custom-button green-button" onClick={closeDialog}>ABBRECHEN</button>
                <button className="custom-button green-button" onClick={handleSubmit(currentStatus)}>ÄNDERN</button>
            </div>
        </div>
    )
}

export default StatusDialog