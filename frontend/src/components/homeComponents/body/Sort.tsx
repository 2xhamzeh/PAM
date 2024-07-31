/*react*/
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/*styles*/
import '../../../index.scss'
import './style/components.scss'

/*components*/
import { SortButton } from "./SortButton.tsx";
import { FilterButton } from './FilterButton.tsx';

/*redux*/
import { changeFilter, changeSorting } from '../../../store/dirModel/dirModelSlice.ts';
import dirModelThunk from '../../../store/dirModel/dirModelThunk.ts';
import { useAppDispatch, useAppSelector } from '../../../store';

/*extra*/
import { Filtering, Sorting, Status } from '../../../models/enum.ts';


interface SortOption {
    name: string,
    className: string,
    value: 1 | -1
}

export interface SortType {
    type: Sorting,
    buttonId: string,
    buttonName: string,
    options: SortOption[]
}

interface FilterOption {
    name: string,
    className: string,
    value: Status | undefined // | FilterValue01 | FilterValue02...
}

export interface FilterType {
    type: Filtering,
    buttonId: string,
    buttonName: string,
    options: FilterOption[]
}

const sortTypes: SortType[] = [
    {
        type: Sorting.DATE,
        buttonId: "datum",
        buttonName: "Datum",
        options: [{
            name: "Neueste zuerst",
            className: "datumDown",
            value: 1
        },
        {
            name: "Älteste zuerst",
            className: "datumUp",
            value: -1
        }]
    },
    {
        type: Sorting.NAME,
        buttonId: "folderName",
        buttonName: "Name",
        options: [{
            name: "Name A-Z",
            className: "nameDown",
            value: 1
        },
        {
            name: "Name Z-A",
            className: "nameUp",
            value: -1
        }]
    },
    {
        type: Sorting.AUTHOR_NAME,
        buttonId: "author",
        buttonName: "Name des Autors",
        options: [{
            name: "Name A-Z",
            className: "authorDown",
            value: 1
        },
        {
            name: "Name Z-A",
            className: "authorUp",
            value: -1
        }]
    }
]

const filterTypes: FilterType[] = [
    {
        type: Filtering.STATUS,
        buttonId: "status",
        buttonName: "Status",
        options: [
            {
                name: "Veröffentlicht",
                className: "veröffentlicht",
                value: Status.PUBLISHED
            },
            {
                name: "Unveröffentlicht",
                className: "unveröffentlicht",
                value: Status.UNPUBLISHED
            },
            {
                name: "In Arbeit",
                className: "inArbeit",
                value: Status.IN_PROGRESS
            }
        ]
    }
]

export const Sort = () => {
    const currentInode = useAppSelector(state => state.dirModel.currentInode)
    const currentSorting = useAppSelector(state => state.dirModel.sorting)
    const currentFilter = useAppSelector(state => state.dirModel.filter)
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(typeof currentInode === "undefined") return

        dispatch(dirModelThunk.loadDirectoryByInode(currentInode));
    }, [currentSorting, currentFilter])

    const setSortValue = (type: Sorting, value: 1 | -1) => () => {
        dispatch(changeSorting({ type, value }))
    }

    const setFilterValue = (type: Filtering, value: Status | undefined) => () => {
        dispatch(changeFilter({ type, value }))
    }

    return (
        <section className='sort-container'>
            <div className='sort-container-items'>
                <p className='sort-item'>Sortiert nach:</p>
                <div className={`sort-items-btns`}>
                    {
                        sortTypes.map(st => (
                            <SortButton key={uuidv4()}
                                sortType={st}
                                currentSorting={currentSorting}
                                setValue={setSortValue}
                            />
                        ))
                    }

                    <FilterButton filterType={filterTypes[0]} currentValue={currentFilter.status} setValue={setFilterValue} />
                </div>
            </div>
        </section>
    );
};