/**
 * StatsCard.jsx
 * 
 * Reusable card component for displaying dashboard metrics.
 * Features icon, title, value, and optional color customization.
 */

import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value, icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
    };

    const bgColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-200">{value}</p>
                </div>
                <div className={`${bgColor} rounded-full p-3`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.oneOf(['blue', 'green', 'purple', 'yellow', 'red']),
};

StatsCard.defaultProps = {
    color: 'blue',
};

export default StatsCard;
