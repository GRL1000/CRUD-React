import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';



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

        <Route
          path="/citas"
          element={token == null ? <LoginComponent /> : <CitasComponent />}
        />
        <Route
          path="/cita/nuevo"
          element={token == null ? <LoginComponent /> : <NuevaCitaComponent />}
        />
        <Route
          path="/cita/editar"
          element={token == null ? <LoginComponent /> : <EditarCitaComponent />}
        />
      </Routes>
    </Router>
  );
}

export default App;
