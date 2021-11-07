import * as React from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {useState, useEffect, useRef} from 'react';
import Lambo from '../Images/lamborghini.jpeg';
import Draggable from 'react-draggable';
import {Button, Typography} from "@mui/material";
import Divider from '@mui/material/Divider';

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

const Item = styled(Paper)(({ theme }) => ({
  // ...theme.typography.body2,
  // padding: theme.spacing(1),
  // textAlign: 'center',
  // color: theme.palette.text.secondary,
  // display: 'flex',
  // flex: 1,
  // flexDirection: 'column',
}));

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
  // Replace with props later
  const n = 5;
  const m = 2;
  
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [parkingLotDimensions, setParkingLotDimensions] = useState({});
  const [singleGridDimensions, setSingleGridDimensions] = useState({});
  const [carParked, setCarParked] = useState(-1);   // This is for when you already park your car
  const [parkedID, setParkedID] = useState(-1);     // This is for add your car
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
    
    // Call function to get the ${carParked}
    /** TODO **/
    let id = -1;
    // Once return carParked, setCarParked and updated parkedID to set steps
    if (id >= 0){
      steps.x = id % n;
      steps.y = m - Math.floor(id / n);
    }
    
  }, []);
  
  function handleDrag(e, data){
    console.log(data);
    if (data.deltaX===0 && data.deltaY>0){
      steps.y--;
    }else if (data.deltaX===0 && data.deltaY<0){
      steps.y++;
    }else if (data.deltaY===0 && data.deltaX<0){
      steps.x--;
    }else{
      steps.x++;
    }
    console.log(steps);
    setParkedID((m-steps.y)*n+steps.x);
    console.log((m-steps.y)*n+steps.x);
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
              let xStep = singleGridDimensions.wd - 1/2;
              let yStep = 1.5*xStep;
              
              return (
                <Grid item xs={sz} key={index} style={{border: "1px solid grey"}} ref={ref}>
                  <Item style={{...styles.singleLot, height: ht}} >
                      {carParked === index?
                        <Draggable
                          grid={[singleGridDimensions.wd - 1/2,
                            1.5*(singleGridDimensions.wd - 1/2)]}
                          onDrag={handleDrag}
                        >
                          <img draggable="false" src={Lambo} style={{height: 1.5*parkingLotDimensions.wd,
                            width: parkingLotDimensions.wd}}>
                          </img>
                        </Draggable> : <Typography>{index}</Typography>}
                  </Item>
                </Grid>
              );
            })}
          </Grid>
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
          <Button variant='contained' style={{marginLeft: '10vw'}}>SAVE</Button>
        </Box>
      </div>
    </ThemeProvider>
    
  );
}
