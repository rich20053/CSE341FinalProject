//const { getCategoryById } = require("../controllers/category");
const mongodb = require("../models/connect");
const ObjectId = require('mongodb').ObjectId;

// Construct HTML header
function plantHdr() {
    var headerStr = "";
    headerStr +="<!DOCTYPE html>";
    headerStr +="<html lang='en'>";
      headerStr +="<head>";
      headerStr +="<meta charset='UTF-8' />";
      headerStr +="  <meta name='viewport' content='width=device-width, initial-scale=1.0' />";
      headerStr +="  <title>CSE 340 Final Project - GardenGrow API</title>";
      headerStr +="  <link rel='preconnect' href='https://fonts.googleapis.com'>";
      headerStr +="  <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>";
      headerStr +="  <link href='https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Raleway&display=swap' rel='stylesheet'>    ";
      //headerStr +="  <link rel='stylesheet' href='./css/player_style.css'> ";
      headerStr +="</head>"; 
      headerStr +="<body style='color: darkgreen; background: lightgreen'>";
      headerStr +="<header>";
      headerStr +="<div>";
      headerStr +=" <h1>Plant View</h1>";
      headerStr +="</div>      ";
      headerStr +=" </header>";
      headerStr +=" <main>";
      headerStr +=" <section id='plantlistpage'>";
    return(headerStr);
}

// Constuct HTML footer
function plantFtr(plantTotal) {
  var footerStr = "";
  footerStr += "</section>";
  footerStr += "</main>";
  footerStr += "<footer>";
  footerStr += "<p>Total Plants = " + plantTotal + "</p><br>";
  footerStr += "</footer>";
  footerStr += "</body>";
  footerStr += "</html>";
  return(footerStr);
}

// Get the name of the care type for use in HTML
const getCareType = async (ctId) => {
    const collection =  await mongodb.getDb().collection('caretype');
    const reqCareTypeDoc = await collection.findOne({_id: ctId});
    const reqCareTypeName =  reqCareTypeDoc.name;
    return(reqCareTypeName);
}

// Get the category of the plant for use in HTML
const getCategory = async (catId) => {
    var catName = "";
    const collection =  await mongodb.getDb().collection('category');
    const reqCategoryDoc = await collection.findOne({_id: catId});
    const reqCategoryName =  reqCategoryDoc.name;
    catName += "<tr><td style='padding: 2px 10px;'>Category: </td><td>";
    //console.log(catName);
    catName +=  reqCategoryName;
    catName +=  "</td></tr>";
    return(catName);
}

// Get the care information for use in HTML
const getCares = async (plantId) => {
    var careString = "";

    const result = await mongodb.getDb()
    .collection('care')
    .find({ plantId: plantId })
    .toArray();

    for (const careItem of result) {
        careString += "<tr><td style='padding: 2px 10px;'>"
        careString += await getCareType(careItem.careTypeId);
        careString += "</td><td>";
        careString += careItem.description;
        careString += "</td></tr>";
    }
    return (careString);
}

// Construct plant data for use in HTML
const plantItem = async (pItem) => {
    var onePlant = "";
    onePlant += "<table>";
    onePlant += "<tbody>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Plant Name: </td><td>";
    onePlant += pItem.name;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Scientific Name: </td><td>";
    onePlant += pItem.scientificName;
    onePlant += "</td></tr>";
    onePlant += await getCategory(pItem.categoryId);
    onePlant += "<tr><td style='padding: 2px 10px;'>Coldest Zone: </td><td>";
    onePlant += pItem.coldestZone;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Warmest Zone: </td><td>";
    onePlant += pItem.warmestZone;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Colors: </td><td>";
    pItem.colors.forEach(color => {
        onePlant += color;
        onePlant += ", ";
    });
    onePlant += "</td></tr>";    
    onePlant += "<tr><td style='padding: 2px 10px;'>Height (inches): </td><td>";
    onePlant += pItem.height;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Space (inches): </td><td>";
    onePlant += pItem.space;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Days to Germination: </td><td>";
    onePlant += pItem.daysToGermination;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Days to Flower: </td><td>";
    onePlant += pItem.daysToFlower;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Days to Harvest: </td><td>";
    onePlant += pItem.daysToHarvest;
    onePlant += "</td></tr>";
    onePlant += await getCares(pItem._id);
    onePlant += "</tbody>";
    onePlant += "</table>";
    return(onePlant);
}

// Assemble plant HTML
const plantHTML = async (plants) => {
    var plantsjson = plants;

    var plantHTMLString = "";

    plantHTMLString += plantHdr();
    for (const plant of plantsjson) {
        plantHTMLString += await plantItem(plant);  // Process each plant as needed
        plantHTMLString += "<br>";
    }
    plantHTMLString += plantFtr(plants.length);  
    return(plantHTMLString);
};

module.exports = { 
    plantHTML
};
