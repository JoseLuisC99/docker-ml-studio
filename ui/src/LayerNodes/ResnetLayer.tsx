import { Button, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Handle, Position } from "reactflow"
import { GenericObject } from "../Interfaces/Model"


interface ResnetLayerInput {
    data: (layerData: GenericObject) => any
}

export function ResnetLayer({data}: ResnetLayerInput) {

    return <>
    <Handle type="source" position={Position.Left} />
    <Card sx={{maxWidth: 200}}>
        <CardContent>
            <Typography style={{marginBottom: '1rem'}}>ResNet layer</Typography>
            
        </CardContent>
    </Card>
    <Handle type="target" position={Position.Right} />
    </>
}