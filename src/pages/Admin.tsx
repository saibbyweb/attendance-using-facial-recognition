import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';

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
                <Tab icon={<PhoneIcon />} label="RECENTS" />
                <Tab icon={<FavoriteIcon />} label="FAVORITES" />
                <Tab icon={<PersonPinIcon />} label="NEARBY" />
            </Tabs>

 
        </div>
        {/* content */}
        <div className="content">
        <TabPanel value={value} index={0}>
                Item One
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