import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import LoginComponent from "./components/LoginComponent";
import PacientesComponent from "./components/Paciente/PacientesComponent";
import NuevoPacienteComponent from "./components/Paciente/NuevoPacienteComponent";
import EditarPacienteComponent from "./components/Paciente/EditarPacienteComponent";
import DoctoresComponent from './components/Doctor/DoctoresComponent';
import NuevoDoctorComponent from './components/Doctor/NuevoDoctorComponent';
import EditarDoctorComponent from './components/Doctor/EditarDoctorComponent';
import EnfermedadesComponent from './components/Enfermedad/EnfermedadesComponent';
import NuevaEnfermedadComponent from './components/Enfermedad/NuevaEnfermedadComponent';
import EditarEnfermedadComponent from './components/Enfermedad/EditarEnfermedadComponent';

import { useEffect, useState } from "react";

import secureLocalStorage from "react-secure-storage";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    console.log("Render");
    setToken(secureLocalStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route
          path="/pacientes"
          element={token == null ? <LoginComponent /> : <PacientesComponent />}
        />
        <Route
          path="/paciente/nuevo"
          element={token == null ? <LoginComponent /> : <NuevoPacienteComponent />}
        />
        <Route
          path="/paciente/editar"
          element={token == null ? <LoginComponent /> : <EditarPacienteComponent />}
        />
        <Route
          path="/doctores"
          element={token == null ? <LoginComponent /> : <DoctoresComponent />}
        />
        <Route
          path="/doctor/nuevo"
          element={token == null ? <LoginComponent /> : <NuevoDoctorComponent />}
        />
        <Route
          path="/doctor/editar"
          element={token == null ? <LoginComponent /> : <EditarDoctorComponent />}
        />

        <Route
          path="/enfermedades"
          element={token == null ? <LoginComponent /> : <EnfermedadesComponent />}
        />
        <Route
          path="/enfermedad/nuevo"
          element={token == null ? <LoginComponent /> : <NuevaEnfermedadComponent />}
        />
        <Route
          path="/enfermedad/editar"
          element={token == null ? <LoginComponent /> : <EditarEnfermedadComponent />}
        />
      </Routes>
    </Router>
  );
}

export default App;
