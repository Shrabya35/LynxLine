import React, { useState, useEffect } from "react";
import "./Modal.css";

const UpdateModal = ({ isOpen, onClose, onUpdate, category }) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (isOpen && category) {
      setNewName(category.name);
    }
  }, [isOpen, category]);

  const handleUpdate = () => {
    onUpdate(newName);
    setNewName("");
    onClose();
  };

  const handleClose = () => {
    setNewName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Update Category</h3>
          <span className="close" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="modal-content">
          <input
            type="text"
            id="newCategoryName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
          />
          <div className="button-container">
            <button className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button className="update-button" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
