import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StorageIcon from '@mui/icons-material/Storage';
import ScienceIcon from '@mui/icons-material/Science';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { AnimatedPage } from './AnimatedPage';
import { ModelBuilder } from './ModelBuilder';
import { Datasets } from './Datasets';
import { Experiments } from './Experiments';
import { Deploy } from './Deploy';
import { MainStudio } from './MainStudio';

const drawerWidth = 240;


export function Studio() {
    const [studio, setStudio] = React.useState(0);

    const handleStudioChange = (newValue: number) => {
        setStudio(newValue);
    };

    const redirect = () => {
        setStudio(0)
    }

    return (
        <AnimatedPage>
            <Box sx={{display: 'flex'}}>
                <AppBar 
                    position="fixed"
                    style={{border: "none", height: 'auto'}}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                >
                    <Toolbar>
                        <IconButton 
                        component={Link} to="/"
                        edge="start" color="inherit" 
                        aria-label="back" sx={{ mr: 2 }}>
                            <ArrowBackIosNewIcon style={{color: 'white'}} />
                        </IconButton>
                        <Typography variant="h6" color={"inherit"} component={"div"}>
                            Docker autopipelines
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    style={{width: drawerWidth, flexShrink: 0, whiteSpace: 'nowrap', boxSizing: 'border-box'}}
                    sx={{'& .MuiDrawer-paper': {width: drawerWidth}}}
                    variant='permanent' anchor='left'
                >
                    <Toolbar />
                    <List>
                        <ListItemButton onClick={() => handleStudioChange(0)}>
                            <ListItemIcon>
                                <HomeTwoToneIcon />
                            </ListItemIcon>
                            <ListItemText primary="Studio" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={() => handleStudioChange(1)}>
                            <ListItemIcon>
                                <StorageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Datasets" />
                        </ListItemButton>

                        <ListItemButton onClick={() => handleStudioChange(2)}>
                            <ListItemIcon>
                                <DataObjectIcon />
                            </ListItemIcon>
                            <ListItemText primary="Model builder" />
                        </ListItemButton>

                        <ListItemButton onClick={() => handleStudioChange(3)}>
                            <ListItemIcon>
                                <ScienceIcon />
                            </ListItemIcon>
                            <ListItemText primary="Experiments" />
                        </ListItemButton>

                        <ListItemButton onClick={() => handleStudioChange(4)}>
                            <ListItemIcon>
                                <DeviceHubIcon />
                            </ListItemIcon>
                            <ListItemText primary="Deploy" />
                        </ListItemButton>
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    {studio === 0 && <MainStudio />}
                    {studio === 1 && <Datasets />}
                    {studio === 2 && <ModelBuilder />}
                    {studio === 3 && <Experiments />}
                    {studio === 4 && <Deploy />}
                </Box>
            </Box>
        </AnimatedPage>
    )
}