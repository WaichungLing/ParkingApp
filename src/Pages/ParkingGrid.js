import * as React from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {useState, useEffect, useRef} from 'react';
import Lambo from '../Images/lamborghini.jpeg';
import Draggable from 'react-draggable';
import {Button, Typography, ButtonGroup, FormControl, InputLabel, Select, MenuItem, Stack} from "@mui/material";
import {useLocation, useParams} from "react-router-dom";
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main:'#60A166',
    },
    secondary: {
      main:'#dcdcdc',
    }
  },
});

const Item = styled(Paper)(({ theme }) => ({}));

const styles = {
  root:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height:'80vh',
  },
  parkingLot: {
    width: '40vw',
    height: '40vh',
  },
  singleLot: {
    textAlign: 'center',
  },
  occupiedSingleLot:{
    backgroundImage: `url(${Lambo})`,
    backgroundSize: 'cover',
  },
  car:{
    backgroundImage: `url(${Lambo})`,
  },
  wall:{
    color:'black',
    width:'40vw',
    fontSize: '2vh',
    marginBottom: '1vh',
  }
};

let steps = {x:0,y:0}; // x how much steps in x-axis, >0 right, <0 left, y : >0 up, <0 down

export default function ParkingGrid(props) {
  let params = useParams();
  let url = useLocation();
  
  // Apartment information
  const [JoinCode, setJoinCode] = useState('');
  const [phone, setPhone] = useState('');
  const [userArray, setUserArray] = useState([]);
  const [n, setN] = useState(5)
  const [m, setM] = useState(2)

  // Scalable view
  const [singleGridDimensions, setSingleGridDimensions] = useState({});
  
  const [clickedID, setClickedID] = useState(-1);
  const [carParked, setCarParked] = useState(-1);   // This is for when you already park your car
  const [rearrange, setRearrange] = useState(false);
  const [sentStatus, setSentStatus] = useState(false);
  const [sent, setSent] = useState(false);
  const [notOutmost, setNotOutmost] = useState(false);
  
  const ref = useRef(null);
  const ref2 = useRef(null);
  
  // Notification section
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [setStatus, setSetStatus] = useState(-1);

  // When initialize
  useEffect(() => {
    
    console.log(params);
    console.log(url);
    
    setJoinCode(params.JoinCode);
    setPhone(url.state.phone);
    
    axios.get(`http://localhost:4000/apts/${params.JoinCode}`)
      .then((res)=>{
        console.log(res);
        setN(res.data.num_spots);
        setM(res.data.num_lanes);
        setUserArray(res.data.spots);
        console.log(userArray);
      }).catch((err)=>{
        console.log(err);
    })
  }, []);
  
  function handleClickItem(e,index){
    setClickedID(index);
  }
  
  function handleClickItemCancel(e){
    setClickedID(-1);
  }
  
  function handleAskMove(e){
    let to = userArray[clickedID];
    fetch(`http://localhost:4000/api/send-sms?recipient=${to}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSent(true);
          setSentStatus(true);
        } else {
          setSent(true);
          setSentStatus(false);
        }
        setTimeout(function (){
          setClickedID(-1);
        }, 3500);
        setTimeout(function (){
          setSent(false);
          setSentStatus(false);
        }, 10000);
      });
  }
  
  function handleRearrange(e){
    setRearrange(true);
    let id = -1;
    for (let i = 0; i < userArray; i++){
      if (Object.keys(userArray[i]).length !== 0){
        if (userArray[i].phone === phone){
          setCarParked(i);
          steps.x = id % n;
          steps.y = m - Math.floor(id / n);
          break;
        }
      }
    }
    setSingleGridDimensions({wd: ref.current.offsetWidth, ht: ref.current.offsetHeight});
  }

  function handleDrag(e, data){
    if (data.deltaX===0 && data.deltaY>0){
      steps.y--;
    }else if (data.deltaX===0 && data.deltaY<0){
      steps.y++;
    }else if (data.deltaY===0 && data.deltaX<0){
      steps.x--;
    }else{
      steps.x++;
    }
    console.log((m-steps.y)*n+steps.x);
  }
  
  function handleSave(e){
    let id = (m-steps.y)*n+steps.x;
    console.log("Final position ", id);
    // Nothing in that index
    if (Object.keys(userArray[id]).length === 0){
      userArray[id] = {phone:phone, movetime:''};
      if (carParked !== -1 && carParked !== id){
        userArray[carParked] = {};
      }
      console.log(userArray);
      setUserArray([...userArray]);
      setCarParked(id);
    }else{
      // already have something
      if (userArray[id].phone !== null){
        //
      }else{
        userArray[id].phone = phone;
        if (carParked !== -1 && carParked !== id){
          userArray[carParked] = {};
        }
        console.log(userArray);
        setUserArray([...userArray]);
        setCarParked(id);
      }
    }
    setRearrange(false)
    if (id >= 0 && id < n*(m-1)){
      setNotOutmost(true);
    }else{
      axios.post(`http://localhost:4000/apts/${JoinCode}`,{
        spots:userArray,
      }).then((res)=>{
      }).catch(()=>{
      })
    }
  }
  
  const handleDayChange = (event) => {
    setDay(event.target.value);
  };
  
  const handleHourChange = (event) => {
    setHour(event.target.value);
  };
  
  const handleMinuteChange = (event) => {
    setMinute(event.target.value);
  };
  
  function handleSet(event){
    event.preventDefault();
    let mm = parseInt(minute)*5;
    let hh = parseInt(hour);
    let deltaDD = parseInt(day);
    console.log([deltaDD, hh, mm]);
    /** TODO **/
    // Create move time date()
    const day_ms = 86400000;
    let cur = new Date();
    let temp = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), hh, mm);
    let move_time = new Date(temp.getTime()+day_ms*day);
    // Update all spots behind
    let id_temp = carParked+n;
    while (id_temp < n*m){
      if (Object.keys(userArray[id_temp]).length === 0){
        userArray[id_temp]={phone:"", movetime: move_time.toISOString()};
      }else{
        userArray[id_temp].movetime = move_time.toISOString();
      }
      id_temp = id_temp + n;
    }
    console.log("set time: ", userArray);
    // Update spots array
    axios.post(`http://localhost:4000/apts/${JoinCode}`,{
      spots:userArray,
    }).then((res)=>{
      setSetStatus(1);
    }).catch(()=>{
      setSetStatus(0);
    })
    /** TODO **/
    setTimeout(function (){
      setNotOutmost(false);
    }, 6000);
  }
  
  let sz = 12.0/n;
  let ht = Math.floor(40/m)
  let htvh = `${ht}vh`
  let htLabel = htvh.toString()

  return (
    <ThemeProvider theme={theme}>
      <div style={{...styles.root}}>
        <Typography style={{color: "#60A166", fontSize: '2.5vw', fontWeight: 600, marginBottom: '5vh', marginTop: '3vh'}}>
          Drag and drop your car
        </Typography>
        <hr  style={{
          color: '#000000',
          backgroundColor: '#000000',
          height: '0.2vh',
          borderColor : '#000000',
          width: '40vw',
        }}/>
        <div style={{margin:-8}}>INSIDE</div>
        <hr  style={{
          color: '#000000',
          backgroundColor: '#000000',
          height: '0.2vh',
          borderColor : '#000000',
          width: '40vw',
        }}/>
        <Box style={styles.parkingLot}>
          <Grid container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={0}
                ref={ref2}
          >
            {userArray.map((_, index) => {
              if (carParked === index && rearrange === true){
                console.log("haha");
                return (
                  <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                    
                    <Item style={{...styles.singleLot, height: htLabel}}>
                        <Draggable
                          grid={[singleGridDimensions.wd, singleGridDimensions.ht]}
                          onDrag={handleDrag}
                        >
                          <div style={{...styles.occupiedSingleLot, height: htLabel}}></div>
                        </Draggable>
                    </Item>
                  </Grid>
                );
              }else if (carParked === index && rearrange === false){
                return (
                  <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                    <Item style={{...styles.occupiedSingleLot, height: htLabel}}/>
                  </Grid>
                );
              }else if (Object.keys(userArray[index]).length !== 0 && userArray[index].phone !== "" && index !== clickedID) {
                return (
                  <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                    <Item style={{...styles.occupiedSingleLot, height: htLabel}} onClick={e => handleClickItem(e, index)}/>
                  </Grid>
                );
              }else if (Object.keys(userArray[index]).length !== 0 && userArray[index].phone !== "" && index === clickedID){
                if (sent === false){
                  return (
                    <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                      <Item style={{...styles.singleLot, height: htLabel, display:'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Button variant="outlined" style={{width:'80%'}} onClick={e => handleAskMove(e)}>Ask a move</Button>
                        <Button variant="outlined" style={{width:'80%'}} onClick={e => handleClickItemCancel(e)}>Cancel</Button>
                      </Item>
                    </Grid>
                  );
                }else{
                  return (
                    <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                      <Item style={{...styles.singleLot, height: htLabel, display:'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                        {sentStatus?
                          <Typography style={{color: '#60A166', fontWeight: 800}}>Notification sent successfully!</Typography>
                          :
                          <Typography style={{color: '#B22222', fontWeight: 800}}>Sent failed, please try again.</Typography>
                        }
                      </Item>
                    </Grid>
                  );
                }
              }else{
                return (
                  <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                    <Item style={{...styles.singleLot, height: htLabel}}>
                      <Typography>{index}</Typography>
                    </Item>
                  </Grid>
                );
              }
            })}
          </Grid>
          {rearrange === true?
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {
                carParked === -1?
                  <Draggable
                    positionOffset={{x:1,y:1}}
                    grid={[singleGridDimensions.wd, singleGridDimensions.ht]}
                    onDrag={handleDrag}
                  >
                  <img draggable="false" src={Lambo} style={{height: singleGridDimensions.ht,
                    width: singleGridDimensions.wd}}>
                  </img>
                </Draggable>:null
              }
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', margin:'5vh'}}>
                <Button variant='contained' onClick={e=>handleSave(e)}>Save</Button>
              </div>
            </div>
            :
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', margin:'5vh'}}>
              <Button variant='contained' style={{marginBottom: 20}} onClick={e=>handleRearrange(e)}>Rearrange</Button>
            </div>
          }
        </Box>
        {notOutmost?
          <div>
            <Stack
              spacing={10}
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{marginTop:'15vh'}}
            >
              <Box>
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
              </Box>
              <Button type="submit" variant="contained" onClick={e=>handleSet(e)}> Set my move time </Button>
            </Stack>
            {
            setStatus >= 0 ?
              <div>
                {setStatus == 1 ?
                  <Typography style={{color: '#60A166', fontWeight: 800}}>Successfully set, we'll notify any user parked behind you</Typography> :
                  <Typography style={{color: '#B22222', fontWeight: 800}}>Failed, please try again</Typography>
                }
              </div>:null
            }
          </div>
          :
          null
        }
        
      </div>
    </ThemeProvider>

  );
}
