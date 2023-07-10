import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";

function NuevaEnfermedadComponent() {
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

    const fnMandarDatos = async () => {
        console.log("Nombre: " + enfermedad.nombre);
        console.log("Tipo: " + enfermedad.tipo);
        console.log("Sintomas: " + enfermedad.sintomas);

        setLoading(true);
        setSuccess(false);
        await axios
            .post("http://127.0.0.1:8000/api/enfermedad/crear", enfermedad)
            .then((response) => {
                console.log(response.data);
                setEnfermedad(response.data);
                setLoading(false);
                setSuccess(true);

                timer.current = window.setTimeout(() => {
                    navigate("/enfermedades");
                }, 2000);
            })
            .catch((error) => { });
    };

    return (
        <form>
            <div className="form-container">
                <div className="form-inner">
                    <h3>Nueva Enfermedad</h3>
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
                        <label htmlFor="nss" className="form-label">Síntomas</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sintomas"
                            placeholder="Ingresa Síntomas"
                            name="sintomas"
                            value={enfermedad.sintomas}
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

export default NuevaEnfermedadComponent;
