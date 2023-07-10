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

function EditarDoctorComponent() {
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

  const [doctor, setDoctor] = useState({
    id: 0,
    nombre: "",
    especialidad: "",
    cedula: "",
    turno: "",
  });

  const inputChange = (event) => {
    setDoctor({
      ...doctor,
      [event.target.name]: event.target.value,
    });
  };

  //Consulta - START
  const fnObtenerDatos = async () => {
    setLoading(true);
    await axios
      .get("http://127.0.0.1:8000/api/doctor", {
        params: {
          id: location.state.id,
        },
      })
      .then((response) => {
        console.log(response.data);
        setDoctor(response.data);
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
    console.log("Nombre: " + doctor.nombre);
    console.log("Especialidad: " + doctor.especialidad);
    console.log("Cedula: " + doctor.cedula);
    console.log("Turno: " + doctor.turno);

    setLoading(true);
    await axios
      .post("http://127.0.0.1:8000/api/doctor/crear", doctor)
      .then((response) => {
        console.log(response.data);
        setDoctor(response.data);
        setLoading(false);

        navigate("/doctores");
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
    console.log("ID: " + doctor.id);

    setLoading(true);
    await axios
      .post("http://127.0.0.1:8000/api/doctor/borrar", doctor)
      .then((response) => {
        console.log(response.data);
        setDoctor(response.data);
        setLoading(false);

        navigate("/doctores");
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
          {"¿Eliminar doctor?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            El doctor se eliminará de forma permanente.
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
            <h3>Editar Doctor</h3>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Ingresa Nombre"
                name="nombre"
                value={doctor.nombre}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="especialidad" className="form-label">Especialidad</label>
              <input
                type="text"
                className="form-control"
                id="especialidad"
                placeholder="Ingresa Especialidad"
                name="especialidad"
                value={doctor.especialidad}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cedula" className="form-label">Cédula</label>
              <input
                type="text"
                className="form-control"
                id="cedula"
                placeholder="Ingresa Cédula"
                name="cedula"
                value={doctor.cedula}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="turno" className="form-label">Turno</label>
              <input
                type="text"
                className="form-control"
                id="turno"
                placeholder="Ingresa Turno"
                name="turno"
                value={doctor.turno}
                onChange={(e) => inputChange(e)}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default EditarDoctorComponent;
