import {Button, Box, Stack, Typography, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";

function Notification() {
  
  const toNum = '+18582144238';

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
  const [sentStatus, setSentStatus] = useState(false);
  const [sent, setSent] = useState(false);
  
  const dayString = ['today', 'tomorrow', 'the day after tomorrow', 'three days later'];

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const handleHourChange = (event) => {
    setHour(event.target.value);
  };

  const handleMinuteChange = (event) => {
    setMinute(event.target.value);
  };

  function handleClick(event){
    /** TODO **/
    // Add toNum format checking
    /** TODO **/
    event.preventDefault();
    
    let mm = parseInt(minute)*5;
    let dd = dayString[day];
    
    let message = "The car owner who parked inside your car wants to move the car at "+hour+":"+mm+" on "+dd;
    
    console.log(message)
    
    fetch(`http://localhost:4000/api/send-sms?recipient=${toNum}&text=${message}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSent(true);
          setSentStatus(true);
        } else {
          setSent(true);
          setSentStatus(false);
        }
      });
  }
  
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
                <FormControl style={{width:'11vw'}}>
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
          <PushButton type="submit" variant="contained" onClick={e=>handleClick(e)}> Notify others more outside than you </PushButton>
          {sent?
            <div>
              {sentStatus?
                <Typography>Notification sent successfully!</Typography>
              :
                <Typography>Sent failed, please try again.</Typography>
              }
              
            </div>
          :
            <div></div>
          }
          
        </Stack>
      </div>
    </ThemeProvider>
  );
}

export default Notification;
