import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";

function NuevoDoctorComponent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            "&:hover": {
                bgcolor: green[700],
            },
        }),
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

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

    const fnMandarDatos = async () => {
        console.log("Nombre: " + doctor.nombre);
        console.log("Especialidad: " + doctor.especialidad);
        console.log("Cedula: " + doctor.cedula);
        console.log("Turno: " + doctor.turno);

        setLoading(true);
        setSuccess(false);
        await axios
            .post("http://127.0.0.1:8000/api/doctor/crear", doctor)
            .then((response) => {
                console.log(response.data);
                setDoctor(response.data);
                setLoading(false);
                setSuccess(true);

                timer.current = window.setTimeout(() => {
                    navigate("/doctores");
                }, 2000);
            })
            .catch((error) => { 

        });
    };

    return (
        <form>
            <div className="form-container">
                <div className="form-inner">
                    <h3>Nuevo Doctor</h3>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Ingresa Nombre"
                            name="nombre"
                            value={doctor.nombre}
                            onChange={(e) => inputChange(e)}/>
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
                            onChange={(e) => inputChange(e)}/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="cedula" className="form-label">Cédula</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cedula"
                            placeholder="Ingresa cédula"
                            name="cedula"
                            value={doctor.cedula}
                            onChange={(e) => inputChange(e)}/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="turno" className="form-label">Turno</label>
                        <input
                            type="text"
                            className="form-control"
                            id="turno"
                            placeholder="Ingresa turno"
                            name="turno"
                            value={doctor.turno}
                            onChange={(e) => inputChange(e)}/>
                    </div>

                    <div className="d-grid position-relative">
                        <button type="submit" className={`btn ${loading ? 'btn-primary disabled' : success ? 'btn-success' : 'btn-primary'}`} disabled={loading} onClick={fnMandarDatos}>
                            {loading ? 'Cargando...' : success ? 'Registro exitoso' : 'Registrar'}
                        </button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: green[500],
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default NuevoDoctorComponent;
