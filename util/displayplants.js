//const Validator = require('validatorjs');
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
      headerStr +="<body>";
      headerStr +="<header>";
      headerStr +="<div>";
      headerStr +=" <h1>Plant View</h1>";
      headerStr +="</div>      ";
      headerStr +=" </header>";
      headerStr +=" <main>";
      headerStr +=" <section id='plantlistpage'>";
    return(headerStr);
}

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

function plantItem(pItem) {
    var onePlant = "";
    onePlant += "<table>";
    onePlant += "<tbody>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Plant Name: </td><td>";
    onePlant += pItem.name;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Scientific Name: </td><td>";
    onePlant += pItem.scientificName;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Coldest Zone: </td><td>";
    onePlant += pItem.coldestZone;
    onePlant += "</td></tr>";
    onePlant += "<tr><td style='padding: 2px 10px;'>Warmest Zone: </td><td>";
    onePlant += pItem.warmestZone;
    onePlant += "</td></tr>";
    onePlant += "</tbody>";
    onePlant += "</table>";

}

function plantHTML(plants) {
    var plantsjson = plants;
    var plantHTMLString = "";
    plantHTMLString += plantHdr();
    plantsjson.forEach(plantsjson => {
        plantHTMLString += plantItem(plantsjson);  // Process each plant as needed
    });
    plantHTMLString += plantFtr(plants.length);   
    return(plantHTMLString);
};

