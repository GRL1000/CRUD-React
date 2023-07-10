import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditarPacienteComponent() {
  const location = useLocation();

  const actions = [
    { icon: <DeleteIcon />, name: "Eliminar", key: "eliminar" },
    { icon: <SaveIcon />, name: "Guardar", key: "guardar" },
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
  const [loading, setLoading] = useState(false);

  const [paciente, setPaciente] = useState({
    id: 0,
    nombre: "",
    edad: 0,
    nss: "",
    domicilio: "",
  });

  const inputChange = (event) => {
    setPaciente({
      ...paciente,
      [event.target.name]: event.target.value,
    });
  };

  //Consulta - START
  const fnObtenerDatos = async () => {
    setLoading(true);
    await axios
      .get("http://127.0.0.1:8000/api/paciente", {
        params: {
          id: location.state.id,
        },
      })
      .then((response) => {
        console.log(response.data);
        setPaciente(response.data);
        setLoading(false);
      })
      .catch((error) => { });
  };

  useEffect(() => {
    console.log("Render");
    if (location.state.id !== 0) {
      fnObtenerDatos();
    }
  }, []);
  //Consulta -END

  //Actualizar - START
  const fnActualizarDatos = async () => {
    console.log("Nombre: " + paciente.nombre);
    console.log("Edad: " + paciente.edad);
    console.log("NSS: " + paciente.nss);
    console.log("Domicilio: " + paciente.domicilio);

    setLoading(true);
    await axios
      .post("http://127.0.0.1:8000/api/paciente/crear", paciente)
      .then((response) => {
        console.log(response.data);
        setPaciente(response.data);
        setLoading(false);

        navigate("/pacientes");
      })
      .catch((error) => { });
  };
  //Actualizar -END

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Eliminar - START
  const fnEliminarDatos = async () => {
    console.log("ID: " + paciente.id);

    setLoading(true);
    await axios
      .post("http://127.0.0.1:8000/api/paciente/borrar", paciente)
      .then((response) => {
        console.log(response.data);
        setPaciente(response.data);
        setLoading(false);

        navigate("/pacientes");
      })
      .catch((error) => { });
  };
  //Eliminar - END

  return (
    <>
      {
        //Modal de confirmación para eliminar
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
        <div className="form-container">
          <div className="form-inner">
            <h3>Editar Paciente</h3>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Ingresa Nombre"
                name="nombre"
                value={paciente.nombre}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="edad" className="form-label">Edad</label>
              <input
                type="text"
                className="form-control"
                id="edad"
                placeholder="Ingresa Edad"
                name="edad"
                value={paciente.edad}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="nss" className="form-label">NSS</label>
              <input
                type="text"
                className="form-control"
                id="nss"
                placeholder="Ingresa NSS"
                name="nss"
                value={paciente.nss}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="domicilio" className="form-label">Domicilio</label>
              <input
                type="text"
                className="form-control"
                id="domicilio"
                placeholder="Ingresa Domicilio"
                name="domicilio"
                value={paciente.domicilio}
                onChange={(e) => inputChange(e)}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default EditarPacienteComponent;
