import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { AppBar, Box, Drawer, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { AnimatedPage } from './AnimatedPage';
import { ModelBuilder } from './ModelBuilder';


export function Studio() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
        <AnimatedPage>
        <AppBar position="sticky" color="transparent" style={{border: "none"}}>
            <Toolbar>
                <IconButton 
                component={Link} to="/"
                edge="start" color="inherit" 
                aria-label="back" sx={{ mr: 2 }}>
                    <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6" color={"inherit"} component={"div"}>
                    Docker autopipelines
                </Typography>
            </Toolbar>
        </AppBar>
        </AnimatedPage>
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1}}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Model builder" />
                </Tabs>
            </Box>
        </Box>
        {value === 0 && (
            <ModelBuilder />
        )}
        </>
    )
}