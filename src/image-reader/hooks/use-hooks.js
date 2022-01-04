import { withWidth } from "@material-ui/core";
import { React, useEffect, useState } from "react";

export default () => {
  const [file, setFile] = useState({});
  const [imageData, setImageData] = useState([]);
  const [hexColors, setHexColors] = useState([]);
  const [colorCounts, setColorCounts] = useState([{ color: "", count: 0 }]);

  const handleUpload = (event) => {
    const newFile = URL.createObjectURL(event.target.files[0]);
    setFile(newFile);
  };

  const putImage = () => {
    var uploadedImage = document.getElementById("uploadedImage");
    var ctx = uploadedImage.getContext("2d");
    ctx.drawImage(document.getElementById("image"), 0, 0);
  };

  const getImageData = () => {
    putImage();
    const image = document.getElementById("uploadedImage");
    const context = image.getContext("2d");
    let newImageData = context.getImageData(0, 0, image.width, image.height);
    console.log(newImageData);
    setImageData(newImageData.data);
  };

  const hexConvertor = (int) => {
    let hex = int.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const convertToHex = () => {
    let chunkSize = 4;
    let startPoint = 0;
    //replace 200 with imageData.length
    for (let i = startPoint; i < 1000; i += chunkSize) {
      let chunk = [];
      let end = startPoint + 4;
      for (let j = startPoint; j < end; j++) {
        chunk.push(imageData[j]);
        console.log("chunk ", startPoint, ": ", chunk);
      }
      //now work with 'chunk...[0][1][2] to calc hex value and store that in array
      //This process is ignoring the opacity for now (4th val of a chunk)
      let hexString = "#";
      for (let k = 0; k < chunk.length - 1; k++) {
        //Convert chunk[k] to hex
        let hexVal = hexConvertor(chunk[k]);
        //Append to hex string
        hexString = hexString + hexVal;
      }
      //Add hexString to hexColors
      hexColors.push(hexString);
      //setHexColors(hexColors)
      setHexColors(hexColors);
      //Increment to the next chunk
      startPoint += 4;
      console.log(hexColors);
    }
  };

  //Questions
  //  Does it read horizontally first or vertically first (rows vs columns) -> it reads horizontally
  // 45k pixels but 180k pieces of data for RGB????
  // Looks like each pixel is 4 pieces of data (R, G, B, a (opacity)) -> ignoring this as it shouldnt be reqd.

  const getCounts = () => {
    //run through hexColors
    //take each item
    //run through hexColors
    //see if the hex string matches
    //increment count for that color?

    let tempArray = hexColors;
    console.log("temp ", tempArray);

    for (let i = 0; i < tempArray.length; i++) {
      let colors = [];
      let selectedColor = tempArray[0];
      colors.push(selectedColor);
      tempArray.shift();
      for (let j = 0; j < tempArray.length; j++) {
        if ((selectedColor = tempArray[j])) {
          colors.push(tempArray[j]);
          tempArray.splice(j, 1);
        }
      }
      let newColor = {
        color: colors[0],
        count: colors.length,
      };
      console.log("tempAfter", tempArray);
      console.log(newColor);
      //setColorCounts(...colorCounts, newColor);
    }

    //loop hexColors->make nmew array to loop through
    //get item -> check its not alreadyt been grouped (exists in array?)
    //loop again looking for others that eq (not already been grouped -> maybe remove from array)
    //add these to new array
    //exports each time are the first item (color name) and that array.length
  };

  useEffect(() => {
    console.log("data", imageData);

    if (imageData.length > 0) {
      convertToHex();
      getCounts();
    }
  }, [imageData]);

  useEffect(() => {
    console.log("counts", colorCounts);
  }, [colorCounts]);

  return {
    file,
    handleUpload,
    getImageData,
    imageData,
    hexColors,
  };
};
