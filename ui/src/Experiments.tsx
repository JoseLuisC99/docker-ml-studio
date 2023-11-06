import { Button, Card, CardContent, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Slider, Stack, TextField, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";
import React, { useEffect } from "react";
import { DatasetMetadata } from "./Interfaces/Dataset";
import { ModelMetadata } from "./Interfaces/Model";
import Checkbox from '@mui/material/Checkbox';

const marks = [
    {value: 0.001, label: '0.001'},
    {value: 0.05, label: '0.05'},
    {value: 0.1, label: '0.1'},
    {value: 0.5, label: '0.5',},
];

export function Experiments() {
    const [dataset, setDataset] = React.useState<number | string>('')
    const [model, setModel] = React.useState<number | string>('')
    const [lr, setLr] = React.useState<number>(0.001)
    const [optimizer, setOptimizer] = React.useState('')
    const [loss, setLoss] = React.useState('')
    const [epochs, setEpochs] = React.useState(10)
    const [useGPU, setUseGPU] = React.useState(false)

    const [datasets, setDatasets] = React.useState<DatasetMetadata[]>([])
    const [models, setModels] = React.useState<ModelMetadata[]>([])

    useEffect(() => {
        const datasetsStr = localStorage.getItem('datasets') || '[]'
        setDatasets(JSON.parse(datasetsStr))
    }, [])

    useEffect(() => {
        const modelsStr = localStorage.getItem('models') || '[]'
        setModels(JSON.parse(modelsStr))
    }, [])

    return (
        <>
        <AnimatedPage>
        <Stack spacing={2} alignItems='center'>
            <Typography variant='h2' textAlign='center'>Experiments</Typography>
            <Card sx={{width: 450}}>
                <CardContent>
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id='dataset-label'>Dataset</InputLabel>
                            <Select
                                labelId='dataset-label' label='Dataset'
                                value={dataset} onChange={(event) => setDataset(event.target.value as number)}
                            >
                                {datasets.map((dataset, idx) => {
                                    return <MenuItem value={idx}>{dataset.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id='model-label'>Model</InputLabel>
                            <Select
                                labelId='model-label' label='Model'
                                value={model} onChange={(event) => setModel(event.target.value as number)}
                            >
                                {models.map((model, idx) => {
                                    return <MenuItem value={idx}>{model.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth style={{padding: '0px 1rem'}}>
                            <Typography gutterBottom>
                                Learning rate: {lr}
                            </Typography>
                            <Slider
                                aria-label='Validation split'
                                value={lr}
                                valueLabelDisplay='auto'
                                step={0.02495}
                                marks={marks}
                                min={0.001}
                                max={0.5}
                                onChange={(_ , val) => {setLr(val as number)}}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id='optimizer-label'>Optimizer</InputLabel>
                            <Select
                                labelId='optimizer-label' label='Optimizer'
                                value={optimizer} onChange={(event) => setOptimizer(event.target.value)}
                            >
                                <MenuItem value='sgd'>Stochastic Gradient Descent</MenuItem>
                                <MenuItem value='adam'>Adam</MenuItem>
                                <MenuItem value='adamw'>AdamW</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id='loss-label'>Loss function</InputLabel>
                            <Select
                                labelId='loss-label' label='Loss function'
                                value={loss} onChange={(event) => setLoss(event.target.value)}
                            >
                                <MenuItem value='cross_entropy'>Cross Entropy</MenuItem>
                                <MenuItem value='bce'>Binary Cross Entropy</MenuItem>
                                <MenuItem value='mse'>Mean Square Error</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField
                                label='Epochs'
                                value={epochs}
                                onChange={(event) => setEpochs(Number(event.target.value))}
                                type="number" InputProps={{
                                    inputProps: { 
                                        step: 10, min: 0
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControlLabel
                            label="Use GPU"
                            control={<Checkbox checked={useGPU} onChange={e => setUseGPU(e.target.checked)}/>}
                        />

                        <Button>
                            Launch experiment
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
        </AnimatedPage>
        </>
    )
}