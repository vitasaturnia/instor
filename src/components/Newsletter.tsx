// Newsletter.jsx
import React from 'react';

const Newsletter = () => {
    return (
        <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
        >
            {/* Hidden input for Netlify Form */}
            <input type="hidden" name="form-name" value="newsletter" />

            <div className="field is-grouped">
                <div className="control">
                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="control">
                    <button type="submit" className="button is-primary">
                        Subscribe
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Newsletter;
