import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Login } from 'utils/backendFetchers';
import "pages/login.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import Background from 'assets/img/background.jpg';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    overrides: {
        MuiCssBaseline: {
          '@global': {
            body: {
              backgroundImage: `url(${Background})`
            }
          }
        }
    }
  });

  const mui_theme = createMuiTheme({
    palette: {

    },
    typography: {
      useNextVariants: true
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          body: {
            backgroundImage:
              "url(https://designshack.net/wp-content/uploads/gradient-background.jpg)"
          }
        }
      }
    }
  });

export default function SignIn() {
    const history = useHistory();
  const [incorrectLogin, setIncorrectLogin] = React.useState(false);  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var request_data = {
        username: data.get('email'),
        password: data.get('password')
    }
    Login(request_data).then(response => {
        localStorage.setItem("token", response.token)
        // localStorage.setItem("user", JSON.stringify(response.user))
        localStorage.setItem("role_id", response.user.role.id)
        localStorage.setItem("role", response.user.role.name)
        localStorage.setItem("user_id", response.user.id)
        localStorage.setItem("username", response.user.username)
        history.push(simple_routes.dashboard)

    }).catch(err => {
        setIncorrectLogin(true);
    });
  };

  function showIncorrectMessageIfNecessary() {
    if (incorrectLogin) {
        return (
            <InputLabel className="login-label">
                Usuario o contraseña incorrectos
            </InputLabel>
        )
    }
  }

  function updateLoginStatus() {
      setIncorrectLogin(false);
  }

  var sectionStyle = {
    backgroundImage: `url(${Background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh'
  };

  return (
    <div className="Container">
    <ThemeProvider theme={darkTheme}> 
    <CssBaseline />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingreso
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={function(){updateLoginStatus()}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={function(){updateLoginStatus()}}
            />
            {showIncorrectMessageIfNecessary()}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  );
}
