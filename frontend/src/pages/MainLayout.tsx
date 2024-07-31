/*react*/
import { Slide, toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useAppSelector } from "../store";
import { Outlet } from "react-router-dom";

/*style*/
import './page.scss'


const MainLayout = () => {
    const error = useAppSelector(state => state.appStatus.error)

    useEffect(() => {
        if(!error) return

        toast.error(
            <div>
                <div>Es ist ein Fehler aufgetreten.</div>
                <div>Bitte laden Sie die Website neu!</div>
            </div>, {
            position: "top-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            progress: undefined,
            theme: "colored",
            toastId: "toast-error",
            containerId: "app-toast",
            transition: Slide,
            closeButton: false,
                style: {
                    backgroundColor: '#8B0000',
                }
        })
    }, [error])

    return (
        <div className='main'>
            <Outlet />
            <ToastContainer containerId={"app-toast"} />
        </div>
    )
}

export default MainLayout;