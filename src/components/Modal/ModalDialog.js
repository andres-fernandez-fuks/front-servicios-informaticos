import * as React from 'react';
import {Button, Row} from 'reactstrap';
import { fuzzySearch } from "react-select-search";
import Select from 'react-select'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {dbGet} from 'utils/backendFetchers';
import { makeStyles } from '@material-ui/core/styles';
import { dbPost } from 'utils/backendFetchers';

const dialogStyles = makeStyles(theme => ({
    root: {
        color: 'black',
    },
    dialogPaper: {
        height : '400px',
        width : '400px',
        justifyContent: "center",
        backgroundColor: "white",
    },
}));

const selectStyles = { 
    menu: styles => ({
        ...styles,
        zIndex: 999,
        overflow: 'visible',
        color: "black",
        backgroundColor: "white",
    })
}

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [incidents, setIncidents] = React.useState([]);
  const [selectedIncident, setSelectedIncident] = React.useState(null);

  const classes = dialogStyles();
  
  React.useEffect(() => {
    dbGet("incidents/names").then(data => {
        setIncidents(data["incidents"]);
    }).catch(err => {console.log(err)});
    }   , []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddition = () => {
    props.addFunction(selectedIncident);
    setOpen(false);
  }

  return (
    <div >
        <Button className="btn-fill"
                color="info"
                size="sm"
                onClick={() => handleClickOpen()}
            >
            Agregar incidente
        </Button>
      <Dialog maxWidth="lg" open={open} onClose={handleClose} classes={{ paper : classes.dialogPaper}}>
        
        <DialogContent style={{overflow: "visible"}}>
          <DialogContentText>
            Elija un incidente para agregar
          </DialogContentText>
          <div style={{marginTop:"10px"}}/>
          <Select
            
            id={"incident"}
            options={incidents}
            styles = {selectStyles}
            onChange = {(event) => {setSelectedIncident(event.value)}}
            //value={getItemValue(index)}
            //onChange={event => handleFormChange(event, index, "incident_name_"+index)}
            search
            filterOptions={fuzzySearch} 
            placeholder="Buscar un incidente"
          />
        </DialogContent>
        <DialogActions style={{justifyContent: "center"}}>
            <Button color="secondary" onClick= {handleAddition}>Agregar</Button>
            <Button color="danger" onClick={handleClose}>Volver</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
