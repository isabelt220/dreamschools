import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Toolbar, Typography, Box, Paper, Grid, Button, CardMedia } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import SchoolPage from "../pages/SchoolPage";

const topBarHeight = 105;

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
    marginTop: topBarHeight
  },
  table: {
    minWidth: 650
  },
  schoolItem: {
    width: 700,
    margin: theme.spacing(2)
  },
  schoolImage: {
    maxWidth: 200,
  },
  item: {
    width: '100%'
  },
  entry: {
    minWidth: 450
  },
  itemContent: {
    margin: theme.spacing(2)
  }
}));

export default function SchoolListing({
  schoolData: { schools },
  // schoolData: { schools = [{'id': 1, 'school_name': 'Little Stars', 'about': 'This is a school for all the little stars that shine bright in the sky.', 'location': '123 Little Stars Ave, Toronto, ON', 'admission': '1) Apply for Little Stars daycare 2) Submit application 3) Wait for application response 4) Attend Little Stars daycare!', 'image_url': ''},
  // {'id': 2, 'school_name': 'Little Stars', 'about': 'This is a school for all the little stars that shine bright in the sky.', 'location': '123 Little Stars Ave, Toronto, ON', 'admission': '1) Apply for Little Stars daycare 2) Submit application 3) Wait for application response 4) Attend Little Stars daycare!', 'image_url': ''}]},
  schoolId: schoolId,
  setSchoolId: setSchoolId
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Table className={classes.table} aria-label='simple table'>
        <Grid container justify='space-between' direction='column'>
          {schools &&
            schools.map(data => (
              <Grid className={classes.item} align='center' direction='row' item>
                <Button href={`/school/${data.id}`} variant='outlined' className={classes.schoolItem} key={data.id} onClick={setSchoolId(data.id)}>
                  {/* <Button variant='outlined'> */}
                    <Grid container item justify='flex-start'>
                      <Box><img className={classes.schoolImage} src={String(data.image_url).slice(1,-1)} /></Box>
                    </Grid>
                    <Grid container item justify='space-between' className={classes.entry} direction='column'>
                      <Grid container justify='flex-start'><h3>{data.school_name}</h3></Grid>
                      <Grid container justify='flex-start'>About: {data.about}</Grid>
                      <Grid container justify='flex-start'>
                        Location: {data.location}
                      </Grid>
                    </Grid>
                  {/* </Button> */}
                </Button>
              </Grid>
            ))}
        </Grid>
      </Table>
      {/* <BrowserRouter>
          <Route path={`/school/`}
            render={props => {
              return (
                <SchoolPage
                  {...props}
                  isAuthed={props.isAuthed}
                  setIsAuthed={props.setIsAuthed}
                  schoolId={schoolId}
                />
              );
            }}
          />
        </BrowserRouter> */}
    </div>
  );
}