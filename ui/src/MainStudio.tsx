import { Avatar, Box, Card, CardContent, CardHeader, Grid, Stack, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";
import { useEffect, useState } from "react";
import { DatasetMetadata, DatasetType, datasetTypeName } from "./Interfaces/Dataset";
import DatasetTwoToneIcon from '@mui/icons-material/DatasetTwoTone';
import PhotoSizeSelectActualTwoToneIcon from '@mui/icons-material/PhotoSizeSelectActualTwoTone';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
import { ModelMetadata } from "./Interfaces/Model";
import CodeIcon from '@mui/icons-material/Code';
import { ExperimentMetadata } from "./Interfaces/Experiments";
import ScienceIcon from '@mui/icons-material/Science';
import WebhookIcon from '@mui/icons-material/Webhook';
import { DeployMetadata } from "./Interfaces/Deploy";

export function MainStudio() {
    const [datasets, setDatasets] = useState<DatasetMetadata[]>([])
    const [models, setModels] = useState<ModelMetadata[]>([])
    const [experiments, setExperiments] = useState<ExperimentMetadata[]>([])
    const [deploys, setDeploys] = useState<DeployMetadata[]>([])

    useEffect(() => {
        const datasetsStr = localStorage.getItem('datasets') || '[]'
        setDatasets(JSON.parse(datasetsStr))
    }, [])

    useEffect(() => {
        const modelsStr = localStorage.getItem('models') || '[]'
        setModels(JSON.parse(modelsStr))
    }, [])

    useEffect(() => {
        const experimentsStr = localStorage.getItem('experiments') || '[]'
        setExperiments(JSON.parse(experimentsStr))
    }, [])

    useEffect(() => {
        const deploysStr = localStorage.getItem('deploys') || '[]'
        setDeploys(JSON.parse(deploysStr))
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
                                        <Typography variant="caption">
                                            <span style={{fontWeight: 'bold'}}>Task:</span> {dataset.typeExperiment}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>

                <Typography variant="h4">Models</Typography>
                <Grid container spacing={2}>
                    {models.map((model, idx) => {
                        return (
                            <Grid xs={4} style={{paddingRight: '1rem'}}>
                                <Card sx={{width: '100%'}}>
                                    <CardHeader 
                                        avatar={<CodeIcon />} 
                                        title={model.name}
                                    />
                                    <CardContent>
                                        <Typography variant="body1">
                                            {model.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>

                <Typography variant="h4">Experiments</Typography>
                <Grid container spacing={2}>
                    {experiments.map((experiment, idx) => {
                        return (
                            <Grid xs={4} style={{paddingRight: '1rem'}}>
                                <Card sx={{width: '100%'}}>
                                    <CardHeader 
                                        avatar={<ScienceIcon />} 
                                        title={experiment.name}
                                    />
                                    <CardContent>
                                        <Typography variant="body1">
                                            <span style={{fontWeight: 'bold'}}>Dataset:</span> {experiment.dataset}
                                        </Typography>
                                        <Typography variant="body1">
                                            <span style={{fontWeight: 'bold'}}>Model:</span> {experiment.model}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>

                <Typography variant="h4">Deploys</Typography>
                <Grid container spacing={2}>
                    {deploys.map((deploy, idx) => {
                        return (
                            <Grid xs={4} style={{paddingRight: '1rem'}}>
                                <Card sx={{width: '100%'}}>
                                    <CardHeader 
                                        avatar={<WebhookIcon />} 
                                        title={deploy.name}
                                    />
                                    <CardContent>
                                        <Typography variant="body1">
                                            <span style={{fontWeight: 'bold'}}>Experiment:</span> {deploy.experiment}
                                        </Typography>
                                        <Typography variant="body1">
                                            <span style={{fontWeight: 'bold'}}>Port:</span> {deploy.port}
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