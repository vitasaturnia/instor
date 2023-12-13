import React from "react";
const ContactForm = () => {
    return (
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
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        name="name"
                        required
                    />
                </div>
            </div>

            <div className="field">
                <label className="label">Email</label>
                <div className="control">
                    <input
                        className="input"
                        type="email"
                        name="email"
                        required
                    />
                </div>
            </div>

            <div className="field">
                <label className="label">Message</label>
                <div className="control">
          <textarea
              className="textarea"
              name="message"
              required
          ></textarea>
                </div>
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button type="submit" className="button is-primary">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ContactForm;
