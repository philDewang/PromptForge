
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center p-4">
            <div className="border-4 border-gray-200 border-t-4 border-t-indigo-600 rounded-full w-8 h-8 animate-spin"></div>
        </div>
    );
};

export default Loader;
