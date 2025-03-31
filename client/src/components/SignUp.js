import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [show, setShow] = useState(false);
  const [serverResposne, setServerResponse] = useState("");

  const submitForm = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      fetch("http://localhost:5000/auth/signup", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setServerResponse(data.message);
          setShow(true);
        })
        .catch((err) => console.log(err));

      reset();
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="container">
      <div className="form">
        {show ? (
          <>
            <Alert variant="success" onClose={() => setShow(false)} dismissible>
              <i className="bi bi-check-circle-fill me-2"></i>
              <p className="mb-0">{serverResposne}</p>
            </Alert>
          </>
        ) : null}

        <div className="text-center mb-4">
          <i
            className="bi bi-person-plus-fill text-primary"
            style={{ fontSize: "3rem" }}
          ></i>
          <h1>Create Account</h1>
          <p className="text-muted">
            Join our community to create and share recipes
          </p>
        </div>

        <form>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-person me-2"></i>Username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              {...register("username", { required: true, maxLength: 25 })}
            />
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
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-envelope me-2"></i>Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Your email address"
              {...register("email", { required: true, maxLength: 80 })}
            />

            {errors.email && (
              <p style={{ color: "red" }}>
                <small>Email is required</small>
              </p>
            )}

            {errors.email?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Email cannot exceed 80 characters</small>
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-lock me-2"></i>Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              {...register("password", { required: true, minLength: 8 })}
            />

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
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <i className="bi bi-lock-fill me-2"></i>Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", { required: true, minLength: 8 })}
            />

            {errors.confirmPassword && (
              <p style={{ color: "red" }}>
                <small>Password is required</small>
              </p>
            )}
            {errors.confirmPassword?.type === "minLength" && (
              <p style={{ color: "red" }}>
                <small>Password must be at least 8 characters</small>
              </p>
            )}
          </Form.Group>

          <Form.Group className="d-grid gap-2">
            <Button
              as="sub"
              variant="primary"
              size="lg"
              onClick={handleSubmit(submitForm)}
            >
              <i className="bi bi-person-plus me-2"></i>
              Sign Up
            </Button>
          </Form.Group>

          <div className="text-center mt-4">
            <Form.Group>
              <small className="text-muted">
                Already have an account? <Link to="/login">Login</Link>
              </small>
            </Form.Group>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
