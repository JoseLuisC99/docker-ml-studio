import { Box, Stack, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { useState, useCallback } from 'react';
import ReactFlow, {Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge, Node, Edge} from 'reactflow';
import 'reactflow/dist/style.css';


const linearLayers = [
    <Button key="linear">Linear layer</Button>
];

const convLayers = [
    <Button key="conv2d">Conv layer 2D</Button>
];

const poolLayers = [
    <Button key="maxpool2d">Max pool 2D</Button>,
    <Button key="avgpool2d">Avg pool 2D</Button>
];

const normalizationLayers = [
    <Button key="batchnorm2d">Batch norm 2D</Button>
];

const dropoutLayers = [
    <Button key="dropout">Dropout</Button>
];
  
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
    const [newNodeInput1, setNewNodeInput1] = useState('');
    const [newNodeInput2, setNewNodeInput2] = useState('');

    const handleClickLinear = () => {
        alert("Nodo lineal agregado");

        const newNode = {
          id: `node-${idCounter}`, // Un ID único para el nodo
          type: 'default', // Tipo de nodo (puede ser personalizado)
          data: {
            label: (
              <div>
                <h3>Linear</h3>
                <p>Input:</p>
                <p>Output:</p>
                <button onClick={() => alert('Botón dentro del nodo')}>Haz clic</button>
              </div>
            ),
          }, // Datos del nodo
          position: { x: 50, y: 50 }, // Posición del nodo en el diagrama
        };
    
        setElements((prevElements) => [...prevElements, newNode]);
        setIdCounter(idCounter + 1); // Incrementar el contador
      };
    
    const handleClickConv = () => {
        alert("Nodo Convolucional agregado");
        
        const newNode = {
          id: `node-${idCounter}`, // Un ID único para el nodo
          type: 'default', // Tipo de nodo (puede ser personalizado)
          data: {
            label: (
              <div>
                <h3>Convolucional</h3>
                <p>Input:</p>
                <p>Output:</p>
              </div>
            ),
          }, // Datos del nodo
          position: { x: 70, y: 70 }, // Posición del nodo en el diagrama
        };
    
        setElements((prevElements) => [...prevElements, newNode]);
        setIdCounter(idCounter + 1); // Incrementar el contador
    };

    const handleClickBatchNorm = () => {
        alert("Nodo Batch Norm 2D agregado");
        
        const newNode = {
          id: `node-${idCounter}`, // Un ID único para el nodo
          type: 'default', // Tipo de nodo (puede ser personalizado)
          data: {
            label: (
              <div>
                <h3>Batch Norm 2D</h3>
                <p>Num Feat:</p>
              </div>
            ),
          }, // Datos del nodo
          position: { x: 70, y: 70 }, // Posición del nodo en el diagrama
        };
    
        setElements((prevElements) => [...prevElements, newNode]);
        setIdCounter(idCounter + 1); // Incrementar el contador
    };
    
    const [edges, setEdges] = useState<Edge<any>[]>([]);
    const [variant, setVariant] = useState('lines');
    
    const onNodesChange = useCallback(
        (changes: any) => setElements((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

    return (
        <>
        <AnimatedPage>
        <Stack spacing={2}>
            <Typography variant='h2'>Model builder</Typography>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Item>Layers</Item>
                    <Item>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                <Typography>Linear</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="contained"
                                    onClick={handleClickLinear}
                                >
                                    {linearLayers}
                                </ButtonGroup>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Item>
                    <Item>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                <Typography>Convolution</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="contained"
                                onClick={handleClickConv} >
                                    {convLayers}
                                </ButtonGroup>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Item>
                    <Item>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                <Typography>Pooling</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="contained">
                                    {poolLayers}
                                </ButtonGroup>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Item>
                    <Item>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                <Typography>Normalization</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="contained"
                                onClick={handleClickBatchNorm}>
                                    {normalizationLayers}
                                </ButtonGroup>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Item>
                    <Item>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                <Typography>Dropout</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="contained">
                                    {dropoutLayers}
                                </ButtonGroup>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Item>

                </Grid>
                <Grid item xs={10}>
                        <Item>
                        <div style={{ height: '80vh', width:'100%'}}>
                        <ReactFlow 
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
        </Stack>
        </AnimatedPage>
        </>
    )
}