import * as React from 'react';
import { Box, Button, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";
import { CreateDataset } from './Cards/CreateDataset';
import { DatasetMetadata, DatasetType, PreprocessingAction, datasetTypeName } from './Interfaces/Dataset';
import { CSVDataset } from './Cards/CSVDataset';
import { SummaryDataset } from './Cards/SummaryDataset';

export function Datasets() {
    const steps = ['Select dataset type', 'Dataset preprocessing', 'Finish'];
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const [datasetInfo, setDatasetInfo] = React.useState<DatasetMetadata>({
        name: '',
        type: DatasetType.CSV,
        path: '',
        preprocessing: [],
        valSplit: 0.0,
        typeExperiment: ''
    });

    const isStepOptional = (step: number) => {
        return step === 1;
    };
    
    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const nextCreateDataset = (dataInfo: DatasetMetadata) => {
        console.log(dataInfo)
        setDatasetInfo(dataInfo);
        handleNext();
    }

    const addAction = (action: PreprocessingAction) => {
        const actions = datasetInfo.preprocessing
        actions.push(action)
        datasetInfo.preprocessing = actions
        setDatasetInfo(datasetInfo)
    }

    return (
        <>
        <AnimatedPage>
        <Stack spacing={4} alignItems='center'>
            <Box textAlign={'center'}>
                <Typography variant='h2'>Datasets</Typography>
            </Box>

            <Stepper sx={{width: '100%'}} activeStep={activeStep}>
                {steps.map((label, idx) => {
                    const stepProps: {completed?: boolean} = {};
                    const labelProps: {optional?: React.ReactNode} = {};

                    if (isStepOptional(idx)) {
                        labelProps.optional = (
                            <Typography variant='caption'>Optional</Typography>
                        );
                    }
                    if (isStepSkipped(idx)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            
            {activeStep === 0 && (
                <AnimatedPage>
                    <CreateDataset 
                        next={nextCreateDataset} dataInfo={datasetInfo}/>
                </AnimatedPage>
            )}

            {activeStep === 1 && (
                <AnimatedPage>
                    <Stack spacing={2} alignItems='center' sx={{width: '70vw', minWidth: 700}}>
                        <Stack alignItems='center'>
                            <Typography variant='h4' component='div'>{datasetTypeName(datasetInfo.type)}</Typography>
                            <Typography variant='caption' component='div'>{datasetInfo.file?.name}</Typography>
                        </Stack>
                        {datasetInfo.type === DatasetType.CSV && datasetInfo.file && (
                            <CSVDataset 
                                csvFile={datasetInfo.file}
                                addAction={addAction}
                            />
                        )}
                        {datasetInfo.type === DatasetType.Folder && <>
                            <Typography>We can not create preprocessors for Folder dataset</Typography>
                        </>}
                        <Stack direction='row' spacing={2}>
                            <Button variant='outlined' onClick={() => handleBack()}>Back</Button>
                            <Button onClick={() => handleNext()}>Next</Button>
                        </Stack>
                    </Stack>
                </AnimatedPage>
            )}

            {activeStep === 2 && datasetInfo.file && (
                <AnimatedPage>
                    <SummaryDataset back={handleBack} dataset={datasetInfo} />
                </AnimatedPage>
            )}
        </Stack>
        </AnimatedPage>
        </>
    )
}