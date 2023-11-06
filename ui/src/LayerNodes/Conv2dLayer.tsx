import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface Conv2dLayerInput {
    data: (layerData: GenericObject) => any
}

export function Conv2dLayer({data}: Conv2dLayerInput) {
    const [inSize, setInSize] = useState<number>()
    const [outSize, setOutSize] = useState<number>()
    const [kernel, setKernel] = useState<number>()
    const [stride, setStride] = useState<number>()
    const [padding, setPadding] = useState<number>()

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography style={{marginBottom: '1rem'}}>Conv2D layer</Typography>
            <FormControl fullWidth>
                <TextField 
                    label="Input chanels" 
                    variant="outlined" 
                    type="number"
                    value={inSize}
                    onChange={(e) => {
                        setInSize(Number(e.target.value))
                        data({
                            'in': Number(e.target.value), 
                            'out': outSize,
                            'kernel': kernel,
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
                    label="Output chanels" 
                    variant="outlined" 
                    type="number" 
                    value={outSize}
                    onChange={(e) => {
                        setOutSize(Number(e.target.value))
                        data({
                            'in': inSize, 
                            'out': Number(e.target.value),
                            'kernel': kernel,
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
                    label="Kernel size" 
                    variant="outlined" 
                    type="number" 
                    value={kernel}
                    onChange={(e) => {
                        setKernel(Number(e.target.value))
                        data({
                            'in': inSize, 
                            'out': outSize,
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
                        data({
                            'in': inSize, 
                            'out': outSize,
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
                        data({
                            'in': inSize, 
                            'out': outSize,
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