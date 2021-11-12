import {Button, Box, Stack, Typography, FormControl, InputLabel, Select, MenuItem, ButtonGroup} from "@mui/material";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function Notification() {

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
      width: '100%',
      height: "100%"
    }
  };

  const PushButton = styled(Button) ({
    textTransform: 'none',
    fontSize: '1.3vw',
    fontWeight: 600,
    maxWidth: '30vw',
    maxHeight: '5vw',
    minWidth: '30vw',
    minHeight: '5vw',
  });

  const Title = styled(Typography) ({
    color: "#60A166",
    fontSize: '2.5vw',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center'
  });

  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const handleHourChange = (event) => {
    setHour(event.target.value);
  };

  const handleMinuteChange = (event) => {
    setMinute(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.root} className="Notification">
        <Box
          sx={{
            pt: 5,
            pb: 7,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
          <Title>Notification</Title>
        </Box>
        <Stack
          spacing={10}
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{marginTop:'8vh'}}
        >
          <box>
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
                    <MenuItem value={0}>Today</MenuItem>
                    <MenuItem value={1}>Tomorrow</MenuItem>
                    <MenuItem value={2}>2 Days later</MenuItem>
                    <MenuItem value={3}>3 Days later</MenuItem>
                  </Select>
                </FormControl>
              </div>

             <div style={{display:'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
               <div>
                 <FormControl style={{width:'7vw'}}>
                   <InputLabel id="HourSelector">Hour</InputLabel>
                   <Select
                     labelId="HourSelector"
                     value={hour}
                     label="Hour"
                     onChange={handleHourChange}
                   >
                     {Array.from(Array(24)).map((_, index) =>{
                       return (
                         <MenuItem value={index}>{index}</MenuItem>
                       );
                     })}
                   </Select>
                 </FormControl>
               </div>
               <div style={{fontSize: '3vh', marginLeft: '1vw', marginRight: '1vw'}}>:</div>
               <div>
                 <FormControl style={{width:'7vw'}}>
                   <InputLabel id="MinuteSelector">Minute</InputLabel>
                   <Select
                     labelId="MinuteSelector"
                     value={minute}
                     label="Minute"
                     onChange={handleMinuteChange}
                   >
                     {Array.from(Array(12)).map((_, index) =>{
                       return (
                         <MenuItem value={index}>{index*5}</MenuItem>
                       );
                     })}
                   </Select>
                 </FormControl>
               </div>
             </div>


            </div>
          </box>
          <PushButton type="submit" variant="contained"> Notify others more outside than you </PushButton>
          {/*<PushButton type="submit" variant="contained"> Notify others the change of parking arrangement </PushButton>*/}
        </Stack>
      </div>
    </ThemeProvider>
  );
}

export default Notification;
