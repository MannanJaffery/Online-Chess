import { useState } from "react"
import { addDoc,collection, serverTimestamp } from "firebase/firestore";
import { db , auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Username = () => {

    const [name , setName] = useState('');
    const [containspace, setContainsspace] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        signInAnonymously(auth)
    },[])
    const storeindb = async (uname) => {
  try {
    await addDoc(collection(db, "users"), {
      username: uname,
      createdAt: serverTimestamp(),
    });

    console.log("stored in db", uname);
    navigate('/modes');
  } catch (err) {
    console.error("Error storing in DB:", err);
  }
};

  return (
    <>

    <div className="min-h-screen flex justify-center items-center">
  <form className="flex flex-col p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 w-full max-w-sm space-y-4"
  onSubmit={(e)=>{
    e.preventDefault();
    storeindb(name)}
  }>

    <label className="text-white text-sm mb-1 tracking-wide font-semibold">
      Enter Username:
    </label>
    
    <input
      type="text"
      placeholder="Your name"
      className={`bg-transparent border ${containspace ? 'focus:ring-red-500': ''} border-white/30 text-white placeholder-white/50 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      onChange={(e)=>{
        const value = e.target.value;
        setContainsspace(value.includes(' '));
        setName(e.target.value)
      }}
    />
    {containspace && <span className="text-red-100">Cannot Contain Spaces</span>}

    <button
      type="submit"
      className="bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition"
    >
      Join Game
    </button>
  </form>
</div>



    
    </>
  )
}

export default Username
