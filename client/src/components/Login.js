import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  console.log(watch("username")); // watch input value by passing the name of it

  const loginUser = (data) => {
    console.log(data);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("http://localhost:5000/auth/login", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.access_token);
        login(data.access_token);
        navigate("/");
      })
      .catch((err) => console.log(err));

    reset();
  };

  return (
    <div className="container">
      <div className="form">
        <h1>Login</h1>
        <form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your username"
              {...register("username", { required: true, maxLength: 25 })}
            />
          </Form.Group>
          {errors.username && (
            <p style={{ color: "red" }}>
              <small>Username is required</small>
            </p>
          )}
          {errors.username?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Username cannot exceed 25 characters</small>
            </p>
          )}
          <br />
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              {...register("password", { required: true, minLength: 8 })}
            />
          </Form.Group>
          {errors.password && (
            <p style={{ color: "red" }}>
              <small>Password is required</small>
            </p>
          )}
          {errors.password?.type === "minLength" && (
            <p style={{ color: "red" }}>
              <small>Password must be at least 8 characters</small>
            </p>
          )}
          <br />
          <Form.Group>
            <Button
              as="sub"
              variant="primary"
              onClick={handleSubmit(loginUser)}
            >
              Login
            </Button>
          </Form.Group>
          <br />
          <Form.Group>
            <small>
              Do not have an account?<Link to="/signup">Create account</Link>
            </small>
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
