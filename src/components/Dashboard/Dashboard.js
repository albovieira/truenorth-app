

import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import apiClient from '../../utils/api';

const Dashboard = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [operations, setOperations] = useState([]);

    useEffect(() => {
        getReport();
    }, [])

    const getReport = async () => {
        try {
            const response = await apiClient.get('/report');

            const { totalRecords, spent, totalCreditsAdded, operations } = response.data;

            setTotalRecords(totalRecords || 0);
            setTotalSpent(spent || 0);
            setOperations(operations || []);

        } catch (error) {
            console.log(error);
            toast.error('Error executing operation');
            return {}
        }
    }

    return (
        <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} style={{ height: '100%' }}>
                    <Typography variant="h6">Records</Typography>
                    <Typography variant="h4">{totalRecords}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} style={{ height: '100%' }}>
                    <Typography variant="h6">Total Spent</Typography>
                    <Typography variant="h4">{totalSpent}</Typography>
                </Paper>
            </Grid>
            {operations.map((operation, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} style={{ height: '' }}>
                            <Typography variant="h6">{operation.operation}</Typography>
                            <Typography variant="h4">
                                {operation._count}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
        </Grid>


    );
};

export default Dashboard;
