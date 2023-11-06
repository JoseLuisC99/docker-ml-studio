import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface Normalization2dLayerInput {
    data: {
        type: string
        update: (layerData: GenericObject) => any
    }
}

export function Normalization2dLayer({data}: Normalization2dLayerInput) {
    const [numFeat, setNumFeat] = useState<number>()

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
                    value={numFeat}
                    onChange={(e) => {
                        setNumFeat(Number(e.target.value))
                        data.update({
                            'num_feat': Number(e.target.value)
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