import { createContext, useState, useEffect } from "react";

export const Context = createContext();
const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [displayedResultData, setDisplayedResultData] = useState("");
    const [currentChat, setCurrentChat] = useState([]);
    const [pastChats, setPastChats] = useState([]);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setDisplayedResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const newChat = () => {
        if (currentChat.length > 0) {
            setPastChats(prev => [currentChat, ...prev]);
        }
        setCurrentChat([]);
        setLoading(false);
        setShowResult(false);
        setInput("");
        setRecentPrompt("");
        setResultData("");
        setDisplayedResultData("");
        localStorage.removeItem('currentChat');
    }

    const loadChat = (chat) => {
        setCurrentChat(chat);
        setShowResult(true);
    }

    const loadPastChats = () => {
        const storedPastChats = localStorage.getItem('pastChats');
        if (storedPastChats) {
            setPastChats(JSON.parse(storedPastChats));
        }
    }

    const loadCurrentChat = () => {
        const storedCurrentChat = localStorage.getItem('currentChat');
        if (storedCurrentChat) {
            setCurrentChat(JSON.parse(storedCurrentChat));
            setShowResult(true);
        }
    }

    useEffect(() => {
        loadPastChats();
        loadCurrentChat();
    }, []);

    useEffect(() => {
        localStorage.setItem('pastChats', JSON.stringify(pastChats));
    }, [pastChats]);

    const onSent = async (prompt) => {
        setResultData("");
        setDisplayedResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(prompt);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;

        const response = await fetch('http://localhost:5000/api/gemini/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ prompt, history: currentChat }),
        });

        const data = await response.json();
        const geminiResponse = data.text;

        if (!geminiResponse) {
            console.error("API response did not contain 'text' property:", data);
            setResultData("Error: Could not get a response from Gemini. Please try again.");
            setDisplayedResultData("Error: Could not get a response from Gemini. Please try again.");
            setLoading(false);
            setInput("");
            return;
        }

        const newChat = [...currentChat, { prompt, response: geminiResponse }];
        setCurrentChat(newChat);
        localStorage.setItem('currentChat', JSON.stringify(newChat));

        setResultData(geminiResponse);

        let i = 0;
        const words = geminiResponse.split(" ");
        for (let j = 0; j < words.length; j++) {
            const nextWord = words[j];
            delayPara(i, nextWord + " ");
            i++;
        }

        setLoading(false);
        setInput("");
    };

    const contextValue = {
        onSent,
        recentPrompt,
        showResult,
        loading,
        resultData,
        displayedResultData,
        input,
        setInput,
        newChat,
        pastChats,
        loadChat,
        currentChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )

}
export default ContextProvider;
