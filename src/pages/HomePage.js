import React from 'react';
import { Grid } from '@material-ui/core';
import Dashboard from '../components/Dashboard/Dashboard'
import Wallet from '../components/Wallet/Wallet'

const HomePage = () => {
  return (
    <div>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Wallet />
        </Grid>
      </Grid>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Dashboard />
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
