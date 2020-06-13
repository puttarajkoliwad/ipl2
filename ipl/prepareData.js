let teamMatches = {};
let teamExtras = {};
let teams = [];
let teamWins = {};
let goodBowlers = {};
let teamStadWins = {};
let bowlers = [];
let dels;
let mtch;

let bigData ={
    "teamTotalWins": 0,
    'economicalBowlers': 0,
    'extras2016':0,
    'stadiumWinsForTeams': 0
}

function prepareData(matches, deliveries){
        dels = deliveries;
        mtch = matches;
        bigData["teamTotalWins"] = getTeamWins(matches);
        bigData['economicalBowlers'] = goodBowler(deliveries, matches);
        bigData['extras2016'] = getMatchId(matches);
        bigData['stadiumWinsForTeams'] = getTeamWinsOfstadium(matches);
        //console.log(bigData);
        return bigData;
}

function getMatchId(matches){
    const teamMatchId = {};
    for(let match of matches){
        if(match.season == 2016){
            if(!teamMatchId[match.team1]){
                teamMatchId[match.team1]=[match.id];
            }
            else{
                teamMatchId[match.team1].push(match.id);
            }
        }
    }
    teamMatches = teamMatchId;
    teams = [...Object.keys(teamMatches)];
    let xtras = getTeamExtras(dels);
    return xtras;
    //console.log(teamMatchId);
}

function getTeamExtras(deliveries){
    for(let team of teams ){
        let sum = 0;
        for(let delivery of deliveries ){
            if(teamMatches[team].includes(delivery.match_id) && team == delivery.bowling_team){
                sum += Number.parseInt(delivery.extra_runs);
                teamExtras[team] = sum;
            }
        }
    }
    //console.log(teamExtras);
    return teamExtras;
}

function getTeamWins(matches){
    for(let match of matches){
        if(!teamWins[match.winner]){teamWins[match.winner] = 1;}
        else teamWins[match.winner]++;
    }
    //console.log(teamWins);
    
    //console.log(teamWins);
    return teamWins;
}

function goodBowler(deliveries, matches){
    let matchID2015 = [];
    for(let mch of matches){
        //console.log(mch.season);
        if(mch.season == 2015){
            matchID2015.push(mch.id);
        }
    }
    //console.log(matchID2015);
    for(let delivery of deliveries){
        if(matchID2015.includes(delivery.match_id) &&  !goodBowlers[delivery.bowler]){
            goodBowlers[delivery.bowler] = {
                "totalRunsConceded": 0,
                "totalValidDeliveries":0,
                'economy':0
            }
        }
    }
    bowlers = [...Object.keys(goodBowlers)];
    for(let bowler of bowlers){
        for(let delivery of deliveries){
            if(matchID2015.includes(delivery.match_id) && bowler == delivery.bowler){
                goodBowlers[bowler]["totalRunsConceded"] += Number.parseInt(delivery.total_runs);
                if(delivery.ball < 7){
                    goodBowlers[bowler]['totalValidDeliveries'] += 1;
                }
            }
        }
        goodBowlers[bowler]['economy'] = ((goodBowlers[bowler]['totalRunsConceded']/goodBowlers[bowler]['totalValidDeliveries']) * 6).toFixed(2);
    }
    return goodBowlers;
}

function getTeamWinsOfstadium(matches){
    for(let match of matches){
        if(!teamStadWins[match.venue]){
            teamStadWins[match.venue] = {
                [match.winner] : 1
            }
        }
        else{
            if(!teamStadWins[match.venue][match.winner]){
                teamStadWins[match.venue][match.winner] = 1;
            }
            else{
                teamStadWins[match.venue][match.winner] += 1;
            }                                                                                                                                                                                                                         
        }
    }
    return teamStadWins;
}


module.exports = prepareData;