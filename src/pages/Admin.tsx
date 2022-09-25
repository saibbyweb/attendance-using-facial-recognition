import * as React from 'react';
import { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { fetchRemoteData, modifyDatabase } from "@/helpers/api"
import TableData from '@/components/TableData';

import { ModelsWithFields, modelsWithFields } from '@/helpers/modelsWithFields';

/* options */
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]


/* handle change */
const handleChange = (something: any) => {
    console.log(something);
}

export default function Admin() {
    /* active tab */
    const [value, setValue] = useState(0);
    /* list of models and field data */
    const [modelsAndFieldData, setModelsAndFieldData] = useState<ModelsWithFields>({});
    const [classes, setClasses] = useState([]);
    /* active table data */
    const [activeTableData, setActiveTableData] = useState([]);
    /* set active tab index */
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    /* fetch and set remote data */
    async function setRemoteData() {
        const activeModelName = Object.keys(modelsAndFieldData)[value];
        let { data } = await fetchRemoteData(activeModelName);
        /* process non-string data for table */
        switch(activeModelName) {
            case "faculty":
            case "student":
                data.docs = data.docs.map((point: any) => {
                    let classes = '';
                    point.classes.forEach((point: any) => classes =  classes+= ' / ' + point.value)
                    return {...point, classes: classes.replace('/','') } 
                }) 
                break;
        }
        if(data)
            setActiveTableData(data.docs);
    }

    async function fetchClasses() {
        const { data } = await fetchRemoteData('class')
        setClasses(data.docs.map((point: any) => ({
            label: point.classId + `- (${point.course})`,
            value: point.classId
        })))
    }
    
    useEffect(() => {
        fetchClasses();
       
    },[])

    useEffect(() => {
        setModelsAndFieldData(modelsWithFields(classes))
    },[classes])

    /* re-fetch data whenever the tab active tab changes */
    useEffect(() => {
        setRemoteData();
    }, [value, modelsAndFieldData])

    /* update database */
    function updateData(operation: string) {
        return async function (payload: unknown) {
            console.log(payload, modelsAndFieldData)
            /* modify remote database */
            await modifyDatabase(operation, Object.keys(modelsAndFieldData)[value], payload);
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
            {Object.keys(modelsAndFieldData).map((modelName, index) => <TableData
                key={index}
                title={modelName.toUpperCase()}
                index={index}
                activeIndex={value}
                updateData={updateData}
                activeTableData={activeTableData}
                columns={modelsAndFieldData[modelName]} />)}
        </div>
    </>)
}