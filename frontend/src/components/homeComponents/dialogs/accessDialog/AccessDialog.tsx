import "./_accessDialog.scss"
import '../globalDialog.scss'
import '../../../../static/extra-styles/button.scss'

import{Access} from "../../../../static/images/iconsModel/react-components/Access.tsx";
import {Delete} from "../../../../static/images/iconsModel/react-components/Delete.tsx";
import userAccessIcon from '../../../../static/images/iconsModel/svg/userAccess.svg'
import { useState } from "react"

type Props = {
    users: string[],
    closeDialog: () => void,
    handleAdd: (user: string, clearInput: () => void) => () => void,
    handleRemove: (user: string) => () => void
}

const AccessDialog = ({ users, closeDialog, handleAdd, handleRemove }: Props) => {
    const [newUser, setNewUser] = useState<string>("");

    const clearInput = () => setNewUser("");

    return (
        <div className="dialog dialog-green" onClick={e => e.stopPropagation()}>
            <div className="dialog__header">
                <div className="dialog__icon-and-title">
                    <Access className='access__dialog-icon dropdown__button-icon-green'/>
                    <h3 className="dialog__title">Zugriff bearbeiten</h3>
                </div>
            </div>
            <div className="access-dialog__user-list">
                <h4>Nutzer mit Zugriff</h4>
                <div className='user-list'>
                    {
                        users.map(user => (
                            <div key={user} className="access-dialog__user">
                                <div className='user'>
                                    <img className="access-dialog__user-icon" src={userAccessIcon}
                                        alt='icon' />
                                    <p>{user}</p>
                                </div>

                                <button onClick={handleRemove(user)}>
                                    <Delete className='delete-user dropdown__button-icon-green' />
                                </button>
                            </div>
                        ))
                    }
                </div>

            </div>
            <div className="access__dialog__edit dialog__edit">
                <label form="new user">Nutzer Hinzufügen</label>
                <div className='access__input'>
                    <input className="dialog__input dialog__input-green"
                        name="new user"
                        value={newUser}
                        placeholder="max.mustermann@globalct.com"
                        onChange={(e) => setNewUser(e.target.value)}/>

                    <button className="access-dialog__submit"
                        onClick={newUser.length !== 0 ? handleAdd(newUser, clearInput) : () => null}
                        style={{
                            cursor: newUser.length === 0 ? "not-allowed" : "pointer"
                        }}
                    >
                        HINZUFÜGEN
                    </button>
                </div>
            </div>
            <div className='access-button'>
                <button className="custom-button green-button" onClick={closeDialog}>OK</button>
            </div>

        </div>
    )
}

export default AccessDialog;