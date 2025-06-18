import { useState } from "react";
import { editMatch } from "../../../../service/matchService";

const EditMatchModal = ({ match, onClose, onSave }) => {
  const [editMatchForm, setEditMatchForm] = useState({
    matchDate: new Date(match.matchDate).toISOString().slice(0, 16),
    homeTeamGoals: "",
    awayTeamGoals: ""
  });

  const [errorMessage, setErrorMessage] = useState('');


  const handleChange = (e) => {
    setEditMatchForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      let payload = { ...editMatchForm }

      if (new Date() >= new Date(match.matchDate)) {
        payload.matchDate = null
      } else {
        payload.homeTeamGoals = null;
        payload.awayTeamGoals = null;
      }


      const response = await editMatch(match.id, payload);

      if (response && response.success) {
        if (new Date() >= new Date(match.matchDate)) {
          // Editing results only, don't update matchDate locally
          onSave({
            ...match,
            homeTeamGoals: editMatchForm.homeTeamGoals,
            awayTeamGoals: editMatchForm.awayTeamGoals,
          });
        } else {
          // Editing date only
          onSave({
            ...match,
            matchDate: editMatchForm.matchDate,
          });
        }
        onClose();
      } else {
        alert("Failed to update match: " + (response?.message || "Unknown error"));
      }
      
    } catch (error) {
      console.error("Error updating match:", error);
      setErrorMessage(error.response.data.message)
      alert("Something went wrong while updating the match.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Match</h2>
        <form onSubmit={handleSubmit}>

          {new Date() <= new Date(match.matchDate) && (
            <label className="block mb-4">
              Date:
              <input
                type="datetime-local"
                name="matchDate"
                value={editMatchForm.matchDate}
                onChange={handleChange}
                className="border rounded p-1 w-full mt-1"
                required
              />
            </label>
          )}

          
          {new Date() >= new Date(match.matchDate) && (
            <div>
              <label className="block mb-4 text-black">
                Match Results:
              </label>
              <label className="block mb-4 text-black">
                Home Team
              </label>
              <input
                type="number"
                step={1}
                onChange={handleChange}
                name="homeTeamGoals"
                value={editMatchForm.homeTeamGoals}
              />

              <label className="block mb-4 text-black">
                Away Team
              </label>
              <input
                type="number"
                step={1}
                onChange={handleChange}
                name="awayTeamGoals"
                value={editMatchForm.awayTeamGoals}
              />
            </div>
            
          )}

          <div className="text-red-600 text-xs">{errorMessage}</div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMatchModal;
