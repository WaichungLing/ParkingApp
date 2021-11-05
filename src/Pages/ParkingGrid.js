import * as React from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {useState, useEffect, useRef} from 'react';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import IconButton from '@mui/material/IconButton';
import Draggable from 'react-draggable';

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
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
}));

const styles = {
  root:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parkingLot: {
    width: '50vw',
    height: '50vh',
    margin: 0,
  }
};

export default function ParkingGrid(props) {
  // Replace with props later
  const n = 5;
  const m = 2;
  
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [parkingLotDimensions, setParkingLotDimensions] = useState(0);
  const [streetClean, setStreetClean] = useState(new Array(n*m).fill(false));
  const ref = useRef(null);
  
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      setParkingLotDimensions(ref.current.offsetWidth);
      console.log(ref.current.offsetWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    setParkingLotDimensions(ref.current.offsetWidth);
  }, []);
  
  function handleStreetCleanButton(index){
    streetClean[index] = !streetClean[index];
    setStreetClean([...streetClean]);
  }
  
  function handleDrag(e, data){
    console.log(data);
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{...styles.root, height: '80vh'}}>
        <Box style={styles.parkingLot}>
          <Grid container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
          >
            {Array.from(Array(n*m)).map((_, index) => {
              let sz = 12.0/n;
              let ht = 1.5 * parkingLotDimensions;

              return (
                <Grid item xs={sz} key={index}>
                  <Item style={{height: ht}} ref={ref}>
                    <div style={{flex:1, display:'flex', flexDirection: 'row-reverse', justifyContent: 'flex-start'}}>
                      <IconButton style={{flex: 3}} aria-label="Street Clean">
                        {streetClean[index] ?
                          <CleaningServicesIcon color='primary' onClick={()=>{handleStreetCleanButton(index)}}/>
                          :
                          <CleaningServicesIcon color='secondary' onClick={()=>{handleStreetCleanButton(index)}}/>
                        }
                      </IconButton>
                      <div style={{flex: 7}}/>
                    </div>
                    <div style={{flex:9}}>
                      {index}
                    </div>
                  </Item>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </div>
      <Draggable
        grid={[parkingLotDimensions, 1.5 * parkingLotDimensions]}
        onStop={handleDrag}
      >
        <Item style={{height: 0.8 * 1.5 * parkingLotDimensions,
                      width: 0.8 * parkingLotDimensions}}>
          My Rolls Royce
        </Item>
      </Draggable>
    </ThemeProvider>
    
  );
}
