import React from 'react';
import ContactForm from '../components/ContactForm';
import Newsletter from '../components/Newsletter';

const ContactPage = () => {
    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Contact Us</h1>
                <div className="columns">
                    <div className="column has-text-centered">
                        <h2 className="subtitle">Send us a message:</h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
