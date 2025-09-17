import React, { useContext, useState } from 'react'
import './Sidebar.css'
import{assets} from '../../assets/assets'
import { Context } from '../../context/context'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = ({onLogout, showSidebar, setShowSidebar, isMobile, setShowHelp}) => {

    const [extended, setExtended] = useState(false)
    const {newChat, pastChats, loadChat} = useContext(Context)
    const navigate = useNavigate();

    const handleHelpClick = () => {
      setShowHelp(true);
      if (isMobile) setShowSidebar(false); // Close sidebar on mobile when Help is opened
    };

  return (
    <div className={`Sidebar ${extended ? 'extended' : ''} ${showSidebar ? 'show' : ''}`}>
        <div className="top">
            <img onClick={()=>setExtended(prev=>!prev)} className='menu' src={assets.menu_icon} alt="" />
            <div onClick={() => { newChat(); if (isMobile) setShowSidebar(false); navigate('/home'); }} className="new-chat">
                <img src={assets.plus_icon} alt="" />
                {extended ? <p>New Chat</p> : null}
            </div>
            {(extended || (isMobile && showSidebar))
            ? <div className="recent">
                <p className="recent-title">Recent</p>
                {pastChats.map((chat, index) => {
                    return (
                        <div onClick={() => { loadChat(chat); if (isMobile) setShowSidebar(false); navigate('/home'); }} className="recent-entry" key={index}>
                            <img src={assets.message_icon} alt="" />
                            <p>{chat[0]?.prompt.slice(0,18)} ...</p>
                        </div>
                    )
                })}
            </div>
            :null
            }
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry" onClick={handleHelpClick}> {/* Add onClick handler */}
            <img src={assets.question_icon} alt="" />
            {(extended || (isMobile && showSidebar)) ? <p>Help</p> : null}
          </div>
          <Link to="/settings" className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" />
            {(extended || (isMobile && showSidebar)) ? <p>Settings</p> : null}
          </Link>
          <div onClick={onLogout} className="bottom-item recent-entry logout-button">
            <img src={assets.user_icon} alt="" /> {/* Using user_icon as a placeholder for logout */}
            {(extended || (isMobile && showSidebar)) ? <p>Logout</p> : <p>Logout</p>}
          </div>
        </div>

    </div>
  )
}

export default Sidebar
