import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Slide,
    Box,
    Card,
    CardContent,
    Snackbar,
} from '@mui/material';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MyComponent = () => {
    const [open, setOpen] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleClickOpen = () => {
        resetTaskFields(); // Clear out any previous task data
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetTaskFields();
    };

    const resetTaskFields = () => {
        setTaskName('');
        setTaskDescription('');
        setSelectedTime('');
    };

    const handleCreate = async () => {
        const totalMinutes = parseInt(selectedTime, 10) || 0;

        try {
            await axios.post('http://localhost:8080/tasks', {
                name: taskName,
                desc: taskDescription,
                time: totalMinutes,
            });
            handleClose();
            fetchTasks();
        } catch (error) {
            console.error('There was an error creating the task!', error);
        }
    };

    const handleEdit = async () => {
        if (!selectedTask) return;
        const totalMinutes = parseInt(selectedTime, 10) || 0;

        try {
            await axios.put(`http://localhost:8080/tasks/${selectedTask.id}`, {
                name: taskName,
                desc: taskDescription,
                time: totalMinutes,
            });
            fetchTasks();
            setTaskDialogOpen(false);
            setEditMode(false);
        } catch (error) {
            console.error('There was an error updating the task!', error);
        }
    };

    const handleTimeChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setSelectedTime(value);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('There was an error fetching the tasks!', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setTaskName(task.name);
        setTaskDescription(task.desc);
        setSelectedTime(task.time);
        setTaskDialogOpen(true);
        setEditMode(false);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8080/tasks/${taskId}`);
            fetchTasks();
            setTaskDialogOpen(false);
        } catch (error) {
            console.error('There was an error deleting the task!', error);
        }
    };

    const handleCompleteTask = async () => {
        if (!selectedTask) return;

        try {
            await axios.put(`http://localhost:8080/tasks/${selectedTask.id}`, {
                ...selectedTask,
                isDone: true,
            });
            setSnackbarOpen(true);
            setTimeout(() => {
                handleDeleteTask(selectedTask.id);
            }, 2000);
            setTaskDialogOpen(false);
        } catch (error) {
            console.error('There was an error completing the task!', error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const enableEditMode = () => {
        setEditMode(true);
    };

    // Categorize tasks based on time
    const shortTasks = tasks.filter(task => task.time <= 15);
    const mediumTasks = tasks.filter(task => task.time > 15 && task.time <= 30);
    const longTasks = tasks.filter(task => task.time > 30);

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">To-Do List</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Task
                </Button>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Task Name"
                        placeholder="Task Name"
                        fullWidth
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Task Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Time (Minutes)"
                        type="number"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        inputProps={{
                            min: 0,
                            step: 1,
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Short Tasks Section */}
            <Box mt={2}>
                <Typography variant="h5">Short Tasks (0-15 mins)</Typography>
                {shortTasks.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">No Short Tasks</Typography>
                ) : (
                    shortTasks.map((task) => (
                        <Card
                            key={task.id}
                            variant="outlined"
                            style={{ marginBottom: '16px', cursor: 'pointer' }}
                            onClick={() => handleTaskClick(task)}
                        >
                            <CardContent>
                                <Typography variant="h6">{task.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{task.time} mins</Typography>
                                <Typography variant="body1" color="textSecondary">{task.desc}</Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            {/* Medium Tasks Section */}
            <Box mt={2}>
                <Typography variant="h5">Medium Tasks (16-30 mins)</Typography>
                {mediumTasks.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">No Medium Tasks</Typography>
                ) : (
                    mediumTasks.map((task) => (
                        <Card
                            key={task.id}
                            variant="outlined"
                            style={{ marginBottom: '16px', cursor: 'pointer' }}
                            onClick={() => handleTaskClick(task)}
                        >
                            <CardContent>
                                <Typography variant="h6">{task.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{task.time} mins</Typography>
                                <Typography variant="body1" color="textSecondary">{task.desc}</Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            {/* Long Tasks Section */}
            <Box mt={2}>
                <Typography variant="h5">Long Tasks (31+ mins)</Typography>
                {longTasks.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">No Long Tasks</Typography>
                ) : (
                    longTasks.map((task) => (
                        <Card
                            key={task.id}
                            variant="outlined"
                            style={{ marginBottom: '16px', cursor: 'pointer' }}
                            onClick={() => handleTaskClick(task)}
                        >
                            <CardContent>
                                <Typography variant="h6">{task.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{task.time} mins</Typography>
                                <Typography variant="body1" color="textSecondary">{task.desc}</Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            <Dialog
                open={taskDialogOpen}
                onClose={() => setTaskDialogOpen(false)}
                TransitionComponent={Transition}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Task Details</DialogTitle>
                <DialogContent>
                    {selectedTask && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Task Name"
                                fullWidth
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                disabled={!editMode}
                            />
                            <TextField
                                margin="dense"
                                label="Task Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                disabled={!editMode}
                            />
                            <TextField
                                margin="dense"
                                label="Time (Minutes)"
                                type="number"
                                value={selectedTime}
                                onChange={handleTimeChange}
                                inputProps={{
                                    min: 0,
                                    step: 1,
                                }}
                                fullWidth
                                disabled={!editMode}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCompleteTask} color="primary" disabled={selectedTask?.isDone}>
                        Complete
                    </Button>
                    {!editMode ? (
                        <Button onClick={enableEditMode} color="primary">
                            Edit
                        </Button>
                    ) : (
                        <Button onClick={handleEdit} color="primary">
                            Save
                        </Button>
                    )}
                    <Button onClick={() => handleDeleteTask(selectedTask.id)} color="secondary">
                        Delete
                    </Button>
                    <Button onClick={() => setTaskDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message="Task completed"
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
};

export default MyComponent;
