import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { AppBar, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { AnimatedPage } from './AnimatedPage';


export function Studio() {
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
        </>
    )
}