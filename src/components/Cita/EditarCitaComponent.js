import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Button, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDayjs from "@mui/lab/AdapterDayjs";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function EditarCitaComponent() {
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

    const [cita, setCita] = useState({
        id: 0,
        nombre_paciente: "",
        nombre_enfermedad: "",
        nombre_doctor: "",
        fecha: "",
        hora: "",
    });

    const inputChange = (event) => {
        setCita({
            ...cita,
            [event.target.name]: event.target.value,
        });
    };

    //Consulta - START
    const fnObtenerDatos = async () => {
        setLoading(true);
        await axios
            .get("http://127.0.0.1:8000/api/cita", {
                params: {
                    id: location.state.id,
                },
            })
            .then((response) => {
                console.log(response.data);
                setCita(response.data);
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
        console.log("ID: " + cita.id);
        console.log("Paciente: " + cita.nombre_paciente);
        console.log("Motivo: " + cita.nombre_enfermedad);
        console.log("Doctor: " + cita.nombre_doctor);
        console.log("Fecha: " + cita.fecha);
        console.log("Hora: " + cita.hora);

        setLoading(true);
        await axios
            .post("http://127.0.0.1:8000/api/cita/crear", cita)
            .then((response) => {
                console.log(response.data);
                setCita(response.data);
                setLoading(false);

                navigate("/citas");
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
        console.log("ID: " + cita.id);

        setLoading(true);
        await axios
            .post("http://127.0.0.1:8000/api/cita/borrar", cita)
            .then((response) => {
                console.log(response.data);
                setCita(response.data);
                setLoading(false);

                navigate("/citas");
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
                    {"¿Eliminar cita?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        La cita se eliminará de forma permanente.
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
                        <h3>Editar Cita</h3>
                        <div className="mb-3">
                            <label htmlFor="nombre_paciente" className="form-label">Paciente</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre_paciente"
                                placeholder="Ingresa Paciente"
                                name="nombre_paciente"
                                value={cita.nombre_paciente}
                                onChange={(e) => inputChange(e)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nombre_enfermedad" className="form-label">Motivo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre_enfermedad"
                                placeholder="Ingresa Enfermedad"
                                name="nombre_enfermedad"
                                value={cita.nombre_enfermedad}
                                onChange={(e) => inputChange(e)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nombre_doctor" className="form-label">Doctor</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre_doctor"
                                placeholder="Ingresa Doctor"
                                name="nombre_doctor"
                                value={cita.nombre_doctor}
                                onChange={(e) => inputChange(e)}
                            />
                        </div>


                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker name="fecha" value={selectedFecha} onChange={handleDataChange} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>

                        <div className="mb-3">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    components={[
                                        'TimePicker',
                                        'MobileTimePicker',
                                        'DesktopTimePicker',
                                        'StaticTimePicker',
                                    ]}
                                >
                                    <DemoItem label="Hora">
                                        <MobileTimePicker name="hora" value={selectedHora} onChange={handleTimeChange} />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>

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
            </form >
        </>
    );
}

export default EditarCitaComponent;
