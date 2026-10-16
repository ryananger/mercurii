import React, {useState, useEffect, useRef} from 'react';

import st from 'ryscott-st';

import {FaArrowLeft} from 'react-icons/fa';
import {FaArrowRight} from 'react-icons/fa';

const Projects = function({content, num}) {
  const [isOpen, setIsOpen] = useState(st.isMobile ? true : false);
  const [isLoaded, setIsLoaded] = useState(st.isMobile ? true : false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const swipeStart = useRef(null);
  const [slidePosition, setSlidePosition] = useState(1);
  const [isSettling, setIsSettling] = useState(false);

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

  useEffect(() => {
    if (!isLoaded || isModalOpen || isDragging || isSettling) {
      return undefined;
    }

    const slideshowTimer = setTimeout(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % projectImages.length);
      if (st.isMobile) {
        setSlidePosition((position) => position + 1);
        setIsSettling(true);
      }
    }, 8000);

    return () => clearTimeout(slideshowTimer);
  }, [isLoaded, isModalOpen, isDragging, isSettling, activeImageIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentImage = projectImages[activeImageIndex];

  const finishSlideTransition = () => {
    // The end copies make wrapping seamless; reset to the matching real tile.
    setSlidePosition((position) => {
      if (position === 0) return projectImages.length;
      if (position === projectImages.length + 1) return 1;
      return position;
    });
    setIsSettling(false);
  };

  useEffect(() => {
    if (!isSettling) return undefined;

    // Also finish when reduced motion disables the CSS transition.
    const settleTimer = setTimeout(finishSlideTransition, 300);
    return () => clearTimeout(settleTimer);
  }, [isSettling]);

  const handlePointerDown = (event) => {
    if (!st.isMobile || isSettling || !event.isPrimary || event.button !== 0) return;

    swipeStart.current = {id: event.pointerId, x: event.clientX, y: event.clientY, direction: null};
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    const start = swipeStart.current;
    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.direction && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      start.direction = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
    }
    if (start.direction === 'horizontal') {
      const limit = event.currentTarget.clientWidth;
      setSwipeOffset(Math.max(-limit, Math.min(limit, dx)));
    }
  };

  const finishSwipe = (event) => {
    const start = swipeStart.current;
    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (event.type === 'pointerup' && start.direction !== 'vertical' &&
        Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) {
      const step = dx < 0 ? 1 : -1;
      setActiveImageIndex((index) => (index + step + projectImages.length) % projectImages.length);
      setSlidePosition((position) => position + step);
    }

    setIsSettling(true);
    swipeStart.current = null;
    setSwipeOffset(0);
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleModalImageClick = function(){
    setIsModalOpen(false);
  };

  if (st.isMobile) {
    const slides = [projectImages[projectImages.length - 1], ...projectImages, projectImages[0]];

    return (
      <div
        className='projectCarousel'
        role='region'
        aria-label='Projects'
        aria-roledescription='carousel'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishSwipe}
        onPointerCancel={finishSwipe}
        onLostPointerCapture={finishSwipe}
      >
        <div
          className={`projectCarouselTrack ${isSettling ? 'isSettling' : ''}`}
          style={{transform: `translateX(calc(-${slidePosition * 100}% - ${slidePosition * 12}px + ${swipeOffset}px))`}}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === 'transform') {
              finishSlideTransition();
            }
          }}
        >
          {slides.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className='tile projectTile v'
              aria-hidden={index !== slidePosition}
              role='group'
              aria-roledescription='slide'
              aria-label={project.title}
            >
              <div className='projects'>
                <div className='projectSlideshow'>
                  <img
                    className='projectScreenshot'
                    draggable={false}
                    src={project.src}
                    alt={`Project screenshot ${project.title}`}
                  />
                </div>
                <div className='projectInfo'>
                  <h3>{project.title}</h3>
                  <p>{project.info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`tile projectTile ${!isOpen ? 'closed v' : 'v'}`}>
      <div className={`tileContentContainer ${isLoaded ? 'visible' : 'hidden'} v`}>
        <div className='projects'>
          <div className='projectSlideshow'>
            <div className='projectTitle'>{currentImage.title}</div>
            <img
              className='projectScreenshot'
              draggable={false}
              src={currentImage.src}
              alt={`Project screenshot ${currentImage.title}`}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='imageModalOverlay' onClick={() => setIsModalOpen(false)}>
          <div className='imageModal' onClick={(event) => event.stopPropagation()}>
            <div className='imageModalViewer'>
              <img
                src={currentImage.src}
                alt={`Project screenshot ${currentImage.title}`}
                className='imageModalImage'
                onClick={handleModalImageClick}
              />
              <div className='imageModalInfo'>
                <h3>{currentImage.title}</h3>
                <p>{currentImage.info}</p>
              </div>
              <button className='leftButton' onClick={() => setActiveImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length)} aria-label='Previous image'>
                <FaArrowLeft size={24}/>
              </button>
              <button className='rightButton' onClick={() => setActiveImageIndex((prev) => (prev + 1) % projectImages.length)} aria-label='Next image'>
                <FaArrowRight size={24}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const projectImages = [
  {
    title: 'communitii',
    src: './images/communitii_screen.png',
    info: 'A community-oriented social media platform focused on connection and local engagement.'
  },
  {
    title: 'savor',
    src: './images/savor_screen.png',
    info: 'A user-friendly restaurant point of service application designed for efficiency.'
  },
  {
    title: 'stokk',
    src: './images/stokk_screen.png',
    info: 'A simple, streamlined stock market scanner designed to offer real-time insights to investors.'
  },
  {
    title: 'neighborly',
    src: './images/neighborly_screen.png',
    info: 'A neighborhood-focused communications application for trusted local interactions.'
  },
  {
    title: 'puzzl',
    src: './images/puzzle_screen.png',
    info: 'A polished product experience designed around crisp aesthetics and play.'
  }
];

export default Projects;