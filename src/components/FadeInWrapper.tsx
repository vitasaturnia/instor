import React, { ReactNode } from 'react';
import { animated, useSpring, SpringConfig } from 'react-spring';

interface FadeInWrapperProps {
    children: ReactNode;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children }) => {
    const animationProps = useSpring({
        to: { opacity: 1 },
        from: { opacity: 0 },
        config: getSpringConfig(),
    });

    return <animated.div style={animationProps}>{children}</animated.div>;
};

// Configuring spring options as a function for better organization
const getSpringConfig = (): SpringConfig => {
    return {
        tension: 200,  // Moderately high for a responsive start
        friction: 10,  // Balanced for a smooth yet noticeable effect
        mass: 1,       // Standard mass for natural movement
    };
};

export default FadeInWrapper;
