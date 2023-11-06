import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface Pooling2dLayerInput {
    data: {
        type: string
        update: (layerData: GenericObject) => any
    }
}

export function Pooling2dLayer({data}: Pooling2dLayerInput) {
    const [kernel, setKernel] = useState<number>()
    const [stride, setStride] = useState<number>()
    const [padding, setPadding] = useState<number>()

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography style={{marginBottom: '1rem'}}>{data.type} layer</Typography>
            <FormControl fullWidth>
                <TextField 
                    label="Kernel size" 
                    variant="outlined" 
                    type="number" 
                    value={kernel}
                    onChange={(e) => {
                        setKernel(Number(e.target.value))
                        data.update({
                            'kernel': Number(e.target.value),
                            'stride': stride,
                            'padding': padding
                        })
                    }}
                    InputProps={{
                        inputProps: {min: 1}
                    }}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField 
                    label="Stride size" 
                    variant="outlined" 
                    type="number" 
                    value={stride}
                    onChange={(e) => {
                        setStride(Number(e.target.value))
                        data.update({
                            'kernel': kernel,
                            'stride': Number(e.target.value),
                            'padding': padding
                        })
                    }}
                    InputProps={{
                        inputProps: {min: 1}
                    }}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField 
                    label="Padding size" 
                    variant="outlined" 
                    type="number" 
                    value={padding}
                    onChange={(e) => {
                        setPadding(Number(e.target.value))
                        data.update({
                            'kernel': kernel,
                            'stride': stride,
                            'padding': Number(e.target.value)
                        })
                    }}
                    InputProps={{
                        inputProps: {min: 1}
                    }}
                />
            </FormControl>
        </CardContent>
    </Card>
    <Handle type="target" position={Position.Right} />
    </>
}