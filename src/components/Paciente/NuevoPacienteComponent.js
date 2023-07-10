import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";

function NuevoPacienteComponent() {
    const location = useLocation();

    const navigate = useNavigate();

    //Animacion de carga de botón - START
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

    //Animacion de carga de botón - END

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

    const fnMandarDatos = async () => {
        console.log("Nombre: " + paciente.nombre);
        console.log("Edad: " + paciente.edad);
        console.log("NSS: " + paciente.nss);
        console.log("Domicilio: " + paciente.domicilio);

        setLoading(true);
        setSuccess(false);
        await axios
            .post("http://127.0.0.1:8000/api/paciente/crear", paciente)
            .then((response) => {
                console.log(response.data);
                setPaciente(response.data);
                setLoading(false);
                setSuccess(true);

                timer.current = window.setTimeout(() => {
                    navigate("/pacientes");
                }, 2000);
            })
            .catch((error) => { });
    };

    return (
        <form>
            <div className="form-container">
                <div className="form-inner">
                    <h3>Nuevo Paciente</h3>
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

export default NuevoPacienteComponent;
