import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import bodybuildersData from '../fakeornatty.json';

const FakeOrNatty = () => {
    const [userChoices, setUserChoices] = useState(new Array(bodybuildersData.length).fill(null));
    const [bodybuilders, setBodybuilders] = useState([]);

    const handleChoice = (index, isNatural) => {
        const updatedChoices = [...userChoices];
        updatedChoices[index] = isNatural;
        setUserChoices(updatedChoices);
    };

    const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

    useEffect(() => {
        // Simulate loading the bodybuilder data from the JSON file
        setBodybuilders(bodybuildersData);
    }, []);

    return (
        <div className="bodybuilder-authenticator">
            <h1 className="title">Fake Or Natty?</h1>
            <div className="columns is-multiline">
                {bodybuilders.map((bodybuilder, index) => (
                    <div className="column is-4" key={index}>
                        <animated.div className="card" style={fade}>
                            <div className="placeholder">
                                <img
                                    src={`https://via.placeholder.com/150/0000FF/FFFFFF?text=${bodybuilder.name}`}
                                    alt={bodybuilder.name}
                                />
                                <p>{bodybuilder.name}</p>
                            </div>
                            <div className="button-container">
                                {userChoices[index] === null && (
                                    <>
                                        <button
                                            className={`button is-primary ${userChoices[index] === true ? 'selected' : ''}`}
                                            onClick={() => handleChoice(index, true)}
                                        >
                                            Natty
                                        </button>
                                        <button
                                            className={`button is-danger ${userChoices[index] === false ? 'selected' : ''}`}
                                            onClick={() => handleChoice(index, false)}
                                        >
                                            Fake
                                        </button>
                                    </>
                                )}
                            </div>
                        </animated.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FakeOrNatty;
