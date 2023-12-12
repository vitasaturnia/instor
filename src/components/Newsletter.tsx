
const Newsletter = () => {
    return (
        <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            className="newsletter"
        >
            {/* Hidden input for Netlify Form */}
            <input type="hidden" name="form-name" value="newsletter" />

            <div className="center has-text-centered">
                <div className="field is-grouped">
                    <div className="control">
                        <input
                            className="input is-rounded"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="control">
                        <button type="submit" className="button is-primary is-rounded">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Newsletter;
