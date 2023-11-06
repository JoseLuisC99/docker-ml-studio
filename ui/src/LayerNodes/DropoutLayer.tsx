import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface DropoutLayerInput {
    data: {
        type: string
        update: (layerData: GenericObject) => any
    }
}

export function DropoutLayer({data}: DropoutLayerInput) {
    const [layerSignature, setLayerSignature] = useState<number>()

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography style={{marginBottom: '1rem'}}>{data.type} layer</Typography>
            <FormControl fullWidth>
                <TextField 
                    label="Layer signature" 
                    variant="outlined" 
                    type="number" 
                    value={layerSignature}
                    onChange={(e) => {
                        setLayerSignature(Number(e.target.value))
                        data.update({
                            'layer_signature': Number(e.target.value)
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