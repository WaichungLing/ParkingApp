import {Button, Box, Divider, Grid, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from "../Images/cars.png";
import {useState} from "react";

function Login() {

	const theme = createTheme({
		palette: {
			primary: {
				main:'#60A166',
			},
		},
	});

	const styles = {
		paperContainer: {
			backgroundImage: `url(${Image})`,
			height: "400pt",
			width: "100%",
		},
		text: {
			color: "#60A166",
			fontWeight: 600,
			fontSize: 43,
		},
		inputSet: {
			display: "flex",
			flexDirection: "column",
			width: "65%",
		},
		signupButton: {
			backgroundColor: "#60A166",
			fontWeight: 600,
			fontSize: 25,
		},
		loginButton: {
			color: "#60A166",
			fontSize: 20,
		},
		loginGrid: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
		}
	};

	const [UserName, setUserName] = useState('');
	const [PhoneNumber, setPhoneNumber] = useState('');
	const [Email, setEmail] = useState('');
	const [Password, setPassword] = useState('');

	function handleClick() {
		document.getElementById("signup").style.display = 'none';
		document.getElementById("login").style.visibility = 'visible';
	}

	return (
		<ThemeProvider theme={theme}>
			<Grid container>
				<Grid item xs={6} sm={6} md={6}>
					<Box style={styles.paperContainer}></Box>
				</Grid>
				<Grid item xs={6} sm={6} md={6} container style={styles.loginGrid}>
					<Typography style={styles.text} component="h1">PARKING APP</Typography>
					<Box style={styles.inputSet} id="signup">
						<TextField id="username"
											 label="UserName"
											 value={UserName}
											 variant="outlined"
											 margin="normal"
											 onChange={(e) => setUserName(e.target.value)}>
						</TextField>
						<TextField id="phonenumber"
											 label="Phone #"
											 value={PhoneNumber}
											 variant="outlined"
											 margin="normal"
											 onChange={(e) => setPhoneNumber(e.target.value)}>
						</TextField>
						<TextField id="email"
											 label="Email"
											 value={Email}
											 variant="outlined"
											 margin="normal"
											 onChange={(e) => setEmail(e.target.value)}>
						</TextField>
						<TextField id="password"
											 label="Password"
											 value={Password}
											 variant="outlined"
											 margin="normal"
											 onChange={(e) => setPassword(e.target.value)}>
						</TextField>
						<Button style={styles.signupButton} type="submit" variant="contained" sx={{mt: 3, mb: 2}}>SIGNUP</Button>
						<Divider variant="middle" />
						<Button style={styles.loginButton} type="submit" variant="text" onClick={handleClick}> LOGIN</Button>
					</Box>
					<Box style={styles.inputSet} sx={{ visibility: 'hidden' }} id="login">
						<TextField id="username"
											label="UserName"
											value={UserName}
											variant="outlined"
											margin="normal"
											onChange={(e) => setUserName(e.target.value)}>
						</TextField>
						<TextField id="password"
											label="Password"
											value={Password}
											variant="outlined"
											margin="normal"
											onChange={(e) => setPassword(e.target.value)}>
						</TextField>
					<Button style={styles.loginButton} type="submit" variant="text"> LOGIN</Button>
				</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}

export default Login;