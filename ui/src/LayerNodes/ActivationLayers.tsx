import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface ActivationLayerInput {
    data: {
        type: string
        update: (layerData: GenericObject) => any
    }
}

export function ActivationLayer({data}: ActivationLayerInput) {

    useEffect(() => {
        data.update({})
    }, [])

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography>{data.type} layer</Typography>
        </CardContent>
    </Card>
    <Handle type="target" position={Position.Right} />
    </>
}