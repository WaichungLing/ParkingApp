import { Button, Box, IconButton, Link as sLink, Typography, TextField, Toolbar } from "@mui/material";
import { Link, Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

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

	const [JoinCode, setJoinCode] = useState('');
  const [clicked, setClicked] = useState(false);
  
  function handleClickButton(){
    setClicked(!clicked);
  }
  
  function handleJoinCode(e){
    setJoinCode(e.target.value);
  }

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
										label="e.g. 945245"
										style={styles.textField}
										value={JoinCode}
										variant="outlined"
										onChange={(e) => handleJoinCode(e)}></TextField>
				<Link style={{textDecoration: 'none'}}
              to={`/view/${JoinCode}`}
              state={{uid:'123'}}
        >
          <Button style={{marginTop:'10vh', marginBottom: '3vh'}} type="submit" variant="contained"> Join </Button>
        </Link>
				<sLink style={{color: "#707070"}} onClick={handleClickButton}>What is Join code?</sLink>
        {clicked ?
          <div style={{width:'40vw', marginTop:'1vh'}}>
            <Typography style={{color: "#707070"}}>
              Each Apartment has a unique join code. Please ask your leasing manager or other residents for a 6-digit code.
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
