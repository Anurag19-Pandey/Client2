import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./pages/Chat";
import { getTokenn, onMessageListener } from "./utilities/firebase";
import axios from "axios";

const finalUrl =
  process.env.NODE_ENV == "development"
    ? "https://test-765857d6-8ee2-4ea8-aef6-80efe5a112f6.10point.ai"
    : "https://app.10point.ai";

function App() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('tpchat'));

  useEffect(() => {
    const getTok = getTokenn(() => {});

    Promise.all([getTok]).then((res) => {
      const token = res[0];
      let topicString = `chatadmin_topicstring`;

      axios
        .post(`${finalUrl}/api/subscribeToTopicsForWeb`, {
          topic_array: topicString,
          token,
        })
        .then((resp) => {
          onMessageListener();
        })
        .catch((err) => console.log(err));
      // });
    });
  }, []);

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <Chat />
      ) : (
        <div
          style={{
            height: "90vh",
            display: "flex",
            flexDirection: 'column',
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ margin: "20px" }}>Enter Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
          />
          <button
          style={{margin: '10px'}}
            onClick={() => {
              if (password === "alohamora@ing") {
                localStorage.setItem("tpchat", password);
                setIsLoggedIn(true)
              }
            }}
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
