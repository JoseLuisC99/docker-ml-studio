import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface ResnetLayerInput {
    data: (layerData: GenericObject) => any
}

export function ResnetLayer({data}: ResnetLayerInput) {

    useEffect(() => {
        data({})
    }, [])

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography>ResNet</Typography>
        </CardContent>
    </Card>
    <Handle type="target" position={Position.Right} />
    </>
}