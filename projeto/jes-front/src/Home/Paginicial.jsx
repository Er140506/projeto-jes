import { Link } from "react-router-dom"
import "./Paginicial.css"

function Paginicial() {
    return (
        <div className="home-container">
            <div className="home-card">
                <h1>Bem-vindo</h1>
                <p>Escolha como deseja acessar o sistema</p>
                <div className="home-links">
                    <Link to="/Aluno">
                        Aluno
                    </Link>
                    <Link to="/Login">
                        Professor
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Paginicial