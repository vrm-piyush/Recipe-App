import React from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

const CreateRecipePage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitRecipe = (data) => {
    const accessToken = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    if (!accessToken) {
      return alert("You are not logged in. Please log in to create a recipe.");
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(accessToken)}`,
      },
      body: JSON.stringify(data),
    };

    fetch("http://localhost:5000/recipe/recipes", requestOptions)
      .then((res) => res.json())
      .then((data) => reset())
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <div className="form" style={{ maxWidth: "800px" }}>
        <div className="text-center mb-4">
          <i
            className="bi bi-journal-plus text-primary"
            style={{ fontSize: "3rem" }}
          ></i>
          <h1>Create A Recipe</h1>
          <p className="text-muted">
            Share your culinary masterpiece with the world
          </p>
        </div>

        <form>
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="bi bi-tag me-2"></i>Recipe Title
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Give your recipe a catchy name"
              className="form-control-lg"
              {...register("title", { required: true, maxLength: 25 })}
            />
          </Form.Group>
          {errors.title && (
            <p style={{ color: "red" }}>
              <small>Title is required</small>
            </p>
          )}
          {errors.title?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Title cannot exceed 25 characters</small>
            </p>
          )}

          <Form.Group className="mb-4">
            <Form.Label>
              <i className="bi bi-card-text me-2"></i>Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Describe your recipe, including preparation steps and cooking tips..."
              className="form-control-lg"
              {...register("description", { required: true, maxLength: 500 })}
            />
          </Form.Group>
          {errors.description && (
            <p style={{ color: "red" }}>
              <small>Description is required</small>
            </p>
          )}
          {errors.description?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Description cannot exceed 500 characters</small>
            </p>
          )}

          <Form.Group className="d-grid gap-2 mt-4">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              onClick={handleSubmit(submitRecipe)}
            >
              <i className="bi bi-cloud-upload me-2"></i>
              Create Recipe
            </Button>
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipePage;