module.exports = { 
    plantHTML
};
/*
// Globals
let searchStr = "";

const availPlayerParent = document.querySelector("#availbody");
const myPlayerParent = document.querySelector("#myplayerbody");
const playerDescParent = document.querySelector("#selplayers");

// This class holds all information and activities needed by a player
class Player {
    constructor(id, fname="", lname="", team="", position="", 
        games=0, points=0, rebounds=0, assists=0, steals=0, blocks=0, index=0) {
            this.id = id;
            this.fname = fname;
            this.lname = lname;
            this.team = team;
            this.position = position;
            this.games = games;
            this.points = points;
            this.rebounds = rebounds;
            this.assists = assists;
            this.steals = steals;
            this.blocks = blocks;
            this.index = index;
    }

    // Set Index - this is the way the selected player is identified in the array
    setPlayerIndex(ind) {
        this.index = ind;
    }

    // Get Index - retrieve the selected player's position in the array
    getPlayerIndex() {
        return(this.index);
    }

    // Set statistics for a player
    setStats(games=0, points=0, rebounds=0, assists=0, steals=0, blocks=0) {
        this.games = games;
        this.points = points;
        this.rebounds = rebounds;
        this.assists = assists;
        this.steals = steals;
        this.blocks = blocks;
    }

    // Copy from an existing player object into a new player object
    copyPlayer(aPlayer) {
        this.id = aPlayer.id;
        this.fname = aPlayer.fname;
        this.lname = aPlayer.lname;
        this.team = aPlayer.team;
        this.position = aPlayer.position;
        this.games = aPlayer.games;
        this.points = aPlayer.points;
        this.rebounds = aPlayer.rebounds;
        this.assists = aPlayer.assists;
        this.steals = aPlayer.steals;
        this.blocks = aPlayer.blocks;        
        this.index = aPlayer.index;        
    }

    // Display a player that cannot be selected
    // This player would be displayed in the selected player list 
    displaySelectedPlayer(parentElement) {
        //debugger;
        //console.log(this);
        const row = document.createElement("tr");
        let item = document.createElement("td");
        item.innerHTML = `${this.lname}, ${this.fname}`;
        item.setAttribute("class", "name");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.team}`;
        item.setAttribute("class", "team");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.position}`;
        item.setAttribute("class", "position");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.games}`;
        item.setAttribute("class", "games");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.points/this.games).toFixed(2)}`;
        item.setAttribute("class", "points");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.rebounds/this.games).toFixed(2)}`;
        item.setAttribute("class", "rebounds");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.assists/this.games).toFixed(2)}`;
        item.setAttribute("class", "assists");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.steals/this.games).toFixed(2)}`;
        item.setAttribute("class", "steals");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.blocks/this.games).toFixed(2)}`;
        item.setAttribute("class", "blocks");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.index}`;
        item.setAttribute("class", "index");
        row.appendChild(item);
        parentElement.appendChild(row);
    }

    // Display a player that can be selected
    // This player would be displayed in the available player list 
    // and in my player list
    displaySelectablePlayer(parentElement) {
        const row = document.createElement("tr");
        let item = document.createElement("td");
        item.innerHTML = `${this.lname}, ${this.fname}`;
        item.setAttribute("class", "name");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.team}`;
        item.setAttribute("class", "team");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.position}`;
        item.setAttribute("class", "position");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.games}`;
        item.setAttribute("class", "games");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.points/this.games).toFixed(2)}`;
        item.setAttribute("class", "points");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.rebounds/this.games).toFixed(2)}`;
        item.setAttribute("class", "rebounds");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.assists/this.games).toFixed(2)}`;
        item.setAttribute("class", "assists");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.steals/this.games).toFixed(2)}`;
        item.setAttribute("class", "steals");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${(this.blocks/this.games).toFixed(2)}`;
        item.setAttribute("class", "blocks");
        row.appendChild(item);
        item = document.createElement("td");
        item.innerHTML = `${this.index}`;
        item.setAttribute("class", "index");
        row.appendChild(item);
        // Listener attached to the item to pull stats
        row.addEventListener('click', () => {
            //debugger;
            let addBtn = document.getElementById("addBtn");
            let delBtn = document.getElementById("delBtn");
            if (parentElement == availPlayerParent) {
                addBtn.classList.remove('hidden');
                delBtn.classList.add('hidden');
            }
            if (parentElement == myPlayerParent) {
                delBtn.classList.remove('hidden');
                addBtn.classList.add('hidden');
            }
            removePrevSelected();
            //debugger;
            row.classList.add('selected');
            this.displaySelectedPlayer(playerDescParent);
        })
        parentElement.appendChild(row);
    }
}

// PlayerList is the container for each of the 2 lists of players 
class PlayerList {
    constructor(listname='availplayerlist') {
        //debugger;
        this.pList = new Array();
        // If we are creating the available player list,
        // we will use the JSON data above
        if (listname=='availplayerlist') {
            var myJSON = jsonPlayerData; // Use JSON data above
            //console.log(myJSON);
            if (myJSON != "" && myJSON != null) {
                // For each player in the JSON, create a player
                for (var i=0; i<myJSON.length; i++) {
                    var storedItem = new Player(myJSON[i].id, myJSON[i].fname, 
                        myJSON[i].lname, myJSON[i].team, myJSON[i].position, 
                        myJSON[i].games, myJSON[i].points, myJSON[i].rebounds, 
                        myJSON[i].assists, myJSON[i].steals, myJSON[i].blocks, i);

/*                  This code is used when I want to generate random stats

                    playerGames = (45+(Math.random()*17));
                    var storedItem = new Player(myJSON[i].id, myJSON[i].fname, 
                        myJSON[i].lname, myJSON[i].team, myJSON[i].position, 
                        playerGames.toFixed(0), 
                        (playerGames*Math.random()*30).toFixed(0), 
                        (playerGames*Math.random()*15).toFixed(0), 
                        (playerGames*Math.random()*12).toFixed(0), 
                        (playerGames*Math.random()*6).toFixed(0), 
                        (playerGames*Math.random()*4).toFixed(0), i); *//*
                    this.pList.push(storedItem); // Add player to the list
                }
            }
        } 
        // If we are creating my player list,
        // we will use the localStorage data
        else {
            // Pull the current list from the localStorage
            var myJSON = JSON.parse(window.localStorage.getItem(listname));
            //console.log(myJSON);
            //var playerGames;
            // If a list exists in localStorage, create players and 
            //add them to this list
            if (myJSON != "" && myJSON != null) {
                for (var i=0; i<myJSON.length; i++) {
                    var storedItem = new Player(myJSON[i].id, myJSON[i].fname, 
                        myJSON[i].lname, myJSON[i].team, myJSON[i].position, 
                        myJSON[i].games, 
                        myJSON[i].points,
                        myJSON[i].rebounds, 
                        myJSON[i].assists, 
                        myJSON[i].steals, 
                        myJSON[i].blocks, i);

/*                  This code is used when I want to generate random stats

                    playerGames = (45+(Math.random()*17));
                    var storedItem = new Player(myJSON[i].id, myJSON[i].fname, 
                        myJSON[i].lname, myJSON[i].team, myJSON[i].position, 
                        playerGames.toFixed(0), 
                        (playerGames*Math.random()*30).toFixed(0), 
                        (playerGames*Math.random()*15).toFixed(0), 
                        (playerGames*Math.random()*12).toFixed(0), 
                        (playerGames*Math.random()*6).toFixed(0), 
                        (playerGames*Math.random()*4).toFixed(0), i);*//*
                    this.pList.push(storedItem);
                }
            }
        }
    }

    // Display this list of players
    displayPlayerList (parentElement) {
        //debugger;
        //parentElement.textContent = "";
        var child = parentElement.lastElementChild;
        // Remove all current players from HTML

        //while (child && parentElement.querySelectorAll("tr").length > 1) {
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
        //debugger;
        // Add players currently in the player list
        var listCount = 0;
        if (this.pList.length != 0 && this.pList[0] != undefined) {
            for (var i=0; i<this.pList.length; i++) {
                if (!undefined) {
                    // Filter display based on search value
                    if ((this.pList[i].lname.search(searchStr) != -1) || 
                        (this.pList[i].fname.search(searchStr) != -1)) {
                        this.pList[i].displaySelectablePlayer(parentElement);
                        // Count items in displayed list
                        listCount++;
                    }
                }
            }
        }
        // If no items are displayed, add a "No Players" line item.
        if (listCount == 0) {
            const row = document.createElement("tr");
            let item = document.createElement("td");
            item.innerHTML = `No players`;
            item.setAttribute("class", "name");
            row.appendChild(item);
            parentElement.append(row);
        }
        // Save current list to localStorage
        if (parentElement == myPlayerParent) {
            let myJSON = JSON.stringify(this.pList);   
            window.localStorage.setItem('myplayerlist', myJSON);    
        }
    }

    // Get a player from the list using the player index
    getPlayer(thisPlayerIndex) {
        return(this.pList[thisPlayerIndex]);
    }

    // Add a player to the list
    addPlayer(newPlayer) {
        newPlayer.setPlayerIndex(this.pList.length);
        this.pList.push(newPlayer);        
    }

    // Delete a player from the list
    deletePlayer(newPlayer) {
        this.pList.splice(newPlayer.getPlayerIndex(), 1);
        for (let i=0; i<this.pList.length; i++) {
            if (this.pList[i].getPlayerIndex()!=i) {
                this.pList[i].setPlayerIndex(i);
            }
        }

    }
}

// Function to remove the selected class 
// from any player who was previously selected
function removePrevSelected() {
    let nodeList = availPlayerParent.childNodes;
    console.log(nodeList);
    //debugger;
    for (let i = 2; i < nodeList.length; i++) {
      nodeList[i].classList.remove('selected');
    }
    nodeList = myPlayerParent.childNodes;
    console.log(nodeList);
    //debugger;
    for (let i = 2; i < nodeList.length; i++) {
      nodeList[i].classList.remove('selected');
    }
    nodeList = playerDescParent.childNodes;
    console.log(nodeList);
    //debugger;
    for (let i = 2; i < nodeList.length; i++) {
        playerDescParent.removeChild(nodeList[i]);
        //nodeList[i].classList.remove('selected');
    }
}

// Function to add a player who was selected in the available player list
// and who now appears in the selected player box to the my player list
function addPlayer() {
    let thisPlayer = document.getElementsByClassName("selected");
    let thisPlayerIndex = parseInt(thisPlayer[0].lastChild.lastChild.data);
    let selectedPlayer = availPlayers.getPlayer(thisPlayerIndex);
    let newPlayer = new Player();
    newPlayer.copyPlayer(selectedPlayer);
    myPlayers.addPlayer(newPlayer);
    myPlayers.displayPlayerList(myPlayerParent);
}

// Function to delete a player who was selected in the my player list
// and who now appears in the selected player box
function deletePlayer() {
    let thisPlayer = document.getElementsByClassName("selected");
    let thisPlayerIndex = parseInt(thisPlayer[0].lastChild.lastChild.data);
    let selectedPlayer = myPlayers.getPlayer(thisPlayerIndex);
    myPlayers.deletePlayer(selectedPlayer);    
    myPlayers.displayPlayerList(myPlayerParent);
}

// Function to sort a table. 
// Parms
// table = table to be sorted
// column = column to use
// asc = true(ascending) or false(descending)
// tblnbr = 1(available) or 2(my players)
function sortTab(table, column, asc=true, tblnbr) {
    //debugger;
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));
    var sortedRows;
    // The first 3 columns are sorted alphabetically
    if (column < 3) {
        sortedRows = rows.sort((a,b) => {
            const aColText = a.querySelector(`td:nth-child(${column+1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column+1})`).textContent.trim();
    
            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        });
    }
    // Remaining columns are sorted numberically
    else {
        sortedRows = rows.sort((a,b) => {
            const aColText = a.querySelector(`td:nth-child(${column+1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column+1})`).textContent.trim();

            const aValue = parseFloat(aColText);
            const bValue = parseFloat(bColText);
    
            return aValue > bValue ? (1 * dirModifier) : (-1 * dirModifier);
        });    
    }

    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    tBody.append(...sortedRows);

    // Make changes to avail table
    if (tblnbr==1) {
        table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th-sort-asc", asc);
        table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th-sort-desc", !asc);    
    // Make changes to my player table
    } else {
        table.querySelectorAll("th").forEach(th => th.classList.remove("th2-sort-asc", "th2-sort-desc"));
        table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th2-sort-asc", asc);
        table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th2-sort-desc", !asc);    
    }
}

// Filter the player list by input value
// list = the list to filter
// parentID = parent element where the list will be displayed
// inputElem = element that holds the search string
function filterPlayer(list, parentID, inputElem) {
    //debugger;
    searchStr = document.getElementById(inputElem).value;
    //console.log(`input? ${document.getElementById(inputElem).value}`);
    //console.log(searchStr);
    parentElement = document.getElementById(parentID);
    list.displayPlayerList(parentElement);
}


// Set up sorting listener for each heading in the avail list
document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        sortTab(tableElement, headerIndex, !currentIsAscending, 1);
    })
})

// Set up sorting listener for each heading in the myplayer list
document.querySelectorAll(".table2-sortable th").forEach(headerCell => {
    //debugger;
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th2-sort-asc");
        sortTab(tableElement, headerIndex, !currentIsAscending, 2);
    })
})

// Create List of available players
let availPlayers = new PlayerList("availplayerlist");
availPlayers.displayPlayerList(availPlayerParent);
// Create List of My Players
let myPlayers = new PlayerList("myplayerlist");
myPlayers.displayPlayerList(myPlayerParent);
*/

