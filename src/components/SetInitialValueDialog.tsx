import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useCounterContext } from '../context/CounterContext';

interface SetInitialValueDialogProps {
    open: boolean;
    onClose: () => void;
}

const SetInitialValueDialog: React.FC<SetInitialValueDialogProps> = ({ open, onClose }) => {
    const { setInitialValue } = useCounterContext();
    const [initialValue, setInitialValueInput] = useState<number | ''>('');

    const handleSubmit = () => {
        if (typeof initialValue === 'number') {
            setInitialValue(initialValue);
            setInitialValueInput(''); // Reset input field
            onClose(); // Close the dialog
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>设置初始值</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="初始值"
                    type="number"
                    fullWidth
                    value={initialValue}
                    onChange={(e) => setInitialValueInput(Number(e.target.value) || '')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    取消
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SetInitialValueDialog;
