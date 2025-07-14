import { useEffect } from "react";
import { collection, addDoc, updateDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
const navigate = useNavigate();
  useEffect(() => {
    const createRoom = async () => {

      const q = query(
        collection(db, "users"),
        where("uid", "==", auth.currentUser.uid)
      );

      const snap = await getDocs(q);
      const username = snap.docs[0]?.data().username;
      console.log(username)

      if (!username) {
        console.error("Username not found for current user");
        return;
      }

      const docRef = await addDoc(collection(db, "games"), {
        player1: username,
        player2: null,
        status: "waiting",
        createdAt: serverTimestamp(),
      });
      await updateDoc(docRef, {
        roomId: docRef.id,
      });

      console.log("Room created with ID:", docRef.id);
      navigate(`/online/${docRef.id}`)
    };

    createRoom();
  }, []);

  return null;
};

export default CreateRoom;
