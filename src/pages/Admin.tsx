import * as React from 'react';
import { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { fetchRemoteData, modifyDatabase } from "@/helpers/api"
import TableData from '@/components/TableData';
import { TableProps } from "@/components/Table";

type ModelsWithFields = Record<string, TableProps<{}>['columns']>;
const modelsWithFields: ModelsWithFields = {
    class: [
        { title: "Course Code", field: "courseCode" },
        { title: "Subject", field: "subject" },
        { title: "Course", field: "course" },
        { title: "Batch", field: "batch" },
        { title: "Semester", field: "semester" },
        // {
        // render: (rowData) => ( <button onClick={() => console.log(rowData.subject)}>Upload </button>)
        // }
    ]
}


export default function Admin() {
    /* set active tab */
    const [value, setValue] = useState(0);
    /* active table data */
    const [activeTableData, setActiveTableData] = useState([]);
    /* set active tab index */
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    /* fetch and set remote data */
    async function setRemoteData() {
        const { data } = await fetchRemoteData(Object.keys(modelsWithFields)[value]);
        setActiveTableData(data.docs);
    }

    /* re-fetch data whenever the tab active tab changes */
    useEffect(() => {
        setRemoteData();
    }, [value])

    /* update database */
    function updateData(operation: string) {
        return async function (payload: unknown) {
            /* modify remote database */
            await modifyDatabase(operation, Object.keys(modelsWithFields)[value], payload);
            /* refetch data from database */
            setRemoteData();
        }
    }

    return (<>
        <div className="sidebar-menu">
            <Tabs textColor="inherit"
                indicatorColor="primary"
                variant="fullWidth"
                orientation="vertical"
                value={value}
                onChange={handleTabChange}
                aria-label="icon label tabs example">

                <Tab icon={<PhoneIcon />} label="Classes" />
                <Tab icon={<FavoriteIcon />} label="Faculty" />
                <Tab icon={<PersonPinIcon />} label="Students" />

            </Tabs>


        </div>
        {/* content */}
        <div className="content">
            {Object.keys(modelsWithFields).map((modelName, index) => <TableData
                index={index}
                activeIndex={value}
                updateData={updateData}
                activeTableData={activeTableData}
                columns={modelsWithFields[modelName]} />)}
        </div>
    </>)
}