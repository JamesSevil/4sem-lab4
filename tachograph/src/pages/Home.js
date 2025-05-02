import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"
import "../styles/home.css";

const Home = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username") || localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        } else if (oldPassword === newPassword) {
            alert("Старый и новый пароли совпадают!");
            return;
        } else if (newPassword.length < 4 || newPassword.length > 20) {
            alert("Пароль должен содержать от 4 до 20 символов!");
            return;
        }

        try {
            const response = await api.put("/auth", {
                login: username,
                oldPassword: oldPassword,
                newPassword: newPassword
            });

            if (response.status === 200 && response.data.success) {
                console.log(response.data.message);
                alert("Пароль был успешно изменен!");
            } else {
                console.error("Ошибка при изменении пароля: ", response.data.message);
                alert(`Не удалось изменить пароль: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при изменении пароля: ", error.response.data.message);
            alert(`Не удалось изменить пароль: ${error.response.data.message}`);
        }

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleLogout = () => {
        sessionStorage.removeItem("username");
        localStorage.removeItem("username");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        navigate('/login');
    };

    return (
        <div className="home">
            <h2>Добро пожаловать, {username}!</h2>

            <Link to="/upload">Загрузить новый файл</Link>
            
            <div className="changepassword">
                <p></p>
                <b>Смена пароля</b>
                <div className="input">
                    <input
                        type="password"
                        id="oldpassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Старый пароль"
                        required
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        id="newpassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Новый пароль"
                        required
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        id="confirmpassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Повтор нового пароля"
                        required
                    />
                </div>
                <button onClick={handleChangePassword}>Сменить</button>
            </div>
            
            <p><button onClick={handleLogout}>Выйти из системы</button></p>
        </div>
    );
};

export default Home;