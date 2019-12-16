import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, Box } from '@material-ui/core';

import bgImage from '../assets/images/4c49d03df598d6822be307208f2333b1e9b42279.png';
import logo from '../assets/images/logo.png';
import CustomizedSnackbars from '../components/Snackbar';
import TopBar from '../components/TopBar';

const topBarHeight = 105;

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    marginTop: topBarHeight
  },
  imageContainer: {
    width: '100px',
    height: '100px',
    marginBottom: '2rem',
    margin: 'auto'
  },
  background: {
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  },
  overlay: {
    height: '100vh',
    backgroundColor: 'blue',
    opacity: '.28',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoOverlay: {
    position: 'absolute'
  },
  logoArea: {
    width: '100%',
    height: '200px',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#FFF',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  },
  logo: {
    maxHeight: '100%',
    maxWidth: '100%'
  },
  linkButton: {
    padding: theme.spacing(2, 4),
    backgroundColor: '#FFF'
  },
  paper: {
    width: 740,
    margin: theme.spacing(3)
  },
  resetPasswordBox: {
    padding: theme.spacing(1, 5),
    borderColor: '#EFEFEF'
  },
  form: {
    width: '100%'
  },
  formInput: {
    marginTop: '2rem',
    width: '100%'
  },
  login: {
    margin: theme.spacing(8, 0, 2),
    padding: theme.spacing(0.5, 2),
    color: '#38CC89',
    border: '1px solid #38CC89',
    backgroundColor: '#FFF'
  }
}));

const ResetPasswordEmailSent = (props) => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  return (
    <Grid container className={classes.root}>
      <TopBar {...props} isAuthed={props.isAuthed} setIsAuthed={props.setIsAuthed} />
      {/* <Grid item xs={false} sm={4} md={5}>
        <div className={classes.overlay}></div>
        <div className={classes.logoArea}>
          <div className={classes.imageContainer}>
            <img src={logo} alt='' className={classes.logo} />
          </div>
          <div style={{ textAlign: 'center' }}>RECEIPT TRACKER</div>
        </div>
      </Grid> */}
      <Grid container alignItems='center' item direction='column' xs={12} sm={8} md={12}>
        <div className={classes.paper}>
        <Box className={classes.resetPasswordBox} border={1}>
            {/* <Grid container justify='flex-end' alignItems='center'>
              <p style={{ margin: '1rem' }}>Don't have an account?</p>
              <Button
                variant='contained'
                className={classes.linkButton}
                href={'/signup'}
              >
                Create
              </Button>
            </Grid> */}
            <Grid container>
              <form className={classes.form}>
                <h1>Reset password email sent!</h1>
                {err.length > 0 && (
                  <CustomizedSnackbars variant='error' message={err} />
                )}
                <Typography paragraph>
                  An email with a link to reset your password has been sent to you.
                </Typography>
                <div>
                  <Grid container justify='center'>
                    <Button className={classes.login} href={"/login"}>
                      Login
                    </Button>
                  </Grid>
                </div>
              </form>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default ResetPasswordEmailSent;
