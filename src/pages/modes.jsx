import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Modes = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState('');

  const handleJoin = () => {
    if (id.trim() !== '') {
      navigate(`/online/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Main mode selection box */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 w-full max-w-md space-y-6 z-10">
        <h2 className="text-white text-2xl font-bold text-center mb-4">Choose Game Mode</h2>

        <button
          className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
          onClick={() => navigate('/offline')}
        >
          Pass & Play
        </button>

        <button
          className="w-full py-3 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300"
          onClick={() => navigate('/createroom')}
        >
          Create Online Room
        </button>

        <button
          className="w-full py-3 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300"
          onClick={() => setShowForm(true)}
        >
          Join Room
        </button>
      </div>

      {/* Join Room Overlay */}
      {showForm && (
        <>
          {/* Dark overlay backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-60 z-40" />

          {/* Form overlay */}
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 flex flex-col items-center space-y-4 w-full max-w-sm">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="px-4 py-2 rounded-md text-white bg-black/30 w-full border border-white/30 placeholder-white/50"
              />
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleJoin}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Join
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Modes;
