import React, { useState } from 'react';
import img from '../assets/img/img.jpg';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [dLogin, setDLogin] = useState({
    email: '',
    password: '',
  });

  const inputChange = (event) => {
    setDLogin({
      ...dLogin,
      [event.target.name]: event.target.value
    })
  }

  const navigate = useNavigate();

  const fnLogin = async (e) => {
    e.preventDefault();

    console.log('Usuario:' + dLogin.email)
    console.log('Contraseña:' + dLogin.password)

    await axios.post('http://127.0.0.1:8000/api/login', dLogin).then((response) => {
      console.log("Validando Acceso...")
      console.log(response.data)

      if (response.data.token !== "") {
        console.log("Ok")
        secureLocalStorage.setItem('token', response.data.token)

        navigate("/pacientes");
      }
      else {
        console.log("Error" + response.data.error)
      }

    }).catch((error) => {

    })
  }


  return (
    <form onSubmit={fnLogin}>
      <h3>Em Imma</h3>
      <img className='img' src={img} alt="Image" />
      <div className="mb-3">
        <label>Correo Electrónico</label>
        <input
          type="email"
          className="form-control"
          placeholder="Ingresa correo"
          name='email'
          value={dLogin.email} onChange={(e) => inputChange(e)}
        />
      </div>
      <div className="mb-3">
        <label>Contraseña</label>
        <input
          type="password"
          className="form-control"
          placeholder="Ingresa contraseña"
          name='password'
          value={dLogin.password} onChange={(e) => inputChange(e)} />
      </div>
      <div className="mb-3">
        <div className="custom-control custom-checkbox">
        </div>
        <div>
          <p></p>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary" onClick={fnLogin}>
          Ingresar
        </button>
      </div>
      <br></br>
    </form>
  );
};

export default LoginComponent;
