import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Table from "@/components/Table";


function TabPanel({ value, index, children }: any) {
    return (<div hidden={value !== index}> {children} </div>)
}

export default function Admin() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
                        onRowDelete={() => { }}
                        onRowAdd={() => { }}
                        onRowUpdate={console.log}
                        columns={[
                            { title: "ID", field: "id" },
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
                            {
                                title: "Do magic",
                                field: "custom",
                                render: (rowData) => (
                                    <button onClick={() => console.log(rowData.subject)}>
                                        Upload
                                    </button>
                                )
                            }
                        ]}
                        data={[
                            {
                                id: "PGDWD",
                                subject: "Web Development",
                                course: "PG Dimploma in Web Design",
                                batch: 2020,
                                semester: 2
                            }
                        ]}
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