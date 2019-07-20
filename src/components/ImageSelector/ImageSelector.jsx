import React from "react";

const ImageSelector = ({ onChange }) => {
  return (
    <div>
      <input type="file" onChange={onChange} />
    </div>
  );
};

export default ImageSelector;
