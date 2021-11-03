import {Button, Box, Divider, Grid, TextField, Typography } from "@mui/material";
import Image from "../Images/cars.png";

function Login() {

    /*
    * 1. Create a new .js file in src, you can create multiple .js files as components and import them in a final file
    * 2. To test how it looks like on web, simply replace the <App /> in index.js with the .js file you want to use
    * 3. How to import other components? As simple as the <PlainText /> in this example.
    * 4. For styling, you can include a css file like ./App.cs, or use sx prop provided by Material UI,
    *    see https://mui.com/system/basics/#demo
    * 5. When push the code, try to use .gitignore to ignore node_modules directory, because there are too many files.
    */

    const styles = {
        paperContainer: {
            backgroundImage: `url(${Image})`
        }
    };

    return (
      <div className="Login">

        <Grid container>
            <Grid item xs={6} sm={6} md={6}>
                <Box style={styles.paperContainer} sx={{height: "100%", width: "100%"}}></Box>
            </Grid>
            <Grid item xs={6} sm={6} md={6} container direction="column" justifyContent="center" alignItems="center">
                <Typography style={{color: "#60A166", fontWeight: 600, fontSize: 43}} component="h1">PARKING APP</Typography>
                <Box sx={{display: "flex", flexDirection: "column", width: "65%"}}>
                    <TextField id="username" label="UserName" variant="outlined" margin="normal"></TextField>
                    <TextField id="phonenumber" label="Phone #" variant="outlined" margin="normal"></TextField>
                    <TextField id="email" label="Email" variant="outlined" margin="normal"></TextField>
                    <TextField id="password" label="Password" variant="outlined" margin="normal"></TextField>
                    <Button style={{backgroundColor: "#60A166", fontWeight: 600, fontSize: 25}} type="submit" variant="contained" sx={{mt: 3, mb: 2}}>SIGNUP</Button>
                    <Divider variant="middle" />
                    <Button style={{color: "#60A166", fontSize: 20}} type="submit" variant="text"> LOGIN</Button>
                </Box>
            </Grid>
        </Grid>
      </div>
    );
  }

  export default Login;