import { Button, Box, Link, Typography, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";

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
			height: '5vw'
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
										label="e.g. 945948350245"
										style={styles.textField}
										value={JoinCode}
										variant="outlined"
										onChange={(e) => setJoinCode(e.target.value)}></TextField>
				<Button style={{marginTop:'10vh', marginBottom: '3vh'}} type="submit" variant="contained"> Join </Button>
				<Link style={{color: "#707070"}} href="#">What is Join code?</Link>
      </div>
    </ThemeProvider>
  );
}

export default JoinCode;
