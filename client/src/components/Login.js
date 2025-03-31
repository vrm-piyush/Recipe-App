import React, { useState } from "react";
import { Form, Button, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: localStorage.getItem("rememberedUsername") || "",
    },
  });

  const navigate = useNavigate();

  const loginUser = (data) => {
    setIsLoading(true);
    setLoginError(null);

    // Save username if remember me is checked
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", data.username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("http://localhost:5000/auth/login", requestOptions)
      .then((res) => {
        if (!res.ok) {
          // Handle HTTP errors like 401, 403, 500, etc.
          if (res.status === 401) {
            throw new Error("Invalid username or password");
          } else {
            throw new Error(`Server error: ${res.status}`);
          }
        }
        return res.json();
      })
      .then((data) => {
        if (!data.access_token) {
          throw new Error("Login failed. Please try again.");
        }
        login(data.access_token);
        navigate("/");
      })
      .catch((err) => {
        console.error("Login error:", err);
        setLoginError(err.message || "Login failed. Please try again.");
        setIsLoading(false);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                  <i
                    className="bi bi-person-circle text-primary"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h1 className="h3 fw-bold">Welcome Back</h1>
                <p className="text-muted">
                  Enter your credentials to access your account
                </p>
              </div>

              {loginError && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {loginError}
                </Alert>
              )}

              <form onSubmit={handleSubmit(loginUser)}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-person me-2"></i>Username
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Your username"
                      className={errors.username ? "is-invalid" : ""}
                      {...register("username", {
                        required: "Username is required",
                        maxLength: {
                          value: 25,
                          message: "Username cannot exceed 25 characters",
                        },
                      })}
                    />
                    {errors.username && (
                      <div className="invalid-feedback">
                        {errors.username.message}
                      </div>
                    )}
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-lock me-2"></i>Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      className={errors.password ? "is-invalid" : ""}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                      type="button"
                    >
                      <i
                        className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                      ></i>
                    </Button>
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password.message}
                      </div>
                    )}
                  </InputGroup>
                </Form.Group>

                <div className="d-flex justify-content-between mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <Link
                    to="/forgot-password"
                    className="text-decoration-none small"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Form.Group className="d-grid gap-2 mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form.Group>

                <div className="text-center mt-4">
                  <Form.Group>
                    <small className="text-muted">
                      Don't have an account yet?{" "}
                      <Link
                        to="/signup"
                        className="text-decoration-none fw-bold"
                      >
                        Create account
                      </Link>
                    </small>
                  </Form.Group>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
