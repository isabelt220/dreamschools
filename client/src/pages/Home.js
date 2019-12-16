import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CssBaseline, Drawer } from "@material-ui/core";

import TopBar from "../components/TopBar";
import SchoolListing from "../components/SchoolListing";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  }
}));

const Home = (props) => {
  const classes = useStyles();
  const [schoolData, setSchoolData] = useState([]);

  useEffect(() => {
    const fetchAllSchools = async () => {
      const response = await fetch('/school/');
      const jsonSchoolResponse = await response.json();
      console.log(jsonSchoolResponse);

      await setSchoolData(jsonSchoolResponse);
    };

    fetchAllSchools();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer variant='permanent'>
        <TopBar {...props} isAuthed={props.isAuthed} setIsAuthed={props.setIsAuthed} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <SchoolListing schoolData={schoolData} schoolId={props.schoolId} setSchoolId={props.setSchoolId} />
      </main>
    </div>
  );
}

export default Home;
