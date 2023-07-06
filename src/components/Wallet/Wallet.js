import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Grid } from '@material-ui/core';
import apiClient from '../../utils/api';
import { toast } from 'react-toastify';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [newCredit, setNewCredit] = useState('');

    useEffect(() => { 
        getBalance();
    }, [])

    const getBalance = async () => { 
        try {
            const { data: { balance } } = await apiClient.get('/wallet')
            setBalance(balance);
        } catch (error) {
            toast.error('Error getting balance');
        }
    }

    const handleAddCredit = async () => { 
        try {
            if (!newCredit) {
                toast.error('Credit is required');
                return;
            }

            const { data: { balance } } = await apiClient.post('/wallet', { credits: newCredit })
            
            setBalance(balance);
            setNewCredit('');

            toast.success('Credits added');
        } catch (error) {
            toast.error('Error add credits');
        }
    }


    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4" style={{ textAlign: 'left' }}>Balance: {balance}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="flex-end" alignItems="center">
                    <Grid item xs={12}>
                        <TextField
                            label="Add Credit"
                            variant="outlined"
                            value={newCredit}
                            onChange={e => setNewCredit(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent='flex-end'>
                        <Button variant="contained" color="primary" onClick={handleAddCredit}>
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Wallet;
