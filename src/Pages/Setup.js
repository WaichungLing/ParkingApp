import { Link } from 'react-router-dom';
import styled from "@emotion/styled";
import {Button, Typography, Stack, Box, Link as Lk, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";

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
  
  // const [UserName, setUserName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [update, setUpdate] = useState(false);
  const [showSelected, setShowSelected] = useState(false);
  
  const apartments = [123456, 654321];
  
  function handleLink(){
    setUpdate(!update);
  }
  
  function handleSelected(){
    setShowSelected(true);
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
                      <Link to={`/view/${apartment}`} style={{color: "#707070", fontSize:'2.5vh', marginTop: '1vh'}}>{apartment}</Link>
                  );
                })}
              </div>
              
              
              :
              null
          }
          <Link to="/join" style={{ textDecoration: 'none', color: 'white'}}>
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
              {/*<TextField id="username"*/}
              {/*           label="UserName"*/}
              {/*           value={UserName}*/}
              {/*           variant="outlined"*/}
              {/*           margin="normal"*/}
              {/*           onChange={(e) => setUserName(e.target.value)}>*/}
              {/*</TextField>*/}
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
              <Button style={styles.signupButton} type="submit" variant="contained" sx={{mt: 3, mb: 2}}>Update</Button>
            </Box>
          :
            <div></div>
          }
        </Stack>
      </div>
    </ThemeProvider>
  );

  
}

export default Setup;
