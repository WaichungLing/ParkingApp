import {Button, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
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

  const TextButton = styled(Button)({
    textTransform: 'none',
    margin: '5vh'
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.root} className="Setup">
        <Typography style={{color: "#60A166", fontSize: '2.5vw', fontWeight: 600}}>Do you want to join an existing ApartmentParking or create a new one?</Typography>
        <TextButton type="submit" variant="contained"> Join an existing  </TextButton>
        <TextButton type="submit" variant="contained"> Create a new one </TextButton>
      </div>
    </ThemeProvider>
  );

  
}

export default Setup;
