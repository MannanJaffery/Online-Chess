import { useNavigate } from "react-router-dom";

const Modes = () => {

    const navigate= useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 w-full max-w-md space-y-6">
        <h2 className="text-white text-2xl font-bold text-center mb-4">Choose Game Mode</h2>
        
        <button className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
        onClick={()=>navigate('/offline')}>
          Pass & Play
        </button>

        <button className="w-full py-3 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300"
        onClick={()=>{navigate('/createroom')}}>
          Online Multiplayer
        </button>
      </div>
    </div>
  );
};

export default Modes;

