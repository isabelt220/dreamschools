import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, CssBaseline, Hidden, Drawer } from "@material-ui/core";

import { theme } from "./themes/theme";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./PrivateRoute";

import "./App.css";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";
import ResetPasswordEmailSent from "./pages/ResetPasswordEmailSent";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import ResetPasswordConfirmed from "./pages/ResetPasswordConfirmed";
import WelcomeSignedUp from "./pages/WelcomeSignedUp";
import CreateSchool from "./pages/CreateSchool";
import SchoolPage from "./pages/SchoolPage";
import UpdateSchoolPage from "./pages/UpdateSchoolPage";
// import Dashboard from "./Dashboard";

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

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [schoolId, setSchoolId] = useState('');
  useEffect(() => {
    localStorage.getItem("authorized") ? setIsAuthed(true) : setIsAuthed(false);
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route
          path='/signup'
          render={props => {
            return (
              <SignupPage
                {...props}
                isAuthed={isAuthed}
                setIsAuthed={setIsAuthed}
              />
            );
          }}
        />
        <Route
          path='/login'
          render={props => {
            return (
              <LoginPage
                {...props}
                isAuthed={isAuthed}
                setIsAuthed={setIsAuthed}
              />
            );
          }}
        />
        <Route 
          exact
          path='/'
          render={props => {
            return (
              <Home
                {...props}
                isAuthed={isAuthed}
                setIsAuthed={setIsAuthed}
                schoolId={schoolId}
                setSchoolId={setSchoolId}
              />
            );
          }} 
        />
        {/* <Route path='/home' component={Home} /> */}
        <Route path='/welcome' 
          render={props => {
            return (
              <WelcomeSignedUp
                {...props}
                isAuthed={props.isAuthed}
                setIsAuthed={props.setIsAuthed}
              />
            );
          }}
        />
        <Route path='/forgot-password'
          render={props => {
            return (
              <ForgotPasswordForm
                {...props}
                isAuthed={props.isAuthed}
                setIsAuthed={props.setIsAuthed}
              />
            );
          }}
        />
        <Route path='/reset-password-email-sent'
          render={props => {
            return (
              <ResetPasswordEmailSent
                {...props}
                isAuthed={props.isAuthed}
                setIsAuthed={props.setIsAuthed}
              />
            );
          }}
        />
        <Route path='/reset-password'
          render={props => {
            return (
              <ResetPasswordForm
                {...props}
                isAuthed={props.isAuthed}
                setIsAuthed={props.setIsAuthed}
              />
            );
          }}
        />
        <Route path='/reset-password-confirmed'
          render={props => {
            return (
              <ResetPasswordConfirmed
                {...props}
                isAuthed={props.isAuthed}
                setIsAuthed={props.setIsAuthed}
              />
            );
          }}
        />
        <Route path='/create-school'
          render={props => {
            return (
              <CreateSchool
                {...props}
                isAuthed={props.isAuthed}
                setIsAuthed={props.setIsAuthed}
              />
            );
          }}
        />
        <Route path='/school/'
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
        <Route path='/update-school/'
          render={props => {
            return (
              <UpdateSchoolPage
                {...props}
                isAuthed={props.isAuthed}
                setIsAuthed={props.setIsAuthed}
                schoolId={schoolId}
              />
            );
          }}
        />
        {/* <Route path='/welcome' component={WelcomeSignedUp} />
        <Route path='/forgot-password' component={ForgotPasswordForm} />
        <Route path='/reset-password-email-sent' component={ResetPasswordEmailSent} />
        <Route path='/reset-password' component={ResetPasswordForm} />
        <Route path='/reset-password-confirmed' component={ResetPasswordConfirmed} /> */}
        {/* <PrivateRoute path='/' isAuthed={isAuthed} component={Home} /> */}
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
