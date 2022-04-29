import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

//Hooks
import useHooks from './hooks';

//Styles
import useStyles from './image-reader-styles.js';

function ImageReader() {
    const {
        file,
        handleUpload,
        getImageData,
        imageData,
        hexColors,
        colorCounts
    } = useHooks();
    const classes = useStyles();
    console.log(colorCounts)

    return (
        <div>
            <input type="file" onChange={handleUpload}/>
            <button onClick={getImageData}>Get Data</button>
            <canvas className={classes.canvas} id="uploadedImage" />
            <img className={classes.uploadedImage} src={file} id="image"/>
            <br />
            {colorCounts?.map((color) => (
                <div key={color.clusterColor} style={{ backgroundColor: color.clusterColor, width: "100px", height: "100px" }}><p>{color.clusterColor} {color.count}</p></div>
            ))}
            {/* {imageData.length > 0 && (
                <h3>Evaluated {hexColors.length} pixels / {imageData.length/4} pixels</h3>
            )}
            <ProgressBar
                variant="success"
                //now={(hexColors.length)/(imageData.length/4)*100}
                now={50}
                label={`50%`}
            /> */}
        </div>
    );
}

export default ImageReader;