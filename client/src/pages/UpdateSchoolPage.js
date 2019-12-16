import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CardMedia, CssBaseline, Drawer, Grid, Box, Paper, FormControl, TextField } from "@material-ui/core";

import TopBar from "../components/TopBar";
import AddImageIcon from '../assets/images/add-image-icon.svg'
import CustomizedSnackbars from '../components/Snackbar';

const topBarHeight = 105;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: topBarHeight
  },
  toolbar: theme.mixins.toolbar,
  drawer: {
    [theme.breakpoints.up("sm")]: {
      flexShrink: 0
    }
  },
  paper: {
    width: 740,
    margin: theme.spacing(3)
  },
  updateBox: {
    padding: theme.spacing(1, 5),
    borderColor: '#EFEFEF'
  },
  form: {
    width: '100%',
  },
  formInput: {
    marginTop: '2rem',
    width: '100%'
  },
  submit: {
    margin: theme.spacing(8, 0, 2),
    padding: theme.spacing(0.5, 2),
    color: '#38CC89',
    border: '1px solid #38CC89',
    backgroundColor: '#FFF'
  },
  container: {
    padding: 50,
    borderColor: 'white'
  },
  image: {
    maxWidth: 150,
    height: 150
  },
  drop: {
    cursor: 'pointer',
    background: '#F3F5FB',
    textAlign: 'center'
  },
  dropText: {
    margin: 12
  },
  select: {
    background: '#1B3460',
    color: 'white',
    padding: '10px 20px',
    margin: '20px auto'
  },
  formC: {
    width: 150,
    height: 150
  }
}));

const UpdateSchoolPage = (props) => {
  const classes = useStyles();
  const [schoolData, setSchoolData] = useState([]);

  const [school_name, setSchoolName] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [admission, setAdmission] = useState('');
  const [image, setImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [err, setErr] = useState('');
  const [updated, setUpdated] = useState(false);

  // useEffect(() => {
  //   const fetchSchool = async () => {
  //     const response = await fetch('/school/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
  //     const jsonSchoolResponse = await response.json();

  //     await setSchoolData(jsonSchoolResponse);
  //   }

  //   fetchSchool();
  // }, []);

  const updateSchool = (e) => {
    e.preventDefault();
    setErr('');
    let status;
    let imageList = new FormData();

    for (let i = 0; i < image.length; i++) {
      imageList.append('files', image[i]);
    }

    fetch('/school/images',  {
      method: 'POST',
      body: imageList
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data.Error) {
        setErr(data.Error);
      }
      setImageUrl(data['location']);
    })
    .catch(err => {
      console.log(err.message)
    })

    fetch('/school/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ school_name, about, location, admission, image_url })
    })
      .then(res => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error('Server error');
      })
      .then(res => {
        if (res.Error) {
          setErr(res.Error);
        } else if (res.Success) {
          setErr(res.Success)
          setUpdated(true);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const onFormChange = (e) => {
    let imageList = [];
    let urlObject;

    for (let i = 0; i < e.target.files.length; i++) {
      urlObject = URL.createObjectURL(e.target.files[i]);
      imageList.push(urlObject);
    }

    setImage(e.target.files);
    setSelectedImage(imageList);
  }

  let card;
  if(selectedImage) {
    card = <CardMedia style={{marginLeft: 'auto', marginRight:'auto'}} image={selectedImage} title="school image" className={classes.image} />
  } else {
    card = <CardMedia style={{marginLeft: 'auto', marginRight: 'auto'}} image={AddImageIcon} title="Add Image Icon" className={classes.image} />
  }

  if (updated) {
    return <Redirect to='/' />
  }
  console.log(school_name);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer variant='permanent'>
        <TopBar {...props} isAuthed={props.isAuthed} setIsAuthed={props.setIsAuthed} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container alignItems='center' item direction='column' xs={12} sm={8} md={12}>
        <div className={classes.paper}>
          <Box className={classes.updateBox} border={1}>
            <Grid container>
              <form className={classes.form}>
                <Grid container justify='space-between' direction='row'>
                  <h1>Create School</h1>
                  <div className={classes.container}>
                    <FormControl className={classes.formC}>
                      <label htmlFor="raised-button-file">
                        <div 
                          className={classes.drop}
                          onDrop={(e) => {
                            e.preventDefault();
                            console.log(e);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          {card}
                        </div>
                      </label>
                      <input type="file" id="raised-button-file" name="images" accept="image/*" onChange={onFormChange} style={{display: 'none'}} multiple />
                    </FormControl>
                  </div>
                </Grid>
                {err.length > 0 && (
                  <CustomizedSnackbars variant='error' message={err} />
                )}
                <TextField
                  defaultValue={schoolData.school_name}
                  label={'School Name'}
                  className={classes.formInput}
                  onChange={e => setSchoolName(e.target.value)}
                  value={school_name}
                />
                <TextField
                  multiline
                  rows={3}
                  defaultValue={schoolData.about}
                  variant='outlined'
                  label={'About'}
                  className={classes.formInput}
                  onChange={e => setAbout(e.target.value)}
                  value={about}
                />
                <TextField
                  multiline
                  rows={2}
                  defaultValue={schoolData.location}
                  variant='outlined'
                  label={'Location'}
                  className={classes.formInput}
                  onChange={e => setLocation(e.target.value)}
                  value={location}
                />
                <TextField
                  multiline
                  rows={5}
                  defaultValue={schoolData.admission}
                  variant='outlined'
                  label={'Admission'}
                  className={classes.formInput}
                  onChange={e => setAdmission(e.target.value)}
                  value={admission}
                />
                <Grid container justify='center'>
                  <Button className={classes.submit} onClick={updateSchool}>
                    Update
                  </Button>
                </Grid>
              </form>
            </Grid>
          </Box>
        </div>
      </Grid>
      </main>
    </div>
  );
}

export default UpdateSchoolPage;
