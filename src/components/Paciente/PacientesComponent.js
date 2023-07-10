import React, { useEffect, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useNavigate } from "react-router-dom";

import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import LogOutIcon from "@mui/icons-material/LogoutOutlined";
import secureLocalStorage from "react-secure-storage";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const PacientesComponent = () => {
  const actions = [
    { icon: <FileCopyIcon />, name: "Nuevo", key: "nuevo" },
  ];

  const [loading, setLoading] = useState(false);

  const handleFunction = (e, key) => {
    e.preventDefault();
    console.log("Presiono Boton: " + key);
    navigate("/paciente/nuevo", {
      state: {
        id: 0,
      },
    });
  };

  const navigate = useNavigate();

  const handleRowClick = (params) => {
    console.log("ID: " + params.row.id);
    console.log("Nombre: " + params.row.nombre); //se toman de colums - fields
    console.log("Edad: " + params.row.edad);
    console.log("NSS: " + params.row.nss);
    console.log("Domicilio: " + params.row.domicilio);
    navigate("/paciente/editar", {
      state: {
        id: params.row.id,
      },
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 130 },
    { field: "nss", headerName: "NSS", width: 130 },
    {
      field: "edad",
      headerName: "Edad",
      type: "number",
      width: 90,
    },
    {
      field: "domicilio",
      headerName: "Domicilio",
      description: "No se puede reorganizar.",
      sortable: false,
      width: 240,
      valueGetter: (params) =>
        `${params.row.domicilio}`,
    },
  ];

  const getData = async () => {
    setLoading(true);
    await axios.get("http://127.0.0.1:8000/api/pacientes").then((response) => {
      console.log(response.data);
      setRows(response.data);
      setLoading(false);
    });
  };

  const [rows, setRows] = useState([]);

  useEffect(() => {
    console.log("Render");
    getData();
  }, []);

  const fnLogout = async (e) => {
    e.preventDefault();
    console.log("Cerrando sesión");
    secureLocalStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="container" style={{ marginLeft: 'auto', marginRight: '10px' }}>
      <br />
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        ""
      )}
      <div className="table-responsive">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onRowClick={handleRowClick}
        />
      </div>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 20, right: 20 }}
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
      <br></br>
      <div className="d-flex align-items-center justify-content-center">
        <Button variant="contained" onClick={fnLogout} icon={<LogOutIcon />}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export default PacientesComponent;
