import React,{useEffect, useState}  from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Divider, Zoom } from '@mui/material';
import { Link as LinkRouter, useNavigate } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import socketIO from 'socket.io-client';


import axios from 'axios';



export default function SignIn({socket,}) {

  const navigate = useNavigate();
  let myDecodedToken = null

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios.post('http://localhost:4000/api/auth',{
        email: data.get('email'),
        password: data.get('password'),
      }).then( res=>{

        localStorage.setItem("jwtToken",res.data.token);
        myDecodedToken = decodeToken(res.data.token);
        localStorage.setItem('userName', myDecodedToken.user.username);
        //sends the username and socket ID to the Node.js server
        socket.emit('newUser', { username: myDecodedToken.user.username, socketID: socket.id });
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
    <Zoom in={true} style={{ transitionDelay: '200ms' }} >
      <Container component="main" maxWidth="sm">
        <CssBaseline />
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
            Sign in
          </Typography>
          <Typography  fontWeight={700} color='grey' sx={{mt:1}}>
            Welcome back, you've been missed!
          </Typography>
          <Divider flexItem sx={{mt:1,mb:2,fontWeight:1000}}>
          </Divider>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Your Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontWeight:700 }}

            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <LinkRouter to='/signup'>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
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
