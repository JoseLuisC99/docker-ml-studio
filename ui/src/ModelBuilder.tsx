import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemIcon, ListItemText, MenuItem, MenuList, Stack, TextField, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge, Node, Edge} from 'reactflow';
import 'reactflow/dist/style.css';
import { LinearLayer } from "./LayerNodes/LinearLayer";
import { GenericObject } from "./Interfaces/Model";
import { Conv2dLayer } from "./LayerNodes/Conv2dLayer";
import { Pooling2dLayer } from "./LayerNodes/Pooling2dLayer";
import { Normalization2dLayer } from "./LayerNodes/NormalizationLayers";


interface LayerButtonInfo {
    key: string
    title: string
    click: () => any
}
  
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export function ModelBuilder() {
    const [elements, setElements] = useState<Node<any>[]>([]);
    const [idCounter, setIdCounter] = useState(0);
    const [layers, setLayers] = useState<{[key: string]: GenericObject}>({})
    const [saveDialog, setSaveDialog] = useState(false)
    const [modelName, setModelName] = useState('')
    const [description, setDescription] = useState('')

    const layerTypes = useMemo(() => ({
        'linearLayer': LinearLayer,
        'conv2dLayer': Conv2dLayer,
        'pooling2dLayer': Pooling2dLayer,
        'normalization2dLayer': Normalization2dLayer
    }), []);

    const saveModel = () => {
        const targets: string[] = []
        const edgesMap: {[key: string]: string} = {}
        for (let edge of edges) {
            targets.push(edge.target)
            edgesMap[edge.source] = edge.target
        }
        
        const inputs: string[] = []
        for (let node of elements) {
            if (!targets.includes(node.id))
                inputs.push(node.id)
        }

        const sequential: {[key: string]: GenericObject}[] = []
        let nextLayer: string = inputs[0]
        while (nextLayer) {
            sequential.push(layers[nextLayer])
            nextLayer = edgesMap[nextLayer]
        }
        sequential.reverse()
        console.log(sequential)

        const newModel = {
            name: modelName,
            description: description,
            layers: sequential
        }

        let models = JSON.parse(localStorage.getItem('models') || "[]")
        models = [newModel, ...models]
        localStorage.setItem('models', JSON.stringify(models))

        setModelName('')
        setDescription('')
        setSaveDialog(false)
    }

    const addLayer = (idLayer: string, node: Node<any>) => {
        const oldLayers = layers
        oldLayers[idLayer] = {}
        setLayers(oldLayers)

        setElements(prev => [...prev, node])
        setIdCounter(idCounter + 1)
    }
    
    const generateNodeEvent = (type: string, id: string) => {
        return (data: GenericObject) => {
            const oldLayers = layers
            oldLayers[id] = {'type': type, ...data}
            setLayers(oldLayers)
        }
    }

    const handleClickLinear = () => {
        const idLayer = `node-${idCounter}`
        const newNode = {
            id: idLayer,
            type: 'linearLayer',
            position: { x: 70, y: 70 },
            data: generateNodeEvent('linear', idLayer)
        };
    
        addLayer(idLayer, newNode)
    };
    
    const handleClickConv = () => {
        const idLayer = `node-${idCounter}`
        const newNode = {
            id: idLayer,
            type: 'conv2dLayer',
            position: { x: 70, y: 70 },
            data: generateNodeEvent('conv2d', idLayer)
        };
    
        addLayer(idLayer, newNode)
    };

    const handleClickPoolLayer = (type: string) => {
        const idLayer = `node-${idCounter}`
        const newNode = {
            id: idLayer,
            type: 'pooling2dLayer',
            position: { x: 70, y: 70 },
            data: {
                type: type,
                update: generateNodeEvent(type.toLowerCase(), idLayer)
            }
        };
    
        addLayer(idLayer, newNode)
    }

    const handleClickNormalizationLayer = (type: string) => {
        const idLayer = `node-${idCounter}`
        const newNode = {
            id: idLayer,
            type: 'normalization2dLayer',
            position: { x: 70, y: 70 },
            data: {
                type: type,
                update: generateNodeEvent(type.toLowerCase(), idLayer)
            }
        };
    
        addLayer(idLayer, newNode)
    }

    
    const [edges, setEdges] = useState<Edge<any>[]>([]);
    const onNodesChange = useCallback(
        (changes: any) => setElements((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

    // Layer definitions
    const linearLayers: LayerButtonInfo[] = [
        {key: 'linear', title: 'Linear Layer', click: handleClickLinear}
    ];
    const convLayers: LayerButtonInfo[] = [
        {key: 'conv2d', title: 'Conv2D Layer', click: handleClickConv}
    ];
    const poolLayers = [
        {key: 'maxpool2d', title: 'MaxPool 2D', click: () => handleClickPoolLayer('Max2D')},
        {key: 'avgpool2d', title: 'AvgPool 2D', click: () => handleClickPoolLayer('Avg2D')},
    ];
    const normLayers = [
        {key: 'batchnorm2d', title: 'BatchNorm 2D', click: () => handleClickNormalizationLayer('BatchNorm2d')},
    ];
    

    return (
        <>
        <AnimatedPage>
        <Stack spacing={2}>
            <Typography variant='h2' textAlign='center'>Model builder</Typography>
            <Grid container>
                <Grid item xs={12} lg={2}>
                    <Accordion style={{margin: 0}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{fontWeight: 'bold'}}>Linear</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MenuList>
                                {linearLayers.map((layer, idx) => {
                                    return <MenuItem onClick={layer.click}>
                                        <ListItemText>{layer.title}</ListItemText>
                                    </MenuItem>
                                })}
                            </MenuList>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion style={{margin: 0}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{fontWeight: 'bold'}}>Convolution</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MenuList>
                                {convLayers.map((layer, idx) => {
                                    return <MenuItem onClick={layer.click}>
                                        <ListItemText>{layer.title}</ListItemText>
                                    </MenuItem>
                                })}
                            </MenuList>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion style={{margin: 0}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                            <Typography style={{fontWeight: 'bold'}}>Pooling layers</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MenuList>
                                {poolLayers.map((layer, idx) => {
                                    return <MenuItem onClick={layer.click}>
                                        <ListItemText>{layer.title}</ListItemText>
                                    </MenuItem>
                                })}
                            </MenuList>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion style={{margin: 0}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                            <Typography style={{fontWeight: 'bold'}}>Normalization layers</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MenuList>
                                {normLayers.map((layer, idx) => {
                                    return <MenuItem onClick={layer.click}>
                                        <ListItemText>{layer.title}</ListItemText>
                                    </MenuItem>
                                })}
                            </MenuList>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} lg={10}>
                        <Item>
                        <div style={{ height: '70vh', width:'100%'}}>
                        <ReactFlow
                            nodeTypes={layerTypes}
                            nodes={elements}
                            onNodesChange={onNodesChange}
                            edges={edges}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                        > 
                            <Background />
                            <Controls />
                        </ReactFlow>
                        </div>
                    </Item>
                </Grid>
            </Grid>
            <Button onClick={() => setSaveDialog(true)}>Save model</Button>
        </Stack>
        </AnimatedPage>
        <Dialog open={saveDialog} onClose={() => setSaveDialog(false)}>
            <DialogTitle>Save model</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText>
                        To save to this model, please enter a unique name and a description.
                    </DialogContentText>
                    <TextField
                        autoFocus fullWidth
                        label="Model's name"
                        value={modelName}
                        onChange={e => setModelName(e.target.value)}
                    />
                    <TextField
                        label='Description'
                        placeholder='Brief description of the model'
                        rows={4}
                        multiline
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setSaveDialog(false)}>Cancel</Button>
                <Button onClick={saveModel}>Save model</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}