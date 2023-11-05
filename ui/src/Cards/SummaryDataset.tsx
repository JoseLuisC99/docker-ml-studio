import React from 'react';
import {Alert, AlertTitle, Button, Card, CardActions, CardContent, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, List, ListItem, ListItemText, Slider, Snackbar, Stack, Typography} from "@mui/material";
import { DatasetMetadata, DatasetType, datasetTypeName } from "../Interfaces/Dataset";
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Navigate } from "react-router-dom";

const ddClient = createDockerDesktopClient()

interface DatasetProps {
    back: () => any
    dataset: DatasetMetadata
}

interface FileWithPath extends File {
    path: string
}

export function SummaryDataset({back, dataset}: DatasetProps) {
    const [val, setVal] = React.useState(20)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [dialogMsg, setDialogMsg] = React.useState('')
    const [optMsg, setOptMsg] = React.useState('')

    const [openAlert, setOpenAlert] = React.useState(false)
    const [alertTitle, setAlertTitle] = React.useState('')
    const [alertMsg, setAlertMsg] = React.useState('')

    const [redirect, setRedirect] = React.useState(false)

    const catchAlert = (title: string, msg: string) => {
        setAlertTitle(title)
        setAlertMsg(msg)
        setOpenAlert(true)
        setOpenDialog(false)
    }

    const handleCreate = () => {
        dataset.valSplit = val / 100
        
        setOpenDialog(true)

        setDialogMsg('Creating volume')
        setOptMsg(`${dataset.name}-dataset`)
        ddClient.docker.cli.exec('volume', ['create', `${dataset.name}-dataset`]).then(_ => {
            setDialogMsg('Creating container')
            setOptMsg(`${dataset.name}-helper`)
            ddClient.docker.cli.exec('run', ['-v', `${dataset.name}-dataset:/data`, '--name', `${dataset.name}-helper`, '-d', 'busybox', 'top']).then(_ => {
                setDialogMsg('Copying files to container')
                setOptMsg(dataset.file?.name || "")
                ddClient.docker.cli.exec('cp', [(dataset.file as FileWithPath).path || "", `${dataset.name}-helper:/data`]).then(async _ => {
                    if (dataset.type !== DatasetType.CSV) {
                        await ddClient.docker.cli.exec('exec', [`${dataset.name}-helper`, 'tar', '-xvf', `/data/${dataset.path}`, '-C', '/data']).catch(reason => catchAlert('Error extracting tar file', reason.stderr))
                        await ddClient.docker.cli.exec('exec', [`${dataset.name}-helper`, 'rm', `/data/${dataset.path}`]).catch(reason => catchAlert('Error removing tar file', reason.stderr))
                    }

                    setDialogMsg('Removing container')
                    setOptMsg(`${dataset.name}-helper`)
                    ddClient.docker.cli.exec('rm', ['-f', `${dataset.name}-helper`]).then(_ => {
                        let datasets = JSON.parse(localStorage.getItem('datasets') || "[]")
                        datasets = [dataset, ...datasets]
                        localStorage.setItem('datasets', JSON.stringify(datasets))
                        setOpenDialog(false)

                        // ddClient.desktopUI.dialog.showOpenDialog()
                        setRedirect(true)
                    }, reason => catchAlert('Error removing container', reason.stderr))
                }, reason => catchAlert('Error copying files', reason.stderr))
            }, reason => catchAlert('Error creating container', reason.stderr))
        }, reason => catchAlert('Error creating volume', reason.stderr))
    }

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpenAlert(false)
    }

    return <>
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
                            primary='File'
                            secondary={dataset.file?.name}
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
        <Dialog open={openDialog}>
            {/* <DialogTitle>Creating dataset</DialogTitle> */}
            <DialogContent>
                <Stack direction='row' spacing={4} justifyContent="flex-end" alignItems="center">
                    <CircularProgress />
                    <Stack>
                        <Typography variant='subtitle1' component='div'>{dialogMsg}</Typography>
                        <Typography variant='caption'>{optMsg}</Typography>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
        <Snackbar open={openAlert}>
            <Alert severity='error' onClose={handleCloseAlert}>
                <AlertTitle>{alertTitle}</AlertTitle>
                {alertMsg}
            </Alert>
        </Snackbar>
        {redirect && <Navigate to='/' />}
    </>
}