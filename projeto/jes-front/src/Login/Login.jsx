import React from 'react'
import {useState} from "react"
import "./Login.css"
import axios from 'axios'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password,setPassword] = useState("")

    const handleSubmit = async (e) => {
        event.preventDefault()

        console.log("Test",username,password)
        console.log("envio")
         try{

      const resposta = await axios.post('api/Login', {username, password})
      // 2. Pega o token retornado (mude '.token' se o nome no JSON for diferente)
      const token = resposta.data.token;

      localStorage.setItem('meu_token',token)

      alert('login feito')

      window.location.href= '/dashboard'

        } catch(erro) {
          console.error(erro);
        alert ("error")
      }
    }
   
  return (
    <div className="conteiner">
      <form onSubmit={handleSubmit}>
        <h1>Acesse o sistema</h1>
        <div>
              <input type="email" placeholder='E-mail'
              onChange={(e)=> setUsername(e.target.value)} required />
        </div>
         <div>
              <input type="password" placeholder='Senha'
              onChange={(e)=> setPassword(e.target.value)} required />
        </div>
        <button>Entrar</button>
      </form>
    </div>
  )
}

export default Login
