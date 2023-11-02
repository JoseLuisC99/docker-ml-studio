import React, { useState, ChangeEvent } from 'react';
import { styled } from '@mui/material/styles';
import {Button, Card, CardActions, CardContent, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import { DatasetMetadata, DatasetType } from "../Interfaces/Dataset";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface DatasetProps {
    next: (dataInfo: DatasetMetadata) => any
    dataInfo: DatasetMetadata
}

interface FormErrors {
    name?: string
    type?: string
    description?: string
    file?: string
}

export function CreateDataset({next, dataInfo}: DatasetProps) {
    const [name, setName] = React.useState(dataInfo.name)
    const [type, setType] = React.useState(dataInfo.type)
    const [description, setDescription] = React.useState(dataInfo.description)
    const [file, setFile] = React.useState<File | undefined>(dataInfo.file)
    const [errors, setErrors] = React.useState<FormErrors>()

    const validate = () => {
        const errors: FormErrors = {}

        if (!name)
            errors.name = 'Name is required'
        if (!type)
            errors.type = 'Type is required'
        if (!file)
            errors.file = 'File is required'
        if (description && description.length > 255)
            errors.description = 'The maximum description length is 255 characters'

        setErrors(errors)
    }

    const isValid = () => {
        return !!errors
    }

    return (
        <Card sx={{width: 450}}>
            <CardContent>
                <FormControl fullWidth>
                    <TextField
                        id='name-dataset'
                        label='Name'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        error={!!errors?.name}
                        helperText={errors?.name}
                    />
                </FormControl>

                <FormControl fullWidth error={!!errors?.type}>
                    <InputLabel id="type-dataset-label">Type</InputLabel>
                    <Select
                        labelId='type-dataset-label'
                        label="Type" value={type}
                        onChange={(event) => setType(event.target.value as DatasetType)}
                    >
                        <MenuItem value={DatasetType.CSV}>CSV file</MenuItem>
                        <MenuItem value={DatasetType.Image}>Image dataset</MenuItem>
                        <MenuItem value={DatasetType.Folder}>Folder dataset</MenuItem>
                    </Select>
                    <FormHelperText>{errors?.type}</FormHelperText>
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id='description-dataset'
                        label='Description'
                        placeholder='Brief description of the data set'
                        rows={4}
                        multiline
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        error={!!errors?.description}
                        helperText={errors?.description}
                    />
                </FormControl>

                <FormControl fullWidth error={!!errors?.file}>
                    <Button
                        component='label' variant='outlined'
                        startIcon={<CloudUploadTwoToneIcon />}
                        color={!!errors?.file ? 'error' : 'primary'}
                    >
                        Upload dataset
                        {type === DatasetType.CSV && (
                            <VisuallyHiddenInput 
                                onChange={(event) => setFile(event.target.files?.[0])}
                                type='file' accept='text/csv' />
                        )}
                        {type !== DatasetType.CSV && (
                            <VisuallyHiddenInput 
                                onChange={(event) => setFile(event.target.files?.[0])}
                                type='file' directory webkitdirectory />
                        )}
                    </Button>
                    <FormHelperText>{errors?.file}</FormHelperText>
                </FormControl>
            </CardContent>
            <CardActions
                disableSpacing
                sx={{
                    alignSelf: "stretch",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start"
                }}
            >
                <Button onClick={() => {
                    validate()
                    if (isValid()) {
                        next({name, type, description, file, preprocessing: [], valSplit: 0.0})
                    }
                }}>
                    Next
                </Button>
            </CardActions>
        </Card>
    )
}