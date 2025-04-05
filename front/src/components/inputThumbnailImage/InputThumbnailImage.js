import React from 'react';
import '../../css/components/InputThumbnailImage/InputThumbnailImage.css';

const InputThumbnailImage = ({ handleThumbnailChange, thumbnailImage }) => {
    return (
        <>
            <label>Thumbnail Image: </label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            {thumbnailImage && <img src={URL.createObjectURL(thumbnailImage)} alt="Thumbnail" />}
            <br />
        </>
    );
}

export default InputThumbnailImage;