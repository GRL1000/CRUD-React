import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import { Autocomplete, TextField, selectClasses } from "@mui/material";

function NuevaCitaComponent() {
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

    const [cita, setCita] = useState({
        id: 0,
        nombre_paciente: "",
        nombre_enfermedad: "",
        nombre_doctor: "",
        fecha: "",
        hora: "",
    });

    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [selectedEnfermedad, setSelectedEnfermedad] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedFecha, setSelectedFecha] = useState(cita.fecha);
    const [selectedHora, setSelectedHora] = useState(cita.hora);

    const handleDateChange = (newValue) => {
        setSelectedFecha(newValue);
        if (newValue) {
            setCita({
                ...cita,
                fecha: newValue.format('MM/DD/YYYY'),
            });
        }
    };

    const handleTimeChange = (newValue) => {
        setSelectedHora(newValue);
        if (newValue) {
            setCita({
                ...cita,
                hora: newValue.format('hh:mm A'),
            });
        }
    };

    const inputChange = (event) => {
        setCita({
            ...cita,
            [event.target.name]: event.target.value,
        });
    };

    const fnMandarDatos = async () => {
        cita.nombre_Paciente = selectedPaciente ? selectedPaciente.nombre : '';
        cita.nombre_Enfermedad = selectedEnfermedad ? selectedEnfermedad.nombre : '';
        cita.nombre_Doctor = selectedDoctor ? selectedDoctor.nombre : '';

        console.log("Paciente: " + cita.nombre_paciente);
        console.log("Motivo: " + cita.row.nombre_enfermedad);
        console.log("Doctor: " + cita.row.nombre_doctor);
        console.log("Fecha: " + cita.row.fecha);
        console.log("Hora: " + cita.row.hora);

        setLoading(true);
        setSuccess(false);
        await axios
            .post("http://127.0.0.1:8000/api/cita/crear", cita)
            .then((response) => {
                console.log(response.data);
                setCita(response.data);
                setLoading(false);
                setSuccess(true);

                timer.current = window.setTimeout(() => {
                    navigate("/citas");
                }, 2000);
            })
            .catch((error) => { });
    };

    const [row, setRow] = useState([]);

    return (
        <form>
            <div className="form-container">
                <div className="form-inner">
                    <h3>Nueva Cita</h3>
                    <div className="mb-3">
                        <Autocomplete
                            name="nombre_paciente"
                            options={row}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) => (
                                <TextField {...params} label="Paciente" value={cita.nombre_paciente} onChange={inputChange} />
                            )}
                            value={selectedPaciente}
                            onChange={(event, option) => setSelectedPaciente(option)}
                        />
                    </div>

                    <div className="mb-3">
                        <Autocomplete
                            name="nombre_enfermedad"
                            options={row}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) => (
                                <TextField {...params} label="Enfermedad" value={cita.nombre_enfermedad} onChange={inputChange} />
                            )}
                            value={selectedEnfermedad}
                            onChange={(event, option) => setSelectedEnfermedad(option)}
                        />
                    </div>

                    <div className="mb-3">
                        <Autocomplete
                            name="nombre_doctor"
                            options={row}
                            getOptionLabel={(option) => option.nombre_doctor}
                            renderInput={(params) => (
                                <TextField {...params} label="Doctor" value={cita.nombre_doctor} onChange={inputChange} />
                            )}
                            value={selectedDoctor}
                            onChange={(event, option) => setSelectedDoctor(option)}
                        />
                    </div>


                    <div className="mb-3">
                        <input
                            type="date"
                            name="fecha"
                            className="form-control"
                            value={cita.fecha}
                            onChange={(e) => inputChange(e)}
                        />
                    </div>

                    <div className="mb-3">
                        <input type="time" name="hora" className="form-control" value={cita.hora} onChange={(e) => inputChange(e)} />
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

export default NuevaCitaComponent;
