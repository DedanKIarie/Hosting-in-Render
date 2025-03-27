const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});



var user = ""
//start function
function getplayer() {
    let playerbox = document.getElementById("username").value.trim();
    user = playerbox
    if (!user) {
         document.getElementById("status").innerHTML = "Please enter a name"
        return;
    }
     document.getElementById("status").innerHTML = "Starting up json server"
     document.getElementById("status").style.color = "blue"
    fetch("https://guess-the-country-ofgg.onrender.com/players")
        .then(response => response.json())
        .then(players => {
            let playerExists = false;

            for (let i = 0; i < players.length; i++) {
                if (players[i].username === playerbox) {
                    playerExists = true;
                     document.getElementById("status").innerHTML = "Successful log in"
                     document.getElementById("status").style.color = "Green"
                    break;
                }
            }

            if (!playerExists) {
                document.getElementById("status").innerHTML = `player not found adding ${playerbox}`
                document.getElementById("status").style.color = "red"
                
                let newPlayer = { username: playerbox, score: 0, Wins:0 };

                fetch("https://guess-the-country-ofgg.onrender.com/players", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newPlayer)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("New player added:", data);
                    document.getElementById("status").innerHTML = "New player added: " + playerbox
                    document.getElementById("status").style.color = "Green"
                    document.getElementById("player-name").innerText = `Welcome: ${playerbox}`
                    setTimeout(function() {
                         document.getElementById("status").innerHTML = "Remember to relog in after refreshing the page"
                         document.getElementById("status").style.color = "Green"
                    }, 2000);
                });
            }
        })
}

function login() {
    getplayer();
    updatePlayerScore(user)
}

var dataimg = ""
async function getCountries() {

    let playerbox = document.getElementById("username").value.trim();
    user = playerbox
    if (!user) {
        console.log("Username is empty");
        return;
    }
    let url;
    let continent = document.getElementById("continent").value;
    document.getElementById("new-country").innerText = "Fetching Countries"
    if (continent === "all") {
        url = "https://restcountries.com/v3.1/all";
    } else {
        url = `https://restcountries.com/v3.1/region/${continent}`;
    }
    
    let response = await fetch(url);
    let result = await response.json();
    console.log(result);
    function randomize() {
        let randomcountry = result.length
        console.log(randomcountry)

        let i = Math.floor(Math.random()*randomcountry)
        console.log(i)
        dataimg= result[i].name.common
        document.getElementById("flag").src = result[i].flags.png;

    }
    randomize()
     document.getElementById("new-country").innerText = "Next Country"
}


function checkanswer() {
    console.log(dataimg)
if (document.getElementById("guess").value == dataimg) {
    console.log("correct") 
    updatePlayerScore(user)
    getCountries()
} else {
    console.log("incorrect")
}
}
async function updatePlayerScore(username) {
    let response = await fetch("https://guess-the-country-ofgg.onrender.com/players");
    let players = await response.json();
    let player = players.find(p => p.username === username);

    if (!player) return console.log("Player not found.");

    let updatedResponse = await fetch(`https://guess-the-country-ofgg.onrender.com/players/${player.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: player.score + 1 })
    });

    let updatedPlayer = await updatedResponse.json();
    document.getElementById("score").innerText = `Score: ${updatedPlayer.score}`
}


var hintIndex = 0;

async function hint() {
    let res = await fetch("https://restcountries.com/v3.1/name/" + dataimg);
    let c = (await res.json())[0];

    let languagesText;
    if (c.languages) {
        languagesText = Object.values(c.languages).join(", ");
    } else {
        languagesText = "No Languages";
    }

    let capitalText;
    if (c.capital && c.capital.length > 0) {
        capitalText = c.capital[0];
    } else {
        capitalText = "No Capital";
    }

    let hints = [
        `Region: ${c.region}`,
        `SubRegion: ${c.subregion}`,
        `Capital: ${capitalText}`,
        `Languages: ${languagesText}`
    ];

    if (isNaN(hintIndex)) {
        hintIndex = 0;
    } else {
        hintIndex = hintIndex % hints.length;
    }

    document.getElementById("hints").innerHTML = hints[hintIndex++];
}

function closeInstructions() {
    document.getElementById("instructions-container").style.display = "none";
}



async function fetchLeaderboard() {
    let response = await fetch("https://guess-the-country-ofgg.onrender.com/players");
    let players = await response.json();
    players.sort((a, b) => b.score - a.score);

    let leaderboardHTML = "<h2>Leaderboard</h2><ul>";
    players.forEach((player, index) => {
        leaderboardHTML += `<li>${index + 1}. ${player.username} - Score: ${player.score}</li>`
    });
    leaderboardHTML += "</ul>";
    document.getElementById("leaderboard").innerHTML = leaderboardHTML;
}


function updateTheme() {
    let theme = document.getElementById("Dropdown").value

    let themes = {
        "Dark": ["rgb(18, 18, 18)", "rgb(26, 26, 26)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(18, 18, 18)", "rgb(255, 255, 255)", "rgb(51, 51, 51)", "rgb(255, 255, 255)"],
        "Light": ["rgb(255, 255, 255)", "rgb(248, 248, 248)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(255, 255, 255)", "rgb(0, 0, 0)", "rgb(221, 221, 221)", "rgb(0, 0, 0)"],
        "Blue": ["rgb(0, 31, 63)", "rgb(0, 51, 102)", "rgb(255, 255, 255)", "rgb(173, 216, 230)", "rgb(0, 64, 128)", "rgb(173, 216, 230)", "rgb(0, 116, 204)", "rgb(255, 255, 255)"],
        "Retro": ["rgb(0, 51, 0)", "rgb(0, 77, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 34, 0)", "rgb(0, 255, 0)", "rgb(0, 85, 0)", "rgb(0, 255, 0)"],
        "Cyberpunk": ["rgb(13, 2, 33)", "rgb(36, 0, 70)", "rgb(255, 0, 255)", "rgb(0, 255, 234)", "rgb(27, 0, 47)", "rgb(255, 0, 144)", "rgb(0, 255, 234)", "rgb(27, 0, 47)"],
        "Forest": ["rgb(45, 74, 45)", "rgb(64, 108, 64)", "rgb(255, 255, 255)", "rgb(210, 231, 210)", "rgb(31, 51, 31)", "rgb(164, 203, 170)", "rgb(90, 131, 90)", "rgb(255, 255, 255)"]
    };

    if (themes[theme]) {
        let colors = themes[theme];

        document.getElementById("game-container").style.background = colors[0]
        document.getElementById("instructions-container").style.background = colors[1]
        document.getElementById("player-name").style.color = colors[2]
        document.body.style.color = colors[3];
        document.body.style.background = colors[4];
        document.getElementById("guess").style.background = colors[5];

        let buttons = document.querySelectorAll("button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.background = colors[6]
            buttons[i].style.color = colors[7];
            buttons[i].style.border = "1px solid " + colors[2]
            buttons[i].style.transition = "background 0.3s, color 0.3s"
        }

        let inputs = document.querySelectorAll("input, select")
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.background = colors[4]
            inputs[i].style.color = colors[2];
            inputs[i].style.border = "1px solid " + colors[2]
        }

        let headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        for (let i = 0; i < headings.length; i++) {
            headings[i].style.color = colors[2]
        }

        let sidePanel = document.getElementById("side-panel")
        if (sidePanel) {
            sidePanel.style.background = colors[1]
            sidePanel.style.color = colors[2]
        }
    }
}
