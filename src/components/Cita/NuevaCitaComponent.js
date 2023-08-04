import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import { Autocomplete, TextField, selectClasses } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

    const getData = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/pacientes').then((response) => {
            console.log(response.data);
            setRows(response.data);
        });
    };

    const [rows, setRows] = useState([]);

    useEffect(() => {
        console.log('Reader');
        getData();
    }, []);

    const EnfermedadRowClick = (params) => {
        console.log('ID: ' + params.row.id)
        console.log('Nombre: ' + params.row.id)
        navigate('/enfermedad/nuevo', {
            state: {
                id: params.row.id,
                nombre: params.row.nombre,
            }
        })
    }

    const getDataa = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/doctores').then((response) => {
            console.log(response.data);
            setRowss(response.data);
        });
    };

    const getDataaa = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/enfermedades').then((response) => {
            console.log(response.data);
            setRowsss(response.data);
        });
    };

    const [rowsss, setRowsss] = useState([]);

    useEffect(() => {
        console.log('Reader');
        getDataaa();
    }, []);

    const [rowss, setRowss] = useState([]);

    useEffect(() => {
        console.log('Reader');
        getDataa();
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

    const inputChange = (event) => {
        setCita({
            ...cita,
            [event.target.name]: event.target.value,
        });
    };

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

    const fnMandarDatos = async () => {
        cita.nombre_paciente = selectedPaciente ? selectedPaciente.nombre : '';
        cita.nombre_enfermedad = selectedEnfermedad ? selectedEnfermedad.nombre : '';
        cita.nombre_doctor = selectedDoctor ? selectedDoctor.nombre : '';

        if (selectedFecha) {
            cita.fecha = selectedFecha.format('MM/DD/YYYY');
        }

        if (selectedHora) {
            cita.hora = selectedHora.format('hh:mm A');
        }

        console.log("Paciente: " + cita.nombre_paciente);
        console.log("Motivo: " + cita.nombre_enfermedad);
        console.log("Doctor: " + cita.nombre_doctor);
        console.log("Fecha: " + cita.fecha);
        console.log("Hora: " + cita.hora);

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

    useEffect(() => {
        if (cita.nombre_paciente) {
            const pacienteSeleccionado = rows.find((paciente) => paciente.nombre === cita.nombre_paciente);
            setSelectedPaciente(pacienteSeleccionado);
        }
    }, [cita.nombre_paciente, rows]);

    useEffect(() => {
        if (cita.nombre_doctor) {
            const doctorSeleccionado = rowss.find((doctor) => doctor.nombre === cita.nombre_doctor);
            setSelectedDoctor(doctorSeleccionado);
        }
    }, [cita.nombre_doctor, rowss]);

    useEffect(() => {
        if (cita.nombre_enfermedad) {
            const enfermedadSeleccionada = rowsss.find((enfermedad) => enfermedad.nombre === cita.nombre_enfermedad);
            setSelectedEnfermedad(enfermedadSeleccionada);
        }
    }, [cita.nombre_enfermedad, rowsss]);

    return (
        <form>
            <div className="form-container">
                <div className="form-inner">
                    <h3>Nueva Cita</h3>
                    <div className="mb-3">
                        <Autocomplete
                            name="nombre_paciente"
                            options={rows}
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
                            options={rowsss}
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
                            options={rowss}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) => (
                                <TextField {...params} label="Doctor" value={cita.nombre_doctor} onChange={inputChange} />
                            )}
                            value={selectedDoctor}
                            onChange={(event, option) => setSelectedDoctor(option)}
                        />
                    </div>



                    <div className="mb-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker name="fecha" value={selectedFecha} onChange={handleDateChange} />
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
