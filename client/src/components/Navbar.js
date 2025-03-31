import React from "react";
import { Link } from "react-router-dom";
import { useAuth, logout } from "../auth";

const LoggedInLinks = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" to={"/"}>
          <i className="bi bi-house-door me-1"></i>Home
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to={"/create-recipe"}>
          <i className="bi bi-plus-circle me-1"></i>Create Recipe
        </Link>
      </li>
      <li className="nav-item">
        <a
          className="nav-link active"
          href="/"
          onClick={() => {
            logout();
          }}
        >
          <i className="bi bi-box-arrow-right me-1"></i>Log Out
        </a>
      </li>
    </>
  );
};

const LoggedOutLinks = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" to={"/"}>
          <i className="bi bi-house-door me-1"></i>Home
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to={"/signup"}>
          <i className="bi bi-person-plus me-1"></i>Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to={"/login"}>
          <i className="bi bi-box-arrow-in-right me-1"></i>Login
        </Link>
      </li>
    </>
  );
};

const NavBar = () => {
  const [logged] = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"}>
          <i className="bi bi-journal-richtext me-2"></i>Recipes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
          </ul>
          <form className="d-flex">
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Search recipes..."
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
