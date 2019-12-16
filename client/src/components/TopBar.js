import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Paper, Link } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

import logo from "../assets/images/logo.png";

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "white",
    padding: 10,
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      height: 105
    }
  },
  title: {
    flexGrow: 1
  },
  create: {
    color: "lightgreen",
    padding: theme.spacing(0.5, 2),
    marginRight: 20
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  profileButton: {

  },
  imgContainer: {
    width: 300,
    marginTop: 5,
    marginLeft: 30
  },
  logo: {
    width: "100%"
  }
}));

const TopBar = (props) => {
  const classes = useStyles();

  const logout = () => {
    localStorage.clear();
    props.setIsAuthed(false);
    document.location.reload();
  }

  let btn;
  if (props.isAuthed) {
    btn = (<div><Button className={classes.profileButton}><AccountCircleIcon />Profile</Button>
           <Button onClick={logout}>Logout</Button>
           <Button href={'/create-school'} variant="outlined" className={classes.create}>Create</Button></div>)
  } else {
    btn = <Button href={'/login'}>Login</Button>
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <div className={classes.title}>
            <div className={classes.imgContainer}>
              <img src={logo} alt='pic' className={classes.logo} />
            </div>
          </div>
          {/* <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title}></Typography>
          {/* <Button variant="outlined" className={classes.create}>Create</Button> */}
          <Button className={classes.home} href={'/'}>Home</Button>
          {/* <Button><AccountCircleIcon />Profile</Button> */}
          {btn}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopBar;
