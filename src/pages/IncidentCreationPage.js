import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SelectSearch, { fuzzySearch } from "react-select-search";
import { dbGet, dbPost } from 'utils/backendFetchers';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import "pages/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"

const theme = createTheme();
const formData = {};

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


export default function IncidentCreation(props) {
  const history = useHistory();
  const [confItems, setConfItems]  = React.useState([]);
  const [values, setValues] = React.useState("");

  React.useEffect(() => {
    dbGet("configuration-items/names").then(data => {
        setConfItems(data["items"]);
    }).catch(err => {console.log(err)});
    }   , []);

    const [formFields, setFormFields] = React.useState([{}])

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
      }

    const handleSubmit = (event) => {
        debugger;
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };
    

  const handleFormChange = (event, index, field) => {
    let value;
    let data = [...formFields];
    if (field === "description" || field === "priority") {
        value = event.target.value;
        data[index] = value;
    }
    else {
        value = event;
        data[index] = value;
        setFormFields(data);
        setValues([...values, value]);
    }
    formData[field] = value;
  }

  const exitForm = () => { 
    history.push(simple_routes.incidents);
    }

  const submitForm = (data) => { 
      formData["created_by"] = "SuperAdmin";
      dbPost("incidents", formData);
      history.push(simple_routes.incidents);
  }

  const addFields = () => {
    let object = {};

  setFormFields([...formFields, object])
  }

  return (
    <ThemeProvider theme={darkTheme}>
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
            <NotificationsIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Crear incidente
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  required
                  fullWidth
                  id="description"
                  label="Descripción"
                  autoFocus
                  onChange={event => handleFormChange(event, 0, "description")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="priority"
                  label="Prioridad"
                  name="priority"
                  onChange={event => handleFormChange(event, 1, "priority")}
                />
              </Grid>
              <Grid item xs={12}>
              <label>
                <b>Ítems de configuración</b>
              </label>
              </Grid>
              <Grid item xs={12}>
              {formFields.map((form, index) => {
                return (
                <Grid item xs={12}>
                <div key={index} class="row_div" >
                <SelectSearch
                    flexDirection="column"
                    options={confItems}
                    value={values[index]}
                    onChange={event => handleFormChange(event, index, "item_name_"+index)}
                    search
                    filterOptions={fuzzySearch} 
                    placeholder="Search something"
                />
                &nbsp; &nbsp; &nbsp;
                <IconButton
                        size="medium" 
                        aria-label="delete"
                        color="primary"
                        onClick={() => removeFields(index)}
                        >
                        <DeleteIcon/>
                    </IconButton>
                </div>
                </Grid>
                )
                })}
                <button onClick={addFields}>Nuevo ítem</button>
              </Grid>
              <Grid item xs={8} md={8} >
          </Grid>
            </Grid>
            <div class="button_div">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={() => submitForm()}
            >
            Crear incidente
            </Button>
            </div>
            <div class="button_div">
            <Button
              type="submit"
              color="error"
              fullWidth
              variant="contained"
              onClick={() => exitForm()}
            >
            Salir sin guardar
            </Button>
            </div>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}