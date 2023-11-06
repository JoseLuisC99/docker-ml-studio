import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface RecurrentLayerInput {
    data: {
        type: string
        update: (layerData: GenericObject) => any
    }
}

export function RecurrentLayer({data}: RecurrentLayerInput) {
    const [inSize, setInSize] = useState<number>()
    const [hidden, setHidden] = useState<number>()

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography style={{marginBottom: '1rem'}}>{data.type} layer</Typography>
            <FormControl fullWidth>
                <TextField 
                    label="In size" 
                    variant="outlined" 
                    type="number" 
                    value={inSize}
                    onChange={(e) => {
                        setInSize(Number(e.target.value))
                        data.update({
                            'in': Number(e.target.value),
                            'hiddent': hidden
                        })
                    }}
                    InputProps={{
                        inputProps: {min: 1}
                    }}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField 
                    label="Hidden" 
                    variant="outlined" 
                    type="number" 
                    value={hidden}
                    onChange={(e) => {
                        setHidden(Number(e.target.value))
                        data.update({
                            'in': inSize,
                            'hiddent': Number(e.target.value)
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