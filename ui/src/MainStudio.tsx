import { Avatar, Box, Card, CardContent, CardHeader, Grid, Stack, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";
import { useEffect, useState } from "react";
import { DatasetMetadata, DatasetType, datasetTypeName } from "./Interfaces/Dataset";
import DatasetTwoToneIcon from '@mui/icons-material/DatasetTwoTone';
import PhotoSizeSelectActualTwoToneIcon from '@mui/icons-material/PhotoSizeSelectActualTwoTone';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';

export function MainStudio() {
    const [datasets, setDatasets] = useState<DatasetMetadata[]>([])

    useEffect(() => {
        const datasetsStr = localStorage.getItem('datasets') || '[]'
        setDatasets(JSON.parse(datasetsStr))
        console.log(datasets)
    }, [])

    return (
        <>
        <AnimatedPage>
        <Stack spacing={4} maxWidth='100%'>
            <Stack spacing={2}>
                <Box textAlign={'center'}>
                <Typography variant='h2'>Docker Autopipelines</Typography>
                <Typography variant="subtitle1">Studio</Typography>
                </Box>
            </Stack>

            <Stack spacing={4}>
                <Typography variant="h4">Datasets</Typography>
                <Grid container spacing={2}>
                    {datasets.map((dataset, idx) => {
                        return (
                            <Grid xs={4} style={{paddingRight: '1rem'}}>
                                <Card sx={{width: '100%'}}>
                                    <CardHeader 
                                        avatar={
                                            dataset.type === DatasetType.CSV ? <DatasetTwoToneIcon /> : 
                                            dataset.type === DatasetType.Image ? <PhotoSizeSelectActualTwoToneIcon /> : <FolderOpenTwoToneIcon />
                                        } 
                                        title={dataset.name} 
                                        subheader={datasetTypeName(dataset.type)}
                                    />
                                    <CardContent>
                                        <Typography variant="body1">
                                            {dataset.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </Stack>

            {/* <Stack spacing={4}>
                <Typography variant="h4">Models</Typography>
                <Grid container spacing={2}>
                </Grid>
            </Stack> */}
        </Stack>
        </AnimatedPage>
        </>
    )
}