import React from "react";
import { deleteMatch } from "../../../../service/matchService";
import { GoAlertFill } from "react-icons/go";

const DeleteMatchModal = ({ match, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteMatch(match.id);
      // You can handle response if needed
    } catch (error) {
      console.log("error - ", error);
    }

    onDelete(match.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex items-center">
          <h2 className="text-xl font-bold mb-4 py-2">Confirm Deletion</h2>
          <span className="p-4 mb-3"><GoAlertFill /></span>
        </div>
        <p className="mb-4">
          Are you sure you want to delete the match{" "}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMatchModal;
