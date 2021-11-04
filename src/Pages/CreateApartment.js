import {Button, TextField, Typography} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function CreateApartment(){
  
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
  
  return (
    <ThemeProvider theme={theme}>
      <div style={styles.root}>
        <Typography style={{color: "#60A166", fontSize: '2.5vw', fontWeight: 600}}>Create a new apartment parking</Typography>
        <box style={styles.fields}>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Apartment Name</Typography>
            <TextField fullWidth
                       id="ApartmentName"
                       variant="outlined"
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Address</Typography>
            <TextField fullWidth
                       id="Address"
                       variant="outlined"
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Zip Code</Typography>
            <TextField fullWidth
                       id="Zipcode"
                       variant="outlined"
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Number of Tandem</Typography>
            <TextField fullWidth
                       id="TandemNumber"
                       variant="outlined"
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Number per Tandem</Typography>
            <TextField fullWidth
                       id="NumberPerTandem"
                       variant="outlined"
            />
          </box>
        </box>
        <Button style={{margin:'5vh'}} type="submit" variant="contained"> CREATE </Button>
      </div>
    </ThemeProvider>
    
  );
}
