import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";
import { Button } from "@mui/material";

function NuevoPacienteComponent() {
    const location = useLocation();

    const navigate = useNavigate();
    //

    //Animacion de carga de botón
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

    //Animacion de carga de botón -END

    //Registro de un paciente
    const [paciente, setPaciente] = useState({
        id: 0, //el valor es int
        nombre: "", //el valor es string
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
        //e.preventDefault();

        console.log("Nombre: " + paciente.nombre);
        console.log("Edad: " + paciente.edad);
        console.log("NSS: " + paciente.nss);
        console.log("Domicilio: " + paciente.domicilio);

        setLoading(true); //Animacion de carga true
        setSuccess(false);
        await axios
            .post("http://127.0.0.1:8000/api/paciente/crear", paciente)
            .then((response) => {
                console.log(response.data);
                setPaciente(response.data); //Agregar los datos para su visualizacion
                setLoading(false); //animacion de carga false
                setSuccess(true);

                timer.current = window.setTimeout(() => {
                    navigate("/pacientes");
                }, 2000);

                //navigate("/pacientes");
            })
            .catch((error) => { });
    };

    //Registro de un paciente -END

    return (
        <form>
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
                    name='domicilio'
                    value={paciente.domicilio} onChange={(e) => inputChange(e)}
                />
            </div>
            <Box sx={{ display: "100%", alignItems: "right" }}>
                <Box sx={{ m: 1, position: "relative" }}>
                    <Button
                        variant="contained"
                        sx={buttonSx}
                        disabled={loading}
                        onClick={fnMandarDatos}
                    >
                        Crear
                    </Button>
                    {loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: green[500],
                                top: "50%",
                                left: "100%",
                                marginTop: "12px",
                                marginLeft: "12px",
                            }}
                        />
                    )}
                </Box>
            </Box>
        </form >
    );
}

export default NuevoPacienteComponent;
