import React from 'react';
import { useSpring, animated } from 'react-spring';
import './Comp.css';
import { Link } from "react-router-dom";

function LandingPage() {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const styles = {
    h1: {
      textAlign: 'center',
      fontSize: '3rem',
    },
    p: {
      textAlign: 'center',
    },
  };

  return (
    <div className="landing-page">
      <div className="centered-content">
        <animated.h1 style={{ ...props, ...styles.h1 }}>
          Welcome to DashPro!
        </animated.h1>
        <animated.p style={{ ...props, ...styles.p }}>
          Empowering Your Business Success with DashPro: Your Centralized Solution for Data, Collaboration, and Efficiency.
        </animated.p>
        <Link to="/login">
          <animated.button className="button">
            Login
          </animated.button>
        </Link> 
      </div>
    </div>
  );
}

export default LandingPage;
