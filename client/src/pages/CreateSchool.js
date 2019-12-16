import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Grid, Box, FormControl, Typography, CardMedia } from '@material-ui/core';

import bgImage from '../assets/images/4c49d03df598d6822be307208f2333b1e9b42279.png';
import AddImageIcon from '../assets/images/add-image-icon.svg'
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
  signUpBox: {
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

const CreateSchool = (props) => {
  const classes = useStyles();

  const [school_name, setSchoolName] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [admission, setAdmission] = useState('');
  const [image, setImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [err, setErr] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const createSchool = (e) => {
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

    console.log(image_url);
    if (image_url) {
      fetch('/school/', {
        method: 'POST',
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
            setSubmitted(true);
          }
        })
        .catch(err => {
          console.log(err.message);
        });
      };
    }

  if (submitted) {
    return <Redirect to="/" />
  }

  const onFormChange = (e) => {
    let imageList = [];
    let urlObject;

    for (let i = 0; i < e.target.files.length; i++) {
      urlObject = URL.createObjectURL(e.target.files[i]);
      imageList.push(urlObject);
      console.log(urlObject);
    }

    setImage(e.target.files);
    setSelectedImage(imageList);
  }

  console.log(image);

  // const onBtnClick = () => {
  //   let imagesList = new FormData();
  //   imagesList.append('files', image);

  //   console.log(this.state);
  //   fetch("/receipts/images", {
  //     method: "POST",
  //     body: imagesList
  //   })
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(data => {
  //       console.log(data);
  //       this.props.setImgUrls(data['locations']);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // };

  let card;
  if(selectedImage) {
    card = <CardMedia style={{marginLeft: 'auto', marginRight:'auto'}} image={selectedImage} title="school image" className={classes.image} />
  } else {
    card = <CardMedia style={{marginLeft: 'auto', marginRight: 'auto'}} image={AddImageIcon} title="Add Image Icon" className={classes.image} />
  }

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
          <Box className={classes.signUpBox} border={1}>
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
                  label={'School Name'}
                  className={classes.formInput}
                  onChange={e => setSchoolName(e.target.value)}
                  value={school_name}
                />
                <TextField
                  multiline
                  rows={3}
                  variant='outlined'
                  label={'About'}
                  className={classes.formInput}
                  onChange={e => setAbout(e.target.value)}
                  value={about}
                />
                <TextField
                  multiline
                  rows={2}
                  variant='outlined'
                  label={'Location'}
                  className={classes.formInput}
                  onChange={e => setLocation(e.target.value)}
                  value={location}
                />
                <TextField
                  multiline
                  rows={5}
                  variant='outlined'
                  label={'Admission'}
                  className={classes.formInput}
                  onChange={e => setAdmission(e.target.value)}
                  value={admission}
                />
                <Grid container justify='center'>
                  <Button className={classes.submit} onClick={createSchool}>
                    Submit
                  </Button>
                </Grid>
              </form>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default CreateSchool;
