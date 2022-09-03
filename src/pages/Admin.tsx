import * as React from 'react';
import { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Table from "@/components/Table";
import { fetchRemoteData, saveDocInDatabase, updateDocInDatabse, deleteDocInDatabase } from "@/helpers/api"

/* model names */
const modelNames = ['class', 'faculty', 'students']

/* tab panel (content) */
function TabPanel({ value, index, children }: any) {
    return (<div hidden={value !== index}> {children} </div>)
}

export default function Admin() {
    /* set active tab */
    const [value, setValue] = useState(0);
    /* active table data */
    const [activeTableData, setActiveTableData] = useState([]);
    /* set active tab index */
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    /* fetch and set remote data */
    async function setRemoteData() {
        const { data } = await fetchRemoteData(modelNames[value]);
        setActiveTableData(data.docs);
    }

    /* re-fetch data whenever the tab active tab changes */
    useEffect(() => {
        setRemoteData();
    }, [value])
    
    /* update database */
    async function updateDatabase(operation: string, payload: Object) {
        switch (operation) {
            case 'add':
                await saveDocInDatabase(modelNames[value], payload);
                break;
            case 'update':
                await updateDocInDatabse(modelNames[value], payload);
                break;
            case 'delete':
                await deleteDocInDatabase(modelNames[value], payload)
                break;
        }
        /* refetch data from database */
        setRemoteData();
    }

    return (<>
        <div className="sidebar-menu">
            <Tabs textColor="inherit" indicatorColor="primary" variant="fullWidth" orientation="vertical" value={value} onChange={handleChange} aria-label="icon label tabs example">
                <Tab icon={<PhoneIcon />} label="Classes" />
                <Tab icon={<FavoriteIcon />} label="Faculty" />
                <Tab icon={<PersonPinIcon />} label="Students" />
            </Tabs>


        </div>
        {/* content */}
        <div className="content">
            <TabPanel value={value} index={0}>
                {/* <ThemeProvider theme={theme}> */}
                <Table
                    title="Classes"
                    onRowDelete={(payload) => updateDatabase('delete', payload)}
                    onRowAdd={(payload) => updateDatabase('add', payload)}
                    onRowUpdate={(payload) => updateDatabase('update', payload)}
                    columns={[
                        { title: "Course Code", field: "courseCode" },
                        { title: "Subject", field: "subject" },
                        { title: "Course", field: "course" },
                        {
                            title: "Batch",
                            field: "batch"
                        },
                        {
                            title: "Semester",
                            field: "semester"
                        },
                        // {
                            // title: "Do magic",
                            // field: "custom",
                            // render: (rowData) => (
                            //     <button onClick={() => console.log(rowData.subject)}>
                            //         Upload
                            //     </button>
                            // )
                        // }
                    ]}
                    data={activeTableData}
                />
                {/* </ThemeProvider> */}
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
        </div>
    </>)
}