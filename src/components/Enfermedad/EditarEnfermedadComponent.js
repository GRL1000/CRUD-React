import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Button, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditarEnfermedadComponent() {
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

  const [enfermedad, setEnfermedad] = useState({
    id: 0,
    nombre: "",
    tipo: "",
    sintomas: "",
  });

  const inputChange = (event) => {
    setEnfermedad({
      ...enfermedad,
      [event.target.name]: event.target.value,
    });
  };

  const fnObtenerDatos = async () => {
    setLoading(true);
    await axios
      .get("http://127.0.0.1:8000/api/enfermedad", {
        params: {
          id: location.state.id,
        },
      })
      .then((response) => {
        console.log(response.data);
        setEnfermedad(response.data);
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

  const fnActualizarDatos = async () => {
    console.log("Nombre: " + enfermedad.nombre);
    console.log("Tipo: " + enfermedad.tipo);
    console.log("Síntomas: " + enfermedad.sintomas);

    setLoading(true);
    await axios
      .post("http://127.0.0.1:8000/api/enfermedad/crear", enfermedad)
      .then((response) => {
        console.log(response.data);
        setEnfermedad(response.data);
        setLoading(false);

        navigate("/enfermedades");
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
    console.log("ID: " + enfermedad.id);

    setLoading(true);
    await axios
      .post("http://127.0.0.1:8000/api/enfermedad/borrar", enfermedad)
      .then((response) => {
        console.log(response.data);
        setEnfermedad(response.data);
        setLoading(false);

        navigate("/enfermedades");
      })
      .catch((error) => { });
  };

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
          {"¿Eliminar Enfermedad?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            La enfermedad se eliminará de forma permanente.
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
            <h3>Editar Enfermedad</h3>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Ingresa Nombre"
                name="nombre"
                value={enfermedad.nombre}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">Tipo</label>
              <input
                type="text"
                className="form-control"
                id="tipo"
                placeholder="Ingresa Tipo"
                name="tipo"
                value={enfermedad.tipo}
                onChange={(e) => inputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="sintomas" className="form-label">Síntomas</label>
              <input
                type="text"
                className="form-control"
                id="sintomas"
                placeholder="Ingresa Síntomas"
                name="sintomas"
                value={enfermedad.sintomas}
                onChange={(e) => inputChange(e)}
              />
              <div align="center">
                    {loading ? (
                    <Box sx={{ display: "100%" }}>
                        <LinearProgress />
                    </Box>
                    ) : (
                    ""
                    )}
                </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default EditarEnfermedadComponent;
