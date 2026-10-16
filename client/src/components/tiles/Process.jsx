import React, {useState, useEffect} from 'react';

import st from 'ryscott-st';

import {IoSearch} from 'react-icons/io5';
import {IoPencil} from 'react-icons/io5';
import {IoCodeSlash} from 'react-icons/io5';
import {IoRocketSharp} from 'react-icons/io5';
import {IoChatbubbles} from 'react-icons/io5';

const Process = function({content, num}) {
  const [isOpen, setIsOpen] = useState(st.isMobile ? true : false);
  const [isLoaded, setIsLoaded] = useState(st.isMobile ? true : false);
  const [tooltip, setTooltip] = useState({visible: false, text: '', x: 0, y: 0});

  const iconSize = st.isMobile ? 32 : 48;

  const processItems = [
    {title: 'discover', detail: 'We learn your goals, constraints, and audience first.', icon: <IoSearch size={iconSize}/>},
    {title: 'design', detail: 'We shape the experience and technical approach around your needs.', icon: <IoPencil size={iconSize}/>},
    {title: 'build', detail: 'We turn the plan into a working solution with care and speed.', icon: <IoCodeSlash size={iconSize}/>},
    {title: 'launch', detail: 'We prepare release, deployment, and communication for a smooth debut.', icon: <IoRocketSharp size={iconSize}/>},
    {title: 'support', detail: 'We keep the system healthy with updates and ongoing support.', icon: <IoChatbubbles size={iconSize}/>} 
  ];

  if (st.isMobile) {
    return (
      <div className='mobileItemSection v'>
        <b>Our Process</b>
        {processItems.map((item) => (
          <div key={item.title} className='tile processItem v'>
            <div className='processIcon v'>{item.icon}</div>
            <b className='processTitle'>{item.title}</b>
            <p className='itemDetail'>{item.detail}</p>
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1000 + (num * 200));

    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 2200 + (num * 200));

    return () => {
      clearTimeout(openTimer);
      clearTimeout(loadTimer);
    };
  }, [num]);

  const handleMouseMove = (event, text) => {
    setTooltip({visible: true, text, x: event.clientX - 98, y: event.clientY + 24});
  };

  const handleMouseLeave = () => {
    setTooltip((current) => ({...current, visible: false}));
  };

  return (
    <div className={`tile processTile ${!isOpen ? 'closed v' : 'v'}`}>
      <div className={`tileContentContainer ${isLoaded ? 'visible' : 'hidden'} v`}>
        <b>Our Process</b>
        <div className='processInfo h'>
          {processItems.map((item) => (
            <div
              key={item.title}
              className='processItem v'
              onMouseMove={(event) => handleMouseMove(event, item.detail)}
              onMouseLeave={handleMouseLeave}
            >
              <div className='processIcon v'>{item.icon}</div>
              <b className='processTitle'>{item.title}</b>
            </div>
          ))}
        </div>
      </div>
      {tooltip.visible && (
        <div
          className='hoverTooltip'
          style={{left: tooltip.x, top: tooltip.y}}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default Process;