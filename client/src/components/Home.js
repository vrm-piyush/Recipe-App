import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import Recipe from "./Recipe";
import { Form, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

const LoggedInHome = () => {
  const [recipes, setRecipes] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [recipeId, setRecipeId] = useState(0);

  const accessToken = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const getAllRecipes = () => {
    setIsLoading(true);
    setError(null);

    fetch("http://localhost:5000/recipe/recipes")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Please try again later.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const closeModal = () => {
    setShow(false);
    reset(); // Reset form when closing modal
  };

  const showModal = (id) => {
    setShow(true);
    setRecipeId(id);

    const targetRecipe = recipes.find((recipe) => recipe.id === id);

    if (targetRecipe) {
      setValue("title", targetRecipe.title);
      setValue("description", targetRecipe.description);
    }
  };

  const updateRecipe = (data) => {
    if (!accessToken) {
      return alert("You are not logged in. Please log in to update a recipe.");
    }

    setIsLoading(true);

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(accessToken)}`,
      },
      body: JSON.stringify(data),
    };

    fetch(`http://localhost:5000/recipe/recipe/${recipeId}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRecipes(
          recipes.map((recipe) => {
            if (recipe.id === recipeId) {
              return { ...recipe, ...data };
            }
            return recipe;
          })
        );
        closeModal();
        getAllRecipes(); // Refresh recipes instead of page reload
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error updating recipe:", err);
        alert("Failed to update recipe. Please try again.");
        setIsLoading(false);
      });
  };

  const deleteRecipe = (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    if (!accessToken) {
      return alert("You are not logged in. Please log in to delete a recipe.");
    }

    setIsLoading(true);

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(accessToken)}`,
      },
    };

    fetch(`http://localhost:5000/recipe/recipe/${id}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        getAllRecipes();
      })
      .catch((err) => {
        console.error("Error deleting recipe:", err);
        alert("Failed to delete recipe. Please try again.");
        setIsLoading(false);
      });
  };

  return (
    <div className="recipes-container py-5">
      <Modal show={show} size="lg" onHide={closeModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="text-primary">Update Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form onSubmit={handleSubmit(updateRecipe)}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Title</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg"
                {...register("title", { required: true, maxLength: 25 })}
              />
            </Form.Group>
            {errors.title && errors.title.type === "required" && (
              <p className="text-danger mb-3">
                <small>Title is required</small>
              </p>
            )}
            {errors.title?.type === "maxLength" && (
              <p className="text-danger mb-3">
                <small>Title cannot exceed 25 characters</small>
              </p>
            )}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                className="form-control-lg"
                {...register("description", { required: true, maxLength: 500 })}
              />
            </Form.Group>
            {errors.description && errors.description.type === "required" && (
              <p className="text-danger mb-3">
                <small>Description is required</small>
              </p>
            )}
            {errors.description?.type === "maxLength" && (
              <p className="text-danger mb-3">
                <small>Description cannot exceed 500 characters</small>
              </p>
            )}
            <Form.Group className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={closeModal} type="button">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="px-4"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Recipe"}
              </Button>
            </Form.Group>
          </form>
        </Modal.Body>
      </Modal>

      <div className="container">
        <header className="mb-5 text-center">
          <h1 className="display-4 fw-bold text-primary">
            My Recipe Collection
          </h1>
          <p className="lead text-muted">
            Your personal cookbook of delicious recipes
          </p>
        </header>

        {error && (
          <div className="alert alert-danger text-center mb-4" role="alert">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={getAllRecipes}
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading && recipes.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-3">
              <i className="bi bi-journal"></i>
            </div>
            <h2 className="h4 mb-3">No recipes found</h2>
            <p className="text-muted mb-4">
              You haven't added any recipes yet.
            </p>
            <Link to="/create-recipe" className="btn btn-primary px-4 py-2">
              Add Your First Recipe
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {recipes.map((recipe, index) => (
              <div className="col" key={recipe.id || index}>
                <Recipe
                  title={recipe.title}
                  description={recipe.description}
                  onClick={() => showModal(recipe.id)}
                  onDelete={() => deleteRecipe(recipe.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LoggedOutHome = () => {
  return (
    <div className="home-hero py-5">
      <div className="container">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-6 py-5 text-center text-lg-start">
            <h1 className="display-3 fw-bold text-primary mb-4">
              Discover & Share Amazing Recipes
            </h1>
            <p className="lead mb-4">
              Create, store, and share your favorite recipes with our
              easy-to-use platform. Join our community of food lovers today!
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center justify-content-lg-start">
              <Link
                to="/signup"
                className="btn btn-primary btn-lg px-4 py-3 shadow-sm"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="btn btn-outline-primary btn-lg px-4 py-3"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <div className="p-5 bg-light rounded-4 shadow-sm text-center">
              <div className="display-1 text-primary mb-3">
                <i className="bi bi-journal-richtext"></i>
              </div>
              <h2 className="h4 mb-3">Your personal recipe collection</h2>
              <p className="text-muted">
                Sign up to start organizing all your favorite recipes in one
                place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [logged] = useAuth();

  return (
    <div className={logged ? "bg-light min-vh-100" : "bg-white min-vh-100"}>
      {logged ? <LoggedInHome /> : <LoggedOutHome />}
    </div>
  );
};

export default HomePage;
