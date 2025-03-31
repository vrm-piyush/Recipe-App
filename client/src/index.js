import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import React from "react";
import ReactDOM from "react-dom";
import NavBar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import SignupPage from "./components/SignUp";
import LoginPage from "./components/Login";
import CreateRecipePage from "./components/CreateRecipe";

const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/create-recipe" element={<CreateRecipePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
