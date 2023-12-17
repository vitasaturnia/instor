import React from 'react';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="notification is-danger">
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;
