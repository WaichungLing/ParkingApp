import { Link } from 'react-router-dom';
import styled from "@emotion/styled";
import {Button, Typography, Stack, Box } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
      marginTop: '5vh',
    },
    fields:{
      display: 'flex',
      flexDirection: 'column',
      marginTop:'5vh',
    },
    inputSet:{
      display: 'flex',
      flexDirection: 'row',
      width: '50vw',
      marginTop: '2vh',
      marginBottom: '2vh',
    },
    text:{
      color: "#787878",
      width: '10vw',
      fontSize: '1vw',
      marginRight: '3vw',
    }
  };

  const PushButton = styled(Button) ({
    textTransform: 'none',
    fontSize: '2vw',
    fontWeight: 600,
    maxWidth: '50vw',
    maxHeight: '5vw',
    minWidth: '50vw',
    minHeight: '5vw'
  });

  const Title = styled(Typography) ({
    color: "#60A166",
    fontSize: '2.5vw',
    fontWeight: 600
  });

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
          <Link to="/join" style={{ textDecoration: 'none', color: 'white'}}>
            <PushButton type="submit" variant="contained">Join an existing one</PushButton>
          </Link>
          <Link to="/create" style={{ textDecoration: 'none', color: 'white'}}>
            <PushButton type="submit" variant="contained">Create a new one</PushButton>
          </Link>
          {/*<Link style={{color: "#707070"}} href="#">What is ApartmentParking?</Link>*/}
        </Stack>
      </div>
    </ThemeProvider>
  );

  
}

export default Setup;
