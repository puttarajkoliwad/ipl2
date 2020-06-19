const fs = require("fs");
const csv = require("csvtojson");
const matchesPlayedPerYear = require("./ipl/matchesPlayedPerYear");
const prepareData = require("./ipl/prepareData");

const MATCHES_FILE_PATH = "./csv_data/matches.csv";
const DELIVERIES_FILE_PATH = "./csv_data/deliveries.csv";
const JSON_OUTPUT_FILE_PATH = "./public/data.json";

let jsonData = {};

function main() {
  var teammatchIds2016 = {};
  var teamExtras2016 = {};
  csv()
    .fromFile(MATCHES_FILE_PATH)
    .then(matches => {
      let result = matchesPlayedPerYear(matches);
      
    csv()
    .fromFile(DELIVERIES_FILE_PATH).then(deliveries =>{
      let rawData = prepareData(matches, deliveries);
      let preparedBowlers = prepareBowlers(rawData.economicalBowlers);
      let preparedTeamWins =prepareTeamWins(rawData.teamTotalWins);
      let preparedStadiumTeamWins = prepareStadiumTeamWins(rawData.stadiumWinsForTeams);
      let preparedTeamExtras = prepareTeamExtras(rawData.extras);
      prepareTeamWinsPerSeason(rawData.winsPerTeamPerSeason);
      saveMatchesPlayedPerYear(result);
      //console.log(jsonData);
    });
    });
}


function prepareTeamWinsPerSeason(obj){
  jsonData.winsPerTeamPerSeason = obj;
}

function prepareTeamExtras(obj){
  jsonData.teamExtras = obj;
}

function prepareStadiumTeamWins(obj){
  jsonData.stadiumWinsForTeams = obj;
}

function prepareTeamWins(obj){
  jsonData['teamTotalWins'] = obj;
}

function prepareBowlers(obj){
  let Bowlers = [];
  for(let bowler in obj){
    Bowlers.push({'name':bowler, 'economy':Number.parseFloat(obj[bowler].economy)});
  }
  Bowlers = Bowlers.sort((a, b) => {
      return a.economy < b.economy?-1:1;
  })
  let filterBowlers = Bowlers.slice(0, 10);
  jsonData.topBowlers2015 = {};
  for(let bowler of filterBowlers){
    jsonData.topBowlers2015[bowler['name']] = bowler['economy'];
  }
  //console.log(jsonData);
}

function saveMatchesPlayedPerYear(result) {
  jsonData.matchesPlayedPerYear = result;
  const jsonString = JSON.stringify(jsonData);
  fs.writeFile(JSON_OUTPUT_FILE_PATH, jsonString, "utf8", err => {
    if (err) {
      console.error(err);
    }
  });
}

main();
