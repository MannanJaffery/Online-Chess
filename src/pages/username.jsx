import { useState  , useEffect} from "react"


import { db , auth } from "../firebase";

import { useNavigate } from "react-router-dom";
import { signInAnonymously } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useUser } from "../context/Usercontext";

const Username = () => {

    const [name , setName] = useState('');
    const [containspace, setContainsspace] = useState(false);
    const navigate = useNavigate();
    const {setUsername} = useUser();
    const storeindb = async (uname) => {

    
        
  try {
    await setDoc(doc(db, "users", auth.currentUser.uid),  {
      username: uname,
      createdAt: serverTimestamp(),
      uid:auth.currentUser.uid,
    });

    console.log("stored in db", uname);
    navigate('/modes');
  } catch (err) {
    console.error("Error storing in DB:", err);
  }
};

useEffect(() => {
    signInAnonymously(auth)
      .then(() => {
        console.log("Signed in anonymously");
      })
      .catch((err) => {
        console.error("Sign-in error:", err);
      });

    },[])

  return (
    <>

    <div className="min-h-screen flex justify-center items-center">
  <form className="flex flex-col p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 w-full max-w-sm space-y-4"
  onSubmit={(e)=>{
    e.preventDefault();
  ;
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
        setUsername(e.target.value)
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
