import React, { useState, useEffect, useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
  };

  return !inline && match ? (
    <div className="code-block-container">
      <pre className={className} {...props}>
        {children}
      </pre>
      <button onClick={handleCopy} className="copy-button">
        Copy
      </button>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const TypingAnimation = ({ texts, speed = 150, deletionSpeed = 50, pause = 1000, repeat = Infinity }) => {
    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentText = texts[index % texts.length];
            if (isDeleting) {
                if (text.length > 0) {
                    setText(current => current.substring(0, current.length - 1));
                } else {
                    setIsDeleting(false);
                    setIndex(prev => (prev + 1));
                }
            } else {
                if (text.length < currentText.length) {
                    setText(current => current + currentText.charAt(text.length));
                } else {
                    setTimeout(() => setIsDeleting(true), pause);
                }
            }
        };

        const typingTimeout = setTimeout(handleTyping, isDeleting ? deletionSpeed : speed);

        return () => clearTimeout(typingTimeout);
    }, [text, isDeleting, index, texts, speed, deletionSpeed, pause]);

    return (
        <p style={{ fontSize: '1em', display: 'inline-block' }}>
            {text}
            <span className="typing-cursor" />
        </p>
    );
};

const Main = ({ isMobile, setShowSidebar }) => {

    const { onSent, recentPrompt, showResult, loading, resultData, displayedResultData, setInput, input, currentChat } = useContext(Context);
    const { userInfo } = useAuth();

    return (
        <div className='main'>
            <div className="nav">
                {isMobile && (
                    <img
                        onClick={() => setShowSidebar(prev => !prev)}
                        className='hamburger-menu'
                        src={assets.menu_icon}
                        alt="Menu"
                    />
                )}
                <p className='gemini-clone' onClick={() => window.location.reload()}><img src={assets.gemini_icon} alt="Gemini Icon" />Gemini Clone</p>
                <img onClick={() => window.open("https://www.linkedin.com/in/gangadhara-k-s-563142286?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", "_blank")} src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {!showResult
                    ? <>
                        <div className="greet">
                            <p><span>Hello, {userInfo?.username || 'Dev'}.</span></p>
                            <TypingAnimation
                                texts={[
                                    'How can I help you today?',
                                    'I am your personal AI assistant.',
                                    'I can help you with a variety of tasks.',
                                ]}
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                        <div className="cards">
                            <div onClick={()=>{onSent("Suggest beautiful places to see on an upcoming road trip");}} className="card">
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div onClick={()=>{onSent("Briefly summarize this concept: urban planning");}} className="card">
                                <p>Briefly summarize this concept: urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div onClick={()=>{onSent("Brainstorm team bonding activities for our work retreat");}} className="card">
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div onClick={()=>{onSent("Tell me about React js and React native");}} className="card">
                                <p>Tell me about React js and React native</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                    : <div className='result'>
                        {currentChat.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="message user">
                                    <img src={assets.user_icon} alt="" />
                                    <p>{item.prompt}</p>
                                </div>
                                <div className="message ai">
                                    <img src={assets.gemini_icon} alt="" />
                                    <div className="ai-response-content">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm, remarkBreaks]} 
                                            rehypePlugins={[rehypeRaw]} 
                                            components={{
                                                code: CodeBlock,
                                            }}
                                        >
                                            {item.response}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                        {loading && (
                            <React.Fragment>
                                <div className="message user">
                                    <img src={assets.user_icon} alt="" />
                                    <p>{recentPrompt}</p>
                                </div>
                                <div className="message ai">
                                    <img src={assets.gemini_icon} alt="" />
                                    <div className="ai-response-content">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm, remarkBreaks]} 
                                            rehypePlugins={[rehypeRaw]} 
                                            components={{
                                                code: CodeBlock,
                                            }}
                                        >
                                            {displayedResultData}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input onKeyDown={(e) => { if (e.key === 'Enter' && input && !loading) { onSent(input); } }} onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' disabled={loading} />
                        <div>
                            <img onClick={() => alert('This feature is under development and will be available soon.')} src={assets.gallery_icon} alt="" />
                            <img onClick={() => alert('This feature is under development and will be available soon.')} src={assets.mic_icon} alt="" />
                            {input && !loading ? <img onClick={() => { onSent(input); }} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main