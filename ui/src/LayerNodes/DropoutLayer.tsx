import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface DropoutLayerInput {
    data: {
        type: string
        update: (layerData: GenericObject) => any
    }
}

export function DropoutLayer({data}: DropoutLayerInput) {
    const [p, setP] = useState<number>(0.5)

    useEffect(() => {
        data.update({p})
    }, [])

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography style={{marginBottom: '1rem'}}>{data.type} layer</Typography>
            <FormControl fullWidth>
                <TextField 
                    label="Probability" 
                    variant="outlined" 
                    type="number" 
                    value={p}
                    onChange={(e) => {
                        setP(Number(e.target.value))
                        data.update({
                            'p': Number(e.target.value)
                        })
                    }}
                    InputProps={{
                        inputProps: {min: 0}
                    }}
                />
            </FormControl>
        </CardContent>
    </Card>
    <Handle type="target" position={Position.Right} />
    </>
}