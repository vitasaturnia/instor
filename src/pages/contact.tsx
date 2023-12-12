// ContactUsPage.jsx
import React from 'react';
import ContactForm from './ContactForm';
import Newsletter from './Newsletter';

const ContactUsPage = () => {
    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Contact Us</h1>
                <div className="columns">
                    <div className="column is-half">
                        <h2 className="subtitle">Send us a message:</h2>
                        <ContactForm />
                    </div>
                    <div className="column is-half">
                        <h2 className="subtitle">Subscribe to our newsletter:</h2>
                        <Newsletter />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUsPage;
