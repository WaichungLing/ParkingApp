import { Button, Box, IconButton, Link as SLink, Typography, TextField, Toolbar } from "@mui/material";
import { Outlet, useLocation, useNavigate} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from "react";
import axios from "axios";

function JoinCode() {

  const theme = createTheme({
    palette: {
      primary: {
        main:'#60A166',
      },
    },
  });

  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '5vh',
    },
		textField: {
			width: '40vw',
			height: '5vw',
      marginTop: '10vh',
		}
  };

  const Title = styled(Typography) ({
    color: "#60A166",
    fontSize: '2.5vw',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center'
  });
  
  let navigate = useNavigate();
  let url = useLocation();

	const [JoinCode, setJoinCode] = useState('');
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(false);
  const [phone, setPhone] = useState('');
  const [apartments, setApartments] = useState([]);
  
  function handleClickButton(){
    setClicked(!clicked);
  }
  
  function handleJoinCode(e){
    setJoinCode(e.target.value);
  }
  
  function handleJoin(e){
    axios.get(`http://localhost:4000/apts/${JoinCode}`)
      .then(res => {
        setError(false);
        apartments.push(JoinCode);
        axios.post(`http://localhost:4000/users/updateApt/${phone}`,{
          title: "update apartment list",
          apartments: apartments
        })
        navigate(`/view/${JoinCode}`, {state:{phone: phone}});
      }).catch(err => {
        console.log(err);
        setError(true);
    })
  }
  
  useEffect(()=>{
    // Keep track of the current user
    setPhone(url.state.phone);
    setApartments(url.state.apartments);
  },[])

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.root} className="JoinCode">
        <Box
          sx={{
            pt: 5,
            pb: 7,
            width: 0.62,
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
          <Title>Type in the join code of your apartment:</Title>
        </Box>
        <TextField  id="joincode"
										label="e.g. 1234"
										style={styles.textField}
										value={JoinCode}
										variant="outlined"
                    error = {error}
                    helperText={error?"Invalid join code.":null}
										onChange={(e) => handleJoinCode(e)}></TextField>

        <Button style={{marginTop:'10vh', marginBottom: '3vh'}} type="submit" variant="contained" onClick={e=>handleJoin(e)}> Join </Button>
				<SLink style={{color: "#707070"}} onClick={handleClickButton}>What is Join code?</SLink>
        {clicked ?
          <div style={{width:'40vw', marginTop:'1vh'}}>
            <Typography style={{color: "#707070"}}>
              Each Apartment has a unique join code. Please ask your leasing manager or other residents for a 4-digit code.
            </Typography>
          </div>:
          <div></div>
        }
      </div>
      <Outlet />
    </ThemeProvider>
  );
}

export default JoinCode;
