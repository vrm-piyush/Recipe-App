import React, { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showAlert, setShowAlert] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const navigate = useNavigate();

  // Watch password for comparison
  const password = watch("password");

  const submitForm = async (data) => {
    try {
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
        credentials: "include", // For cookies if needed
      };

      const response = await fetch(
        "http://localhost:5000/auth/signup",
        requestOptions
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setServerResponse(result.message || "Account created successfully!");
      setAlertVariant("success");
      setShowAlert(true);
      reset();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setServerResponse(
        error.message || "An error occurred during registration"
      );
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  return (
    <div className="container">
      <div
        className="form mx-auto"
        style={{ maxWidth: "500px", padding: "20px" }}
      >
        {showAlert && (
          <Alert
            variant={alertVariant}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            <i
              className={`bi ${
                alertVariant === "success"
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-triangle-fill"
              } me-2`}
            ></i>
            <span className="mb-0">{serverResponse}</span>
          </Alert>
        )}

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

        <Form onSubmit={handleSubmit(submitForm)}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-person me-2"></i>Username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              {...register("username", {
                required: "Username is required",
                maxLength: {
                  value: 25,
                  message: "Username cannot exceed 25 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              })}
            />
            {errors.username && (
              <p className="text-danger mt-1">
                <small>{errors.username.message}</small>
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-danger mt-1">
                <small>{errors.email.message}</small>
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must include uppercase, lowercase, number and special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-danger mt-1">
                <small>{errors.password.message}</small>
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
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-danger mt-1">
                <small>{errors.confirmPassword.message}</small>
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="terms"
              label="I agree to the Terms of Service and Privacy Policy"
              {...register("terms", {
                required: "You must agree to the terms to continue",
              })}
            />
            {errors.terms && (
              <p className="text-danger mt-1">
                <small>{errors.terms.message}</small>
              </p>
            )}
          </Form.Group>

          <Form.Group className="d-grid gap-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Signing Up...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>
                  Sign Up
                </>
              )}
            </Button>
          </Form.Group>

          <div className="text-center mt-4">
            <Form.Group>
              <small className="text-muted">
                Already have an account? <Link to="/login">Login</Link>
              </small>
            </Form.Group>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
