import { useEffect, useState } from "react";

export default () => {
  const [file, setFile] = useState({});
  const [imageData, setImageData] = useState([]);
  const [hexColors, setHexColors] = useState([]);
  const [colorCounts, setColorCounts] = useState();
  const clusters = [
    "#00FFFF",
    "#7FFFD4",
    "#454B1B",
    "#088F8F",
    "#AAFF00",
    "#5F9EA0",
    "#097969",
    "#AFE1AF",
    "#DFFF00",
    "#E4D00A",
    "#00FFFF",
    "#023020",
    "#7DF9FF",
    "#50C878",
    "#5F8575",
    "#4F7942",
    "#228B22",
    "#7CFC00",
    "#008000",
    "#355E3B",
    "#00A36C",
    "#2AAA8A",
    "#4CBB17",
    "#90EE90",
    "#32CD32",
    "#478778",
    "#0BDA51",
    "#98FB98",
    "#8A9A5B",
    "#0FFF50",
    "#ECFFDC",
    "#808000",
    "#C1E1C1",
    "#C9CC3F",
    "#B4C424",
    "#93C572",
    "#96DED1",
    "#8A9A5B",
    "#2E8B57",
    "#9FE2BF",
    "#009E60",
    "#00FF7F",
    "#008080",
    "#40E0D0",
    "#C4B454",
    "#40B5AD",
    "#40826D",
  ];

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

  const hexColorDelta = (hex1, hex2) => {
    // get red/green/blue int values of hex1
    var r1 = parseInt(hex1.substring(1, 3), 16);
    var g1 = parseInt(hex1.substring(3, 5), 16);
    var b1 = parseInt(hex1.substring(5, 7), 16);
    // get red/green/blue int values of hex2
    var r2 = parseInt(hex2.substring(1, 3), 16);
    var g2 = parseInt(hex2.substring(3, 5), 16);
    var b2 = parseInt(hex2.substring(5, 7), 16);
    // calculate differences between reds, greens and blues
    var r = 255 - Math.abs(r1 - r2);
    var g = 255 - Math.abs(g1 - g2);
    var b = 255 - Math.abs(b1 - b2);
    // limit differences between 0 and 1
    r /= 255;
    g /= 255;
    b /= 255;
    // 0 means opposite colors, 1 means same colors
    return (r + g + b) / 3;
}

  const getCounts = () => {
    // This forEach gets the counts of each color and returns it as an object
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
    });

    // This forEach gets the closest match and adds it to the colorCounts object
    const colorsWithCluster = newColorCounts.map((color) => {
      const differences = []
      clusters.forEach((cluster) => {
        const diff = hexColorDelta(color.color, cluster);
        differences.push({ diff, cluster });
      });
      differences.sort((a, b) => b.diff - a.diff);
      const match = differences[0];

      return {...color, match}
    });

    // This forEach gets the counts of each cluster color and returns it as an object
    const colorClusterCounts = [];
    colorsWithCluster.forEach((color) => {
      const clusterColor = color.match.cluster;
      let exists = colorClusterCounts.find(count => count.clusterColor === clusterColor);
      if(exists !== undefined) {
        exists.count +=1;
      }
      else {
        let item = {
          clusterColor: clusterColor,
          count: 1
        };
        colorClusterCounts.push(item);
      }
    });

    setColorCounts(colorClusterCounts);
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

  return {
    file,
    handleUpload,
    getImageData,
    imageData,
    hexColors,
    colorCounts
  };
};
