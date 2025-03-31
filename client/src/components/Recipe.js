import React, { useState } from "react";
import { Button, Card, Badge, Collapse } from "react-bootstrap";
import PropTypes from "prop-types";

const Recipe = ({
  title,
  description,
  onClick,
  onDelete,
  createdAt,
  category,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "Added recently";

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Added recently"
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    } catch (error) {
      return "Added recently";
    }
  };

  // Truncate text for description
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substr(0, maxLength) + "...";
  };

  // Determine if description needs truncation
  const needsTruncation = description && description.length > 150;

  // Handle card click for expansion (while avoiding button clicks)
  const handleCardClick = (e) => {
    // Only toggle if not clicking on buttons
    if (!e.target.closest(".btn") && !e.target.closest(".btn-group")) {
      setExpanded(!expanded);
    }
  };

  // Handle edit click with stopPropagation to avoid card toggle
  const handleEditClick = (e) => {
    e.stopPropagation();
    onClick(e);
  };

  // Handle delete click with stopPropagation to avoid card toggle
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(e);
  };

  return (
    <Card
      className={`recipe mb-3 shadow-sm ${
        needsTruncation ? "cursor-pointer" : ""
      }`}
      onClick={needsTruncation ? handleCardClick : undefined}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0 d-flex align-items-center">
            <i className="bi bi-journal-text me-2 text-primary"></i>
            {title}
          </Card.Title>
          {category && (
            <Badge bg="info" pill className="px-2 py-1">
              {category}
            </Badge>
          )}
        </div>

        <div className="recipe-description my-3">
          {needsTruncation ? (
            <>
              {expanded ? (
                <p>{description}</p>
              ) : (
                <p>{truncateText(description)}</p>
              )}
              <div className="text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  className="text-muted text-decoration-none p-0 mt-n1 mb-2"
                >
                  {expanded ? (
                    <>
                      Show less <i className="bi bi-chevron-up"></i>
                    </>
                  ) : (
                    <>
                      Show more <i className="bi bi-chevron-down"></i>
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p>{description}</p>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="recipe-info d-flex align-items-center text-muted">
            <small>
              <i className="bi bi-clock me-1"></i> {formatDate(createdAt)}
            </small>
          </div>
          <div className="btn-group">
            <Button
              variant="outline-primary"
              onClick={handleEditClick}
              className="d-flex align-items-center"
              aria-label="Edit recipe"
            >
              <i className="bi bi-pencil-square me-1"></i> Edit
            </Button>
            <Button
              variant="outline-danger"
              onClick={handleDeleteClick}
              className="d-flex align-items-center"
              aria-label="Delete recipe"
            >
              <i className="bi bi-trash me-1"></i> Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Add PropTypes for better development experience and documentation
Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  createdAt: PropTypes.string,
  category: PropTypes.string,
};

// Default props
Recipe.defaultProps = {
  description: "",
  createdAt: null,
  category: null,
};

export default Recipe;
