import React from 'react';
import ContactForm from '../components/ContactForm';
import Newsletter from '../components/Newsletter';

const AboutPage = () => {
    return (
        <section className="section">
            <div className="container">
                <h1 className="title">About Us</h1>
                <div className="columns">
                    <div className="column has-text-centered">
                        <h4 className="subtitle">Steroids redefined</h4>
                        <p className="has-text-dark">

                            Rewriting the narrative.n an industry clouded by secrecy.   Imagine a world where accessing top-quality steroid products is easy and safe. That's our vision.

                            We believe in transparency, and your voice matters. Through our peer-to-peer network, your reviews ensure authenticity and quality, shaping a community-driven marketplace.

                            Explore vendor reviews, check lab results, and make informed choices. Join us in reshaping the steroid industry – where trust, reliability, and quality take the spotlight.

                            Thanks for being part of our mission!

                            Sincerely,
                            The International Steroid Organization Team</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;
