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
      <h1>Create A Recipe</h1>
      <form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
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
        <br />
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
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
        <br />
        <Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(submitRecipe)}
          >
            Create Recipe
          </Button>
        </Form.Group>
      </form>
    </div>
  );
};

export default CreateRecipePage;
