import { useEffect, useState } from "react";

export default () => {
  const [file, setFile] = useState({});
  const [imageData, setImageData] = useState([]);
  const [hexColors, setHexColors] = useState([]);
  const [colorCounts, setColorCounts] = useState();

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
    let newHexColors = [];
    //replace 1000 with imageData.length -- for ref each 4 is equal to 1 pixel
    for (let i = startPoint; i < imageData.length; i += chunkSize) {
      let chunk = [];
      let end = startPoint + 4;
      for (let j = startPoint; j < end; j++) {
        chunk.push(imageData[j]);
      }
      //now work with 'chunk...[0][1][2] to calc hex value and store that in array
      //This process is ignoring the opacity for now (4th val of a chunk)
      let hexString = "#";
      for (let k = 0; k < chunk.length - 1; k++) {
        let hexVal = hexConvertor(chunk[k]);//Convert chunk[k] to hex
        hexString = hexString + hexVal;//Append to hex string
      }
      newHexColors.push(hexString);//Add hexString to hexColors    
      startPoint += 4;//Increment to the next chunk
    }
    setHexColors(newHexColors);
  };

  //Questions
  //  Does it read horizontally first or vertically first (rows vs columns) -> it reads horizontally
  // 45k pixels but 180k pieces of data for RGB????
  // Looks like each pixel is 4 pieces of data (R, G, B, a (opacity)) -> ignoring this as it shouldnt be reqd.

  const getCounts = () => {
    const newColorCounts = [];
    hexColors.forEach((hexColor) => {
      let exists = newColorCounts.find(count => count.color === hexColor);
      if(exists !== undefined) {
        exists.count +=1;
      }
      else {
        let countItem = {
          color: hexColor,
          count: 1
        };
        newColorCounts.push(countItem);
      }
    })
    setColorCounts(newColorCounts);
  };

  // Runs convertToHex when there is imageData (image has been uploaded)
  useEffect(() => {
    if (imageData.length > 0) {
      convertToHex();
    }
  }, [imageData]);

  // Runs the count function when we have an array of hex colors
  useEffect(() => {
    if(hexColors) {
      getCounts();
    }
  }, [hexColors]);

  useEffect(() => {
    if(colorCounts) {
      console.log("counts", colorCounts);
    }
  },[colorCounts])

  return {
    file,
    handleUpload,
    getImageData,
    imageData,
    hexColors,
  };
};
