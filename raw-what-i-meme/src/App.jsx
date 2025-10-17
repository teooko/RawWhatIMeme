import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { app } from "./config/firebase";

// Initialize Firebase

const db = getDatabase(app);

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  // 🧠 Listen for changes in real-time
  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const list = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setTasks(list);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  // ➕ Add a new task
  const addTask = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    push(ref(db, "tasks"), { text });
    setText("");
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>🔥 Realtime Database Tasks</h2>
      <form onSubmit={addTask}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task..."
          style={{ padding: "8px", width: "70%" }}
        />
        <button style={{ padding: "8px" }}>Add</button>
      </form>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
};