import React from 'react';

const ContactForm = () => {
    return (
        <div className="container has-text-centered my-6">
            <h2 className="title is-2 is-capitalized">Contact Us</h2>
            <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
            >
                {/* Hidden input for Netlify Form */}
                <input type="hidden" name="form-name" value="contact" />

                <div className="field">
                    <label className="label">Name</label>
                    <div className="control has-icons-left">
                        <input
                            className="input"
                            type="text"
                            name="name"
                            required
                            placeholder="Your Name"
                        />
                        <span className="icon is-left">
                            <i className="fa fa-user"></i>
                        </span>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                        <input
                            className="input"
                            type="email"
                            name="email"
                            required
                            placeholder="Your Email"
                        />
                        <span className="icon is-left">
                            <i className="fa fa-envelope"></i>
                        </span>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Message</label>
                    <div className="control">
                        <textarea
                            className="textarea"
                            name="message"
                            required
                            placeholder="Your Message"
                        ></textarea>
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button
                            type="submit"
                            className="button is-success"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
