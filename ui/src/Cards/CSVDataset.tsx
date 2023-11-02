import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Papa from 'papaparse';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { PreprocessingAction } from "../Interfaces/Dataset";

interface CSVProps {
    csvFile: File,
    addAction: (action: PreprocessingAction) => any
}

export function CSVDataset({csvFile, addAction}: CSVProps) {
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    const [tasks, setTasks] = useState([])
    const [dialog, setDialog] = useState(false)
    const [newAction, setNewAction] = useState("")
    const [fieldSelected, setFieldSelected] = useState("")

    const loadCSVFile = (csvFile: File) => {
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            preview: 50,
            complete: (results) => {
                const rows = results.data.map((rowData, index) => ({
                    id: index + 1, ...rowData,
                }))
                const columns = results.meta.fields?.map((field, index) => ({
                    field, headerName: field, width: 150,
                }))

                setColumns(columns)
                setRows(rows)
            }
        })
    }

    const handleCloseDialog = () => {
        setFieldSelected('')
        setNewAction('')
        setDialog(false)
    }
    const handleOpenDialog = () => {setDialog(true)}
    const handleChangeAction = (event: SelectChangeEvent) => {
        setNewAction(event.target.value)
    }
    const handleFieldSelected = (event: SelectChangeEvent) => {
        setFieldSelected(event.target.value)
    }
    const addPreprocessingAction = () => {
        setTasks([
            {id: tasks.length, action: newAction, field: fieldSelected}, ...tasks
        ])
        addAction({field: fieldSelected, action: newAction})
        handleCloseDialog()
    }

    useEffect(() => {
        loadCSVFile(csvFile)
    }, [])

    return <>
    <Card sx={{width: '80%'}}>
        <CardContent>
            <Stack spacing={2}>
                <Typography variant="h4" textAlign="center">Dataset sample</Typography>
                {rows.length > 0 && (
                    <DataGrid 
                        rows={rows} columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 }
                            }
                        }}
                        pageSizeOptions={[rows.length]}
                    ></DataGrid>
                )}
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenDialog}>
                    Add preprocessing action
                </Button>
                <List>
                    {tasks.map((task, idx) => {
                        return <>
                            <ListItem alignItems="flex-start">
                                <ListItemText primary={task.action} secondary={task.field} />
                            </ListItem>
                            <Divider />
                        </>
                    })}
                </List>
            </Stack>
        </CardContent>
    </Card>
    <Dialog open={dialog} onClose={handleCloseDialog}>
        <DialogTitle>New preprocessing action</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <DialogContentText>
                    The preprocessing action will be executed in the training process and not when we create the volume.
                </DialogContentText>
                <FormControl fullWidth>
                    <InputLabel id="preprocessing-label">Preprocessing action</InputLabel>
                    <Select
                        labelId="preprocessing-label"
                        id="preprocessing-action"
                        value={newAction}
                        label="Preprocessing action"
                        onChange={handleChangeAction}
                    >
                        <MenuItem value={"Normalize"}>Normalize</MenuItem>
                        <MenuItem value={"OneHot"}>One-hot encoding</MenuItem>
                        <MenuItem value={"Word2Vec"}>Word2vec</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="field-label">Field</InputLabel>
                    <Select
                        labelId="field-label"
                        id="preprocessing-field"
                        value={fieldSelected}
                        label="Field"
                        onChange={handleFieldSelected}
                    >
                        {columns.map((feat, idx) => {
                            return (
                                <MenuItem value={feat.field}>{feat.headerName}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={addPreprocessingAction}>Add</Button>
        </DialogActions>
    </Dialog>
    </>
}