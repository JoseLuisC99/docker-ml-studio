import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface LinearLayerInput {
    data: (layerData: GenericObject) => any
}

export function LinearLayer({data}: LinearLayerInput) {
    const [inSize, setInSize] = useState<number>()
    const [outSize, setOutSize] = useState<number>()

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography style={{marginBottom: '1rem'}}>Linear layer</Typography>
            <FormControl fullWidth>
                <TextField 
                    label="Input size" 
                    variant="outlined" 
                    type="number"
                    value={inSize}
                    onChange={(e) => {
                        setInSize(Number(e.target.value))
                        data({'in': Number(e.target.value), 'out': outSize})
                    }}
                    InputProps={{
                        inputProps: {min: 1}
                    }}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField 
                    label="Output size" 
                    variant="outlined" 
                    type="number" 
                    value={outSize}
                    onChange={(e) => {
                        setOutSize(Number(e.target.value))
                        data({'in': inSize, 'out': Number(e.target.value)})
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