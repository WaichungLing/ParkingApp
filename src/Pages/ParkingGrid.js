import * as React from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {useState, useEffect, useRef} from 'react';
import Lambo from '../Images/lamborghini.jpeg';
import Draggable from 'react-draggable';
import {Button, Typography, ButtonGroup} from "@mui/material";
import {useLocation, useParams} from "react-router-dom";
import axios from 'axios';
import async from "async";

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

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

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
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [parkingLotDimensions, setParkingLotDimensions] = useState({});
  const [singleGridDimensions, setSingleGridDimensions] = useState({});
  
  const [clickedID, setClickedID] = useState(-1);
  const [carParked, setCarParked] = useState(-1);   // This is for when you already park your car
  const [sentStatus, setSentStatus] = useState(false);
  const [sent, setSent] = useState(false);
  const ref = useRef(null);
  const ref2 = useRef(null);

  // When window size changed
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      setParkingLotDimensions({wd: ref.current.clientWidth, ht: ref.current.offsetHeight});
      setSingleGridDimensions({wd: ref.current.offsetWidth});
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When initialize
  useEffect(() => {
    setParkingLotDimensions({wd: ref.current.clientWidth, ht: ref.current.offsetHeight});
    setSingleGridDimensions({wd: ref.current.offsetWidth});
    
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
    
    /** TODO **/
    // 1. getApartment by params.apartmentID, if null, render "Apartment Not exist" and a link to create apartment
    // 2. if apartmentID not null, update n,m, users, spots
    // 3. Check the current user has parked in this apartment or not, update ${carParked}
    /** TODO **/
    let id = -1; // should be just carPark, for static testing only, remove when link backend, should loop
    // Once return carParked, setCarParked and updated parkedID to set steps
    if (id >= 0){
      steps.x = id % n;
      steps.y = m - Math.floor(id / n);
    }

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

  function handleDrag(e, data){
    // console.log(data);
    if (data.deltaX===0 && data.deltaY>0){
      steps.y--;
    }else if (data.deltaX===0 && data.deltaY<0){
      steps.y++;
    }else if (data.deltaY===0 && data.deltaX<0){
      steps.x--;
    }else{
      steps.x++;
    }
    // console.log(steps);
    let id = (m-steps.y)*n+steps.x;
    console.log((m-steps.y)*n+steps.x);
    userArray[id] = phone;
    setUserArray([...userArray]);
  }

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
            {Array.from(Array(n*m)).map((_, index) => {
              let sz = 12.0/n;
              let ht = 1.5 * parkingLotDimensions.wd;

              if (carParked === index){
                return (
                  <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                    <Item style={{...styles.singleLot, height: ht}}>
                        <Draggable
                          grid={[singleGridDimensions.wd - 1/2,
                            1.5*(singleGridDimensions.wd - 1/2)]}
                          onDrag={handleDrag}
                        >
                          <img draggable="false" src={Lambo} style={{height: 1.5*parkingLotDimensions.wd,
                            width: parkingLotDimensions.wd}}>
                          </img>
                        </Draggable>
                    </Item>
                  </Grid>
                );
              }else if ( index !== clickedID) {
                return (
                  <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                    <Item style={{...styles.singleLot, height: ht}}>
                      <img draggable="false" src={Lambo} style={{
                        height: 1.5 * parkingLotDimensions.wd,
                        width: parkingLotDimensions.wd
                      }} onClick={e => handleClickItem(e, index)}>
                      </img>
                    </Item>
                  </Grid>
                );
              }else if ( index === clickedID){
                if (sent === false){
                  return (
                    <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                      <Item style={{...styles.singleLot, height: ht, display:'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Button variant="outlined" style={{width:0.8*parkingLotDimensions.wd}} onClick={e => handleAskMove(e)}>Ask a move</Button>
                        <Button variant="outlined" style={{width:0.8*parkingLotDimensions.wd}} onClick={e => handleClickItemCancel(e)}>Cancel</Button>
                      </Item>
                    </Grid>
                  );
                }else{
                  return (
                    <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                      <Item style={{...styles.singleLot, height: ht, display:'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
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
                    <Item style={{...styles.singleLot, height: ht}}>
                      <Typography>{index}</Typography>
                    </Item>
                  </Grid>
                );
              }
            })}
          </Grid>
          {carParked < 0?
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <Draggable
                positionOffset={{x:1,y:1}}
                grid={[singleGridDimensions.wd - 1/2,
                  1.5*(singleGridDimensions.wd - 1/2)]}
                onDrag={handleDrag}
              >
                <img draggable="false" src={Lambo} style={{height: 1.5*parkingLotDimensions.wd,
                  width: parkingLotDimensions.wd}}>
                </img>
              </Draggable>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Button variant='contained' style={{marginBottom: 20}}>SAVE</Button>
              </div>
              
            </div>
            :
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', margin:'5vh'}}>
              <Button variant='contained'>SAVE</Button>
            </div>
          }
        </Box>
      </div>
    </ThemeProvider>

  );
}
