import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import axios from "axios";

import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  //Efecto de transición
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditarPacienteComponent() {
  const location = useLocation();

  //Menu de opciones
  const actions = [
    { icon: <DeleteIcon />, name: "Eliminar", key: "eliminar" },
    { icon: <SaveIcon />, name: "Guardar", key: "guardar" },
    //{ icon: <PrintIcon />, name: 'Print' },
    //{ icon: <ShareIcon />, name: 'Share' },
  ];

  const handleFunction = (e, key) => {
    e.preventDefault();
    if (key === "guardar") {
      fnActualizarDatos();
    } else {
      handleClickOpen();
    }
    console.log("Presiono Boton: " + key);
  };

  const navigate = useNavigate();
  //

  //Animacion de carga
  const [loading, setLoading] = useState(false);

  //Creación del objeto
  const [paciente, setPaciente] = useState({
    id: 0, //el valor es int
    nombre: "", //el valor es string
    edad: 0,
    nss: "",
    domicilio: "",
  });

  const inputChange = (event) => {
    //Permite la manipulación de datos obtenidos
    setPaciente({
      ...paciente,
      [event.target.name]: event.target.value,
    });
  };

  //Creación del objeto -END

  //Consulta de un paciente
  const fnObtenerDatos = async () => {
    setLoading(true); //Animacion de carga true
    await axios
      .get("http://127.0.0.1:8000/api/paciente", {
        params: {
          id: location.state.id, //Se utiliza el parametro dado en PacientesComponent
        },
      })
      .then((response) => {
        console.log(response.data);
        setPaciente(response.data); //Agregar los datos para su visualizacion
        setLoading(false); //animacion de carga false
      })
      .catch((error) => { });
  };

  useEffect(() => {
    console.log("Render");
    //Si el id tiene datos realiza la consulta, sino, no realizar la consulta y se crea
    if (location.state.id !== 0) {
      fnObtenerDatos(); //para que se vea en consola la funcion
    }
  }, []);
  //Consulta de un paciente -END

  //Actualización de un paciente
  const fnActualizarDatos = async () => {
    console.log("Nombre: " + paciente.nombre);
    console.log("Edad: " + paciente.edad);
    console.log("NSS: " + paciente.nss);
    console.log("Domicilio: " + paciente.domicilio);

    setLoading(true); //Animacion de carga true
    await axios
      .post("http://127.0.0.1:8000/api/paciente/crear", paciente)
      .then((response) => {
        console.log(response.data);
        setPaciente(response.data); //Agregar los datos para su visualizacion
        setLoading(false); //animacion de carga false

        navigate("/pacientes");
      })
      .catch((error) => { });
  };

  //Actualización de un paciente -END

  //Mensaje de confirmacion para eliminar paciente
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  //Mensaje de confirmacion para eliminar paciente -END

  //Eliminar un paciente
  const fnEliminarDatos = async () => {
    console.log("ID: " + paciente.id);

    setLoading(true); //Animacion de carga true
    await axios
      .post("http://127.0.0.1:8000/api/paciente/borrar", paciente)
      .then((response) => {
        console.log(response.data);
        setPaciente(response.data); //Agregar los datos para su visualizacion
        setLoading(false); //animacion de carga false

        navigate("/pacientes");
      })
      .catch((error) => { });
    };
    

  return (
    <>
      {
        //Mensaje de confirmación para eliminar
      }
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle >
          {"¿Eliminar paciente?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            El paciente se eliminará de forma permanente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={fnEliminarDatos} autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(e) => {
              handleFunction(e, action.key);
            }}
          />
        ))}
      </SpeedDial>

      <form>
        <h2>ID: {location.state.id}</h2>
        <div className="mb-2">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingresa Nombre"
            name='nombre'
            value={paciente.nombre} onChange={(e) => inputChange(e)}
          />
        </div>

        <div className="mb-2">
          <label>Edad</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingresa Edad"
            name='edad'
            value={paciente.edad} onChange={(e) => inputChange(e)}
          />
        </div>

        <div className="mb-2">
          <label>NSS</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingresa NSS"
            name='nss'
            value={paciente.nss} onChange={(e) => inputChange(e)}
          />
        </div>

        <div className="mb-2">
          <label>Domicilio</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingresa Domicilio"
            name='nombre'
            value={paciente.domicilio} onChange={(e) => inputChange(e)}
          />
        </div>
      </form>
    </>
  );
}

export default EditarPacienteComponent;
