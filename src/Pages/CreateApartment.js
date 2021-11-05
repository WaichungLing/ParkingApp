import {Button, TextField, Typography} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";

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
      fontSize: '2vh',
      marginRight: '3vw',
    }
  };
  
  const [ApartmentName, setApartmentName] = useState('');
  const [Address, setAddress] = useState('');
  const [Zipcode, setZipcode] = useState('');
  const [NumberOfTandem, setNumberOfTandem] = useState('');
  const [NumberPerTandem, setNumberPerTandem] = useState('');
  
  function handleNumberOfTandem(e) {
    let s = e.target.value;
    console.log(s.replace(/[^0-9]/g, ''))
    setNumberOfTandem(s.replace(/[^0-9]/g, ''));
  }
  
  function handleNumberPerTandem(e) {
    let s = e.target.value;
    console.log(s.replace(/[^0-9]/g, ''))
    setNumberPerTandem(s.replace(/[^0-9]/g, ''));
  }
  
  return (
    <ThemeProvider theme={theme}>
      <div style={styles.root}>
        <Typography style={{color: "#60A166", fontSize: '2.5vw', fontWeight: 600}}>Create a new apartment parking</Typography>
        <box style={styles.fields}>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Apartment Name</Typography>
            <TextField fullWidth
                       value={ApartmentName}
                       variant="outlined"
                       onChange={(e) => setApartmentName(e.target.value)}
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Address</Typography>
            <TextField fullWidth
                       value={Address}
                       variant="outlined"
                       onChange={(e) => setAddress(e.target.value)}
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Zip Code</Typography>
            <TextField fullWidth
                       value={Zipcode}
                       variant="outlined"
                       onChange={(e) => setZipcode(e.target.value)}
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Number of Tandem</Typography>
            <TextField fullWidth
                       value={NumberOfTandem}
                       variant="outlined"
                       onChange={(e) => handleNumberOfTandem(e)}
            />
          </box>
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Number per Tandem</Typography>
            <TextField fullWidth
                       value={NumberPerTandem}
                       variant="outlined"
                       onChange={(e) => handleNumberPerTandem(e)}
            />
          </box>
        </box>
        <Button style={{margin:'5vh'}} type="submit" variant="contained"> CREATE </Button>
      </div>
    </ThemeProvider>
    
  );
}
