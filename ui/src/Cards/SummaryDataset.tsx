import React from 'react';
import {Button, Card, CardActions, CardContent, FormControl, List, ListItem, ListItemText, Slider, Typography} from "@mui/material";
import { DatasetMetadata, datasetTypeName } from "../Interfaces/Dataset";
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';

const ddClient = createDockerDesktopClient()

interface DatasetProps {
    back: () => any
    dataset: DatasetMetadata
}

export function SummaryDataset({back, dataset}: DatasetProps) {
    const [val, setVal] = React.useState(20);

    const handleCreate = async () => {
        dataset.valSplit = val / 100
        console.log(dataset)

        // await ddClient.docker.cli.exec('volume', ['ls', '--format', '"{{json .}}"'])
        console.log('Creating volume')
        await ddClient.docker.cli.exec('volume', ['create', `${dataset.name}-dataset`])
        console.log('Creating container')
        await ddClient.docker.cli.exec('run', ['-v', `${dataset.name}-dataset:/data`, '--name', 'helper', 'busybox'])
        console.log('Copying files to container')
        await ddClient.docker.cli.exec('cp', [dataset.file?.path, 'helper:/data'])
        console.log('Removing container')
        await ddClient.docker.cli.exec('rm', ['helper'])
    }

    return (
        <Card sx={{width: 450}}>
            <CardContent>
                <Typography variant='h4' textAlign='center'>Summary</Typography>
                <List dense>
                    <ListItem>
                        <ListItemText 
                            primary='Dataset name'
                            secondary={dataset.name}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary='Path'
                            secondary={dataset.file?.path}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary='Type'
                            secondary={datasetTypeName(dataset.type)}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary='Description'
                            secondary={dataset.description}
                        />
                    </ListItem>
                </List>
                <FormControl fullWidth style={{marginTop: '2rem'}}>
                    <Typography gutterBottom>
                        Validation split: {val}%
                    </Typography>
                    <Slider
                        aria-label='Validation split'
                        value={val}
                        step={5}
                        valueLabelDisplay='auto'
                        getAriaValueText={(val: number) => `${val}%`}
                        onChange={(_ , val) => {setVal(val as number)}}
                    />
                </FormControl>
            </CardContent>
            <CardActions
                sx={{
                    alignSelf: "stretch",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start"
                }}
            >
                <Button variant='outlined' onClick={back}>
                    Back
                </Button>
                <Button onClick={handleCreate}>
                    Create dataset
                </Button>
            </CardActions>
        </Card>
    )
}