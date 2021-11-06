import {Button, Box, Stack, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    }
  };

  const PushButton = styled(Button) ({
    textTransform: 'none',
    fontSize: '1.7vw',
    fontWeight: 600,
    maxWidth: '56vw',
    maxHeight: '5vw',
    minWidth: '56vw',
    minHeight: '5vw'
  });

  const Title = styled(Typography) ({
    color: "#60A166",
    fontSize: '2.5vw',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center'
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.root} className="Notification">
        <Box
          sx={{
            pt: 5,
            pb: 7,
            width: 0.62,
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
          <Title>Notification</Title>
        </Box>
        <Stack
          spacing={7}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <PushButton type="submit" variant="contained"> Notify others more outside than you </PushButton>
          <PushButton type="submit" variant="contained"> Notify others the change of parking arrangement </PushButton>
        </Stack>
      </div>
    </ThemeProvider>
  );
}

export default Notification;
