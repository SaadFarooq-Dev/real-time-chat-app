import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as LinkRouter, useNavigate } from 'react-router-dom';
import {  Zoom } from '@mui/material';
import axios from 'axios';
import { decodeToken } from 'react-jwt';
import { useEffect } from 'react';


export default function SignUp({socket}) {

  let myDecodedToken = null
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios.post('http://localhost:4000/api/users',{
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password'),
    }).then( async res => {
      localStorage.setItem("jwtToken",res.data.token);
      myDecodedToken = decodeToken(res.data.token);
      localStorage.setItem('userName', myDecodedToken.user.username);
      //sends the username and socket ID to the Node.js server
      await socket.emit('newUser', { username: myDecodedToken.user.username, socketID: socket.id });
      navigate('/chat');


    })
    } catch (error) {
      console.error(error.response.data.errors[0])
    }
  };

  useEffect(() => {
    if(localStorage.getItem("jwtToken")){
      navigate('/chat')
    }
  }, []);

  return (
    <Zoom in={true} style={{ transitionDelay:'200ms' }} >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
           <Typography component="h1" variant="h5" fontWeight={1000} >
            Getting Started
          </Typography>
          <Typography  fontWeight={700} color='grey' sx={{mt:1}}>
            Create an account to continue and connect with Devs!
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontWeight:700 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <LinkRouter to='/login'>
                  <Link variant="body2">
                    Already have an account? Sign in
                  </Link>
                </LinkRouter>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      </Zoom>
  );
}
