import React, {useState} from 'react';

import st from 'ryscott-st';
import '../styles/tile.css';

import Tile from './tiles/Tile.jsx';
import Logo from './tiles/Logo.jsx';
import Process from './tiles/Process.jsx';
import Projects from './tiles/Projects.jsx';
import Contact from './tiles/Contact.jsx';
import Services from './tiles/Services.jsx';

import content from './tiles/Content.jsx';

const Tiles = function() {
  if (st.isMobile) {
    return (
      <div className='tiles v'>
        <Logo num={0}/>
        <Tile className='introTile' content={content.intro} num={1}/>
        <Services num={2}/>
        <Process num={3}/>
        <Projects num={4}/>
        <Contact num={5}/>
      </div>
    )
  }

  return (
    <div className='tiles v'>
      <div className='tileRow h'>
        <Logo num={0}/>
        <Tile className='introTile' content={content.intro} num={1}/>
      </div>
      <div className='tileRow h'>
        <Services num={2}/>
        <Process num={3}/>
      </div>
      <div className='tileRow h'>
        <Projects num={4}/>
        <Contact num={5}/>
      </div>
    </div>
  );
};

export default Tiles;