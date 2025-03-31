import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import Recipe from "./Recipe";
import { Form, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

const LoggedInHome = () => {
  const [recipes, setRecipes] = useState([]);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [recipeId, setRecipeId] = useState(0);

  let accessToken = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const getAllRecipes = () => {
    fetch("http://localhost:5000/recipe/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("http://localhost:5000/recipe/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const closeModal = () => {
    setShow(false);
  };

  const showModal = (id) => {
    setShow(true);
    setRecipeId(id);

    recipes.map((recipe) => {
      if (recipe.id === id) {
        setValue("title", recipe.title);
        setValue("description", recipe.description);
      }
    });
  };

  const updateRecipe = (data) => {
    if (!accessToken) {
      return alert("You are not logged in. Please log in to update a recipe.");
    }

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(accessToken)}`,
      },
      body: JSON.stringify(data),
    };

    fetch(`http://localhost:5000/recipe/recipe/${recipeId}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(
          recipes.map((recipe) => {
            if (recipe.id === recipeId) {
              return { ...recipe, ...data };
            }
            return recipe;
          })
        );
        const reload = window.location.reload();
        reload();
        closeModal();
      })
      .then((err) => console.log(err));
  };

  const deleteRecipe = (id) => {
    console.log(id);
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(accessToken)}`,
      },
    };
    fetch(`http://localhost:5000/recipe/recipe/${id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        getAllRecipes();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="recipes">
      <Modal show={show} size="lg" onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                onClick={handleSubmit(updateRecipe)}
              >
                Update
              </Button>
            </Form.Group>
          </form>
        </Modal.Body>
      </Modal>
      <h1 className="heading">List of Recipes</h1>
      {recipes.map((recipe, index) => {
        return (
          <Recipe
            title={recipe.title}
            key={index}
            description={recipe.description}
            onClick={() => showModal(recipe.id)}
            onDelete={() => {
              deleteRecipe(recipe.id);
            }}
          />
        );
      })}
    </div>
  );
};

const LoggedOutHome = () => {
  return (
    <div className="home container">
      <h1 className="heading">Welcome to the Recipes</h1>
      <Link to="/signup" className="btn btn-primary btn-lg">
        Get Started
      </Link>
    </div>
  );
};

const HomePage = () => {
  const [logged] = useAuth();

  return (
    <div className="home container">
      {logged ? <LoggedInHome /> : <LoggedOutHome />}
    </div>
  );
};

export default HomePage;
