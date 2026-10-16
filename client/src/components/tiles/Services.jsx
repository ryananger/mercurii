import React, {useState, useEffect} from 'react';

import st from 'ryscott-st';

const serviceDetails = [
  'Custom websites and web apps built for modern businesses.',
  'Reliable software tools and internal systems that scale.',
  'Workflow automation to save time and reduce manual effort.',
  'Smart AI integrations that fit your existing stack.',
  'Hands-on IT support for day-to-day technical needs.'
];

const Services = function({num}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tooltip, setTooltip] = useState({visible: false, text: '', x: 0, y: 0});

  if (st.isMobile) {
    return (
      <div className='mobileItemSection mobileServices v'>
        {serviceDetails.map((detail, index) => (
          <div key={detail} className='tile service serviceItem v'>
            <b>{['Web Development', 'Software', 'Automation', 'AI Integration', 'IT Services'][index]}</b>
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
    <div className={`tile serviceTile ${!isOpen ? 'closed v' : 'v'}`}>
      <div className={`tileContentContainer ${isLoaded ? 'visible' : 'hidden'} h`}>
        <div className='tileContent services h'>
          {serviceDetails.map((detail, index) => (
            <div
              key={detail}
              className='service v'
              onMouseMove={(event) => handleMouseMove(event, detail)}
              onMouseLeave={handleMouseLeave}
            >
              {['Web Development', 'Software', 'Automation', 'AI Integration', 'IT Services'][index]}
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

export default Services;