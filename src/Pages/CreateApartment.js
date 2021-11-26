import {Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Toolbar, Typography} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from "react";
import axios from 'axios';
import {useLocation, useNavigate} from "react-router-dom";

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
  
  let navigate = useNavigate();
  let url = useLocation();
  
  const [phone, setPhone] = useState('');
  
  const [ApartmentName, setApartmentName] = useState('');
  const [Address, setAddress] = useState('');
  const [Zipcode, setZipcode] = useState('');
  const [NumberOfTandem, setNumberOfTandem] = useState('');
  const [NumberPerTandem, setNumberPerTandem] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState(false);
  const [apartments, setApartments] = useState([]);
  
  useEffect(()=>{
    setPhone(url.state.phone);
    setApartments(url.state.apartments);
  },[])

  function handleNumberOfTandem(e) {
    let s = e.target.value;
    setNumberOfTandem(s.replace(/[^0-9]/g, ''));
  }

  function handleNumberPerTandem(e) {
    let s = e.target.value;
    setNumberPerTandem(s.replace(/[^0-9]/g, ''));
  }

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };
  
  
  async function handleCreate(e) {
    let found = false;
    let randomJoinCode;
    let JoinCode;
    let i = 0;
    while(!found){
      randomJoinCode = Math.floor(Math.random() * (10000 - 1000) + 1000);
      JoinCode = randomJoinCode.toString();
      console.log("Trying join_code: ", JoinCode);
      await axios.get(`http://localhost:4000/apts/${JoinCode}`)
        .then((res)=>{
        })
        .catch(err => {
          found = true;
          console.log(err)
        })
      i = i+1;
    }
    if (found){
      axios.post("http://localhost:4000/apts/create", {
        join_code: JoinCode,
        num_lanes: parseInt(NumberPerTandem),
        num_spots: parseInt(NumberOfTandem),
        phone: phone,
        streetcleaning:{
          day: day,
          hour: time,
        }
      }).then(()=>{
        apartments.push(JoinCode);
        axios.post(`http://localhost:4000/users/updateApt/${phone}`,{
          title: "update apartment list",
          apartments: apartments
        })
        navigate(`/view/${randomJoinCode}`, {state:{phone: phone}});
      }).catch(()=>{
        setError(true);
      })
    }
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
                       error = {error}
                       helperText={error?"Something went wrong, please try again":null}
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
          <box style={styles.inputSet}>
            <Typography style={styles.text}>Street Cleaning Time</Typography>
            <div style={{width:'40vw', display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
              <div>
                <FormControl style={{width:'7vw'}}>
                  <InputLabel id="daySelector">Day</InputLabel>
                  <Select
                    labelId="daySelector"
                    value={day}
                    label="Day"
                    onChange={handleDayChange}
                  >
                    <MenuItem value={0}>None</MenuItem>
                    <MenuItem value={1}>Sunday</MenuItem>
                    <MenuItem value={2}>Monday</MenuItem>
                    <MenuItem value={3}>Tuesday</MenuItem>
                    <MenuItem value={4}>Wednesday</MenuItem>
                    <MenuItem value={5}>Thursday</MenuItem>
                    <MenuItem value={6}>Friday</MenuItem>
                    <MenuItem value={7}>Saturday</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div>
                <FormControl style={{width:'7vw'}}>
                  <InputLabel id="TimeSelector">Time</InputLabel>
                  <Select
                    labelId="TimeSelector"
                    value={time}
                    label="Time"
                    onChange={handleTimeChange}
                  >
                    {Array.from(Array(24)).map((_, index) =>{
                      return (
                        <MenuItem value={index}>{index}:00</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>

            </div>
          </box>
        </box>
        <Button style={{margin:'5vh'}} type="submit" variant="contained" onClick={e=>handleCreate(e)}> CREATE </Button>
      </div>
    </ThemeProvider>
  );
}
