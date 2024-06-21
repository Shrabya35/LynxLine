import React from "react";
import "./Modal.css";

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Delete Category</h3>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-content">
          <p>Are you sure?</p>
          <div className="button-container">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="delete-button" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
