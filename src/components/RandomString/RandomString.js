import React, { useState } from 'react';
import { Button, TextField, Grid, InputAdornment } from '@material-ui/core';
import { FileCopy as FileCopyIcon } from '@material-ui/icons';
import apiClient from '../../utils/api';
import { toast } from 'react-toastify';

const RandomString = () => {
    const [randomString, setRandomString] = useState('');
    const [stringSize, setStringSize] = useState('');

    const generateRandomString = async () => {
        try {
            if (!stringSize) {
                toast.error('String size is required');
                return;
            }

            const { data: { result } } = await apiClient.post('/random-string', { length: stringSize });
            setRandomString(result);
        } catch (error) {
            console.log(error);
            toast.error('Error executing operation');
            return {}
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(randomString);
    };

    const handleStringSizeChange = (event) => {
        setStringSize(event.target.value);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} className>
                <TextField
                    label="String Size"
                    variant="outlined"
                    value={stringSize}
                    onChange={handleStringSizeChange}
                    type='number'
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} className>
                <TextField
                    label="Random String"
                    variant="outlined"
                    value={randomString}
                    disabled
                    fullWidth
                    style={{ marginTop: '10px' }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button variant="contained" color="default" onClick={copyToClipboard}>
                                    <FileCopyIcon />
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={generateRandomString}>
                    Generate
                </Button>
            </Grid>
        </Grid>
    );
};

export default RandomString;
