import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="spinner-container">
            {/* Customize the spinner style based on your preference */}
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
