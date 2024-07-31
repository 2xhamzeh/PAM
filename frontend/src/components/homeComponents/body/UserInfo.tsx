import './style/components.scss'
import { useEffect } from 'react';
import userThunk from '../../../store/user/userThunk';
import { useAppDispatch, useAppSelector } from '../../../store';

const UserInfo = () => {
    const userInfo = useAppSelector(state => state.user.userInfo);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(userThunk.loadUserInfo({}))
    }, [])

    return (
        <div className='user-info'>
            <p>Hallo: <span>{userInfo?.name}!</span></p>
            <p>Rolle: <span>{userInfo?.role}</span></p>
        </div>
    )
}

export default UserInfo