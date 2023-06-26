import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useRef, useState } from "react";

firebase.initializeApp({
    apiKey: "AIzaSyB0Pz38uf9mo8sq5SrBNv3ZXuR0U_ipyoQ",
    authDomain: "superchat-6239b.firebaseapp.com",
    projectId: "superchat-6239b",
    storageBucket: "superchat-6239b.appspot.com",
    messagingSenderId: "75144317481",
    appId: "1:75144317481:web:d54eff60f6027edee8ea38",
    measurementId: "G-E9GLP095J4",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
    const [user] = useAuthState(auth); //to find if user is logged in

    return (
        <div className="App">
            <header>
                <h1>✨Lost in space✨</h1>
                <SignOut />
            </header>

            <section>{user ? <ChatRoom /> : <SignIn />}</section>
        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    return <button onClick={signInWithGoogle}>Sign In with Google</button>;
}

function SignOut() {
    return (
        auth.currentUser && (
            <button onClick={() => auth.signOut()}>Sign Out</button>
        )
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
        <div className={`message ${messageClass}`}>
            <img
                src={
                    photoURL ||
                    "https://api.adorable.io/avatars/23/abott@adorable.png"
                }
                alt="user"
            />
            <p>{text}</p>
        </div>
    );
}

function ChatRoom() {
    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy("createdAt").limit(25);

    const [messages] = useCollectionData(query, { idField: "id" });

    const [formValue, setFormValue] = useState("");

    const dummy = useRef();

    useEffect(() => {
        setTimeout(() => {
            dummy.current.scrollIntoView({ behavior: "auto" });
        }, 100);
    }, []);

    const sendMesage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        if (formValue.trim() === "") {
            alert("Input is empty!");
            return;
        } else {
            await messagesRef.add({
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL,
            });

            setFormValue("");

            dummy.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <main>
                {messages &&
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                <div ref={dummy}></div>
            </main>

            <form onSubmit={sendMesage}>
                <input
                    type="text"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                />
                <button type="submit">▶</button>
            </form>
        </>
    );
}

export default App;
