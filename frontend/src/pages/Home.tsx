/*react*/
import {useEffect, useState} from "react";
import { createPortal } from 'react-dom';

/*style*/
import './page.scss'

/*components*/
import { AddButton } from "../components/homeComponents/body/AddButton.tsx";
import Path, { PathOwner } from "../components/homeComponents/body/Path.tsx";
import UserInfo from '../components/homeComponents/body/UserInfo.tsx';
import DiagramFolderList from '../components/homeComponents/body/DiagramFolderList.tsx';
import { BPMN } from './BPMN.tsx';
import { Sort } from "../components/homeComponents/body/Sort.tsx";
import Sidebar from "../components/homeComponents/sidebar/Sidebar.tsx";

/*redux*/
import dirModelThunk from '../store/dirModel/dirModelThunk.ts';
import { useAppDispatch, useAppSelector } from '../store';

const HomePage = () => {
    const canEdit = useAppSelector(state => state.user.hasEditRight);
    const currentDir = useAppSelector(state => state.dirModel);
    const isBpmnOpen = useAppSelector(state => state.bpmn.isOpen);
    const dispatch = useAppDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (typeof currentDir.currentInode === "undefined")
            dispatch(dirModelThunk.loadDirectoryByInode(0))
    }, [])

    const handleSidebarToggle = (isOpen: boolean | ((prevState: boolean) => boolean)) => {
        setIsSidebarOpen(isOpen);
    }

    return (
        <>
            <Sidebar onToggle={handleSidebarToggle} />
            <div className={`home-main-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
                style={isBpmnOpen ? {
                    display: "none"
                } : {}}
            >
                <div className='main-container'>
                    <div className='home-header-sort'>
                        <header className='main-header'>
                            <Path path={currentDir.path} owner={PathOwner.HOME} />
                            <UserInfo />
                        </header>
                        <Sort />
                    </div>

                    <DiagramFolderList
                        directories={currentDir.containedDirectories}
                        models={currentDir.containedModels}
                    />
                </div>
            </div>
            {
                canEdit && currentDir.currentInode! >= 0 ?
                    <AddButton />
                    : null
            }
            {
                isBpmnOpen && createPortal(
                    <BPMN />,
                    document.body
                )
            }
        </>
    )
}

export default HomePage