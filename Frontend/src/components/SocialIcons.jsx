import React from "react";
import PropTypes from 'prop-types';
const SocialIcons = ({ Icons }) => {
  return (
    <div className="text-teal-500">
      {Icons.map((icon) => (
        <span
          key={icon.name}
          className="p-2 cursor-pointer inline-flex items-center
        rounded-full bg-slate-500 mx-1.5 text-xl hover:text-gray-100 hover:bg-teal-500
        duration-300 "
        >
          <ion-icon name={icon.name}></ion-icon>
        </span>
      ))}
    </div>
  );
};
SocialIcons.propTypes = {
  icons: PropTypes.arrayOf(PropTypes.element).isRequired,
}

export default SocialIcons;