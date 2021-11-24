import {Link, useLocation, useNavigate} from 'react-router-dom';
import styled from "@emotion/styled";
import {Button, Typography, Stack, Box, Link as Lk, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from "react";
import axios from "axios";

function Setup() {

  const theme = createTheme({
    palette: {
      primary: {
        main:'#60A166',
      },
    },
  });
  
  const styles = {
    root:{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '1vh',
    },
    fields:{
      display: 'flex',
      flexDirection: 'column',
      marginTop:'5vh',
    },
    inputSet:{
      display: 'flex',
      flexDirection: 'column',
      width: '35vw',
      marginTop: '2vh',
      marginBottom: '2vh',
    },
    text:{
      color: "#787878",
      width: '10vw',
      fontSize: '1vw',
      marginRight: '3vw',
    },
    signupButton: {
      backgroundColor: "#60A166",
      fontWeight: 600,
      fontSize: 25,
    },
  };

  const PushButton = styled(Button) ({
    textTransform: 'none',
    fontSize: '1.8vw',
    fontWeight: 600,
    maxWidth: '40vw',
    maxHeight: '4vw',
    minWidth: '40vw',
    minHeight: '4vw'
  });

  const Title = styled(Typography) ({
    color: "#60A166",
    fontSize: '2.5vw',
    fontWeight: 600
  });
  
  let url = useLocation();
  let navigate = useNavigate();
  
  const [userName, setUserName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [apartments, setApartments] = useState([]);
  const [currentUserNumber, setCurrentUserNumber] = useState('');
  const [update, setUpdate] = useState(false);
  const [showSelected, setShowSelected] = useState(false);
  const [phoneNumExist, setPhoneNumExist] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  useEffect(()=>{
    console.log(url);
    setApartments(url.state.apartments);
    setCurrentUserNumber(url.state.phone);
  },[])
  
  function handleLink(){
    setUpdate(!update);
  }
  
  function handleSelected(){
    setShowSelected(true);
  }
  
  function updateInfo(){
    axios.post(`http://localhost:4000/users/update/${PhoneNumber}`, {
      title: "update",
      name: userName,
      email: Email,
      password: Password,
    })
      .then(res=>{
        setUpdated(true);
        setUpdateSuccess(true);
      })
      .catch(err=>{
        setUpdated(true);
        setUpdateSuccess(false);
      })
  }
  
  function deleteAndUpdateUser(){
    axios.delete(`http://localhost:4000/users/${currentUserNumber}`)
      .then((res)=>{
        axios.post("http://localhost:4000/users/create", {
          title: "Updated user",
          name: userName,
          email: Email,
          phone: PhoneNumber,
          password: Password,
          apartments: apartments,
        }).then((response)=>{
          console.log("ok")
          navigate('../')
        }).catch((err) => {
          console.log("not ok")
          setUpdated(true);
          setUpdateSuccess(false);
        })
      })
      .then((err)=>{})
  }
  
  function handleUpdateInfo(e){
    console.log(currentUserNumber)
    let flag = true;
    if (PhoneNumber === currentUserNumber){
      updateInfo();
    }else{
      axios.get(`http://localhost:4000/users/phone/${PhoneNumber}`)
        .then(res => {
          setPhoneNumExist(true);
          flag = false;
        })
        .catch(err => {
          console.log(err)
        })
      if (flag === true){
        deleteAndUpdateUser();
      }
    }
    setTimeout(function (){
      setUpdate(false);
      setUpdated(false);
      setUpdateSuccess(false);
      setUserName('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setPhoneNumExist(false);
    }, 6000);
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.root} className="Setup">
        <Box
          sx={{
            pt: 5,
            pb: 7,
            width: 0.62,
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
          <Title>Do you want to join an existing ApartmentParking</Title>
          <Title>or create a new one?</Title>
        </Box>
        <Stack
          spacing={7}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <PushButton type="submit" variant="contained" onClick={handleSelected}>Select from my apartments</PushButton>
          {
            showSelected?
              <div style={{display: 'flex', width: '40vw', flexDirection: 'column', alignItems: 'flex-start', marginLeft:'3vw', marginTop:'1vh', marginBottom: '-2vh'}}>
                {apartments.map((apartment,index)=>{
                  return (
                      <Link to={`/view/${apartment}`}
                            style={{color: "#707070", fontSize:'2.5vh', marginTop: '1vh'}}
                            state={{phone: currentUserNumber}}
                            key={index}
                      >{apartment}</Link>
                  );
                })}
              </div>
              :
              null
          }
          <Link to="/join"
                style={{ textDecoration: 'none', color: 'white'}}
                state={{phone: currentUserNumber}}
          >
            <PushButton type="submit" variant="contained">Join an existing one</PushButton>
          </Link>
          <Link to="/create" style={{ textDecoration: 'none', color: 'white'}}>
            <PushButton type="submit" variant="contained">Create a new one</PushButton>
          </Link>
          {update?
            <Lk style={{color: "#707070", fontSize: '2.2vh'}} onClick={handleLink}>Cancel</Lk>
          :
            <Lk style={{color: "#707070", fontSize: '2.2vh'}} onClick={handleLink}>Update personal information</Lk>
          }
          
          {update?
            <Box style={styles.inputSet}>
              <Typography>Your current phone number is: {currentUserNumber}</Typography>
              <TextField id="phonenumber"
                         label="Phone # Start With 1"
                         value={PhoneNumber}
                         variant="outlined"
                         margin="normal"
                         error = {phoneNumExist}
                         helperText={phoneNumExist?"This phone number is used.": null}
                         onChange={(e) => setPhoneNumber(e.target.value)}>
              </TextField>
              <TextField id="username"
                         label="UserName"
                         value={userName}
                         variant="outlined"
                         margin="normal"
                         onChange={(e) => setUserName(e.target.value)}>
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
              <Button style={styles.signupButton} type="submit" variant="contained" sx={{mt: 3, mb: 2}} onClick={e=>handleUpdateInfo(e)}>Update</Button>
              {updated?
                <div>
                  {updateSuccess?
                    <Typography style={{color: '#60A166', fontSize:'2vh'}}>Updated successfully</Typography>
                    :
                    <Typography style={{color: '#B22222', fontSize:'2vh'}}>Updated failed, please try again</Typography>
                  }
                </div>
                :
              null}
            </Box>
          :
            null
          }
        </Stack>
      </div>
    </ThemeProvider>
  );

  
}

export default Setup;
