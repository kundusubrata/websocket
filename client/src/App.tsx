import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      console.log("Connection established");
      setSocket(socket);
    };
    socket.onmessage = (message) => {
      console.log("Message received:", message.data);
      setMessages((prev) => [...prev, message.data]);
    };

    return () => socket.close();
  }, []);

  if (!socket) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-lg">
        Connecting to socket server...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center p-4 ">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mt-24">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          WebSocket Chat
        </h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            if (socket && message.trim()) {
              socket.send(message);
              setMessage("");
            }
          }}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
      <div className="w-full max-w-md mt-4 bg-white shadow-md rounded-lg p-4 overflow-y-auto h-64">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Messages:</h2>
        <div className="space-y-2">
          {messages.length ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className="p-2 bg-gray-100 rounded-md shadow-sm text-gray-800"
              >
                {msg}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No messages yet...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
