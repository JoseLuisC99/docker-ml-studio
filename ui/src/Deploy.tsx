import { Alert, AlertTitle, Box, Button, Card, CardContent, Checkbox, CircularProgress, Dialog, DialogContent, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";
import React from "react";
import { ExperimentMetadata } from "./Interfaces/Experiments";
import { createDockerDesktopClient } from "@docker/extension-api-client";

const ddClient = createDockerDesktopClient()

interface DeployProps {
    redirect: (msg: string) => any
}

export function Deploy({redirect}: DeployProps) {
    const [experiments, setExperiments] = React.useState<ExperimentMetadata[]>([])
    const [experimentSel, setExperimentSel] = React.useState<number | string>('')
    const [inferencePort, setInferencePort] = React.useState(8080)
    const [deployName, setDeployName] = React.useState('')

    const [openDialog, setOpenDialog] = React.useState(false)
    const [dialogMsg, setDialogMsg] = React.useState('')
    const [optMsg, setOptMsg] = React.useState('')

    const [openAlert, setOpenAlert] = React.useState(false)
    const [alertTitle, setAlertTitle] = React.useState('')
    const [alertMsg, setAlertMsg] = React.useState('')

    React.useEffect(() => {
        const experimentsStr = localStorage.getItem('experiments') || '[]'
        setExperiments(JSON.parse(experimentsStr))
    }, [])

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpenAlert(false)
    }

    const catchAlert = (title: string, msg: string) => {
        setAlertTitle(title)
        setAlertMsg(msg)
        setOpenAlert(true)
        setOpenDialog(false)
    }

    const deploy = () => {
        setOpenDialog(true)
        const experiment = experiments[experimentSel as number]
        const dockerParams = [
            '--rm', '-d', '-p', `${inferencePort}:8080`,
            '-v', `${experiment.volume}:/model-store`, 
            '--name', `${deployName}-deploy`,
            'pytorch/torchserve:latest-cpu', 'torchserve',
            '--model-store', '/model-store/trained',
            '--models', `${deployName}=model.mar`
        ]

        setDialogMsg('Deploying model')
        setOptMsg(deployName)
        ddClient.docker.cli.exec('run', dockerParams).then(_ => {
            let deploys = JSON.parse(localStorage.getItem('deploys') || "[]")
            const deploy = {
                name: deployName,
                experiment: experiment.name,
                port: inferencePort
            }
            deploys = [deploy, ...deploys]
            localStorage.setItem('deploys', JSON.stringify(deploys))
            setOpenDialog(false)
            redirect('Experiment deployed')
        }, reason => catchAlert('Error deploying experiment', reason.stderr))
    }

    return (
        <>
        <AnimatedPage>
        <Stack spacing={2} alignItems='center'>
            <Typography textAlign='center' variant='h2'>Deploy</Typography>
            <Card sx={{width: 450}}>
                <CardContent>
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <TextField
                                label='Deploy name'
                                value={deployName}
                                onChange={(event) => setDeployName(event.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id='experiment-label'>Experiment</InputLabel>
                            <Select
                                labelId='experiment-label' label='Experiment'
                                value={experimentSel} onChange={(event) => setExperimentSel(event.target.value as number)}
                            >
                                {experiments.map((experiment, idx) => {
                                    return <MenuItem value={idx}>{experiment.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField
                                label='Inference Port'
                                value={inferencePort}
                                onChange={(event) => setInferencePort(Number(event.target.value))}
                                type="number" InputProps={{
                                    inputProps: { 
                                        step: 10, min: 0
                                    }
                                }}
                            />
                        </FormControl>

                        <Button onClick={deploy}>
                            Deploy model
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
        </AnimatedPage>
        <Dialog open={openDialog}>
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
        </>
    )
}