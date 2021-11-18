import {Button, Box, Divider, Grid, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from "../Images/cars.png";
import {useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {
  
  let navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: {
        main:'#60A166',
      },
    },
  });

  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      height: "400pt",
      width: "100%",
    },
    text: {
      color: "#60A166",
      fontWeight: 600,
      fontSize: 43,
    },
    inputSet: {
      display: "flex",
      flexDirection: "column",
      width: "65%",
    },
    signupButton: {
      backgroundColor: "#60A166",
      fontWeight: 600,
      fontSize: 25,
    },
    loginButton: {
      color: "#60A166",
      fontSize: 20,
    },
    loginGrid: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }
  };

  const [UserName, setUserName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Login, setLogin] = useState(false);

  function handleClick() {
    setLogin(!Login);
  }
  
  function handleLogin(){
  
  }
  
  function handleSignUp(){
    axios.post("http://localhost:4000/users/create", {
      title: "Sign up user",
      name: UserName,
      email: Email,
      phone: PhoneNumber,
    }).then((response)=>{
      if (response.status==201){
        navigate('select')
      }else{
        console.log(response)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item xs={6} sm={6} md={6}>
          <Box style={styles.paperContainer}></Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} container style={styles.loginGrid}>
          <Typography style={styles.text} component="h1">PARKING APP</Typography>
          {Login?
            <Box style={styles.inputSet} >
              <TextField id="username"
                         label="UserName"
                         value={UserName}
                         variant="outlined"
                         margin="normal"
                         onChange={(e) => setUserName(e.target.value)}>
              </TextField>
              <TextField id="password"
                         label="Password"
                         value={Password}
                         variant="outlined"
                         margin="normal"
                         onChange={(e) => setPassword(e.target.value)}>
              </TextField>
              <Button style={styles.signupButton} type="submit" variant="contained" sx={{mt: 3, mb: 2}} onClick={handleLogin}>LOGIN</Button>
              <Button style={styles.loginButton} type="submit" variant="text" onClick={handleClick}>SIGNUP</Button>
            </Box>
            :
            <Box style={styles.inputSet} id="signup">
              <TextField id="username"
                         label="UserName"
                         value={UserName}
                         variant="outlined"
                         margin="normal"
                         onChange={(e) => setUserName(e.target.value)}>
              </TextField>
              <TextField id="phonenumber"
                         label="Phone #"
                         value={PhoneNumber}
                         variant="outlined"
                         margin="normal"
                         onChange={(e) => setPhoneNumber(e.target.value)}>
              </TextField>
              <TextField id="email"
                         label="Email"
                         value={Email}
                         variant="outlined"
                         margin="normal"
                         onChange={(e) => setEmail(e.target.value)}>
              </TextField>
              <TextField id="password"
                         label="Password"
                         value={Password}
                         variant="outlined"
                         margin="normal"
                         onChange={(e) => setPassword(e.target.value)}>
              </TextField>
              <Button style={styles.signupButton} type="submit" variant="contained" sx={{mt: 3, mb: 2}} onClick={handleSignUp}>SIGNUP</Button>
              {/*<Divider variant="middle" />*/}
              <Button style={styles.loginButton} type="submit" variant="text" onClick={handleClick}> LOGIN</Button>
            </Box>
          }
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;
