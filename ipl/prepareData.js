let teamMatches = {};
let teamExtras = {};
let teams2016 = [];
let teamWins = {};
let goodBowlers = {};
let teamStadWins = {};
let bowlers = [];
let dels;
let mtch;
let mapIdYears;
let allteams = [];


let bigData ={
    "teamTotalWins": 0,
    'economicalBowlers': 0,
    'extras':0,
    'stadiumWinsForTeams': 0,
    'winsPerTeamPerSeason':{}
}

function yearIds(matches){
    let yearsIds = {};
    for(let match of matches){
        if(!yearsIds[match.season]){
            yearsIds[match.season] = [Number.parseInt(match.id)];
        }
        else{
            if(!yearsIds[match.season].includes(match.id)){
                yearsIds[match.season].push(Number.parseInt(match.id));
            }
        }
    }
    return yearsIds;
}

function prepareData(matches, deliveries){
        dels = deliveries;
        mtch = matches;
        mapIdYears = yearIds(matches);
        getMatchId(matches)
        bigData["teamTotalWins"] = getTeamWins(matches);
        bigData['economicalBowlers'] = goodBowler(deliveries, matches);
        bigData['extras'] = getSelectedYearsExtras(deliveries);
        bigData['winsPerTeamPerSeason'] = getWinsPerTeamPerSeason(matches);
        bigData['stadiumWinsForTeams'] = getTeamWinsOfstadium(matches);
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
    teams2016 = [...Object.keys(teamMatches)];
    let xtras = getTeamExtras(dels);
    return xtras;
}

function getWinsPerTeamPerSeason(matches){
    let temp = {};
    let res = {myteams: {}};
    for(let match of matches){
        res.myteams[match.winner] = 1;
        if(!temp[match.season]){
            temp[match.season] = {
                [match.winner] : 1
            }
        }
        else{
            if(!temp[match.season][match.winner]){
                temp[match.season][match.winner] = 1;
            }
            else{
                temp[match.season][match.winner]++;
            }
        }
    }
    res.seasons =[...Object.keys(temp)];
    res.series = [];
    let allTeams = [...Object.keys(res.myteams)];
    allteams = allTeams;
    for(let team of allTeams){
        let arb = [];
        for(let season in temp){
            if(temp[season][team]){
                arb.push(temp[season][team]);
            }
            else{
                arb.push(0);
            }
        }
        res.series.push({'name':team, 'data':arb});
    }
    return res;
}

function getSelectedYearsExtras(deliveries){
    let seasons =[...Object.keys(mapIdYears)];
    let temp = {}
    for(let season of seasons){
        temp[season] = {};
    }
    for(let delivery of deliveries){
        for(let season of seasons){
            if(mapIdYears[season].indexOf(Number.parseInt(delivery.match_id)) >= 0){
                if(!temp[season][delivery.bowling_team]){
                    temp[season][delivery.bowling_team] = Number.parseInt(delivery.extra_runs);
                }
                else{
                    temp[season][delivery.bowling_team] += Number.parseInt(delivery.extra_runs);
                }
            }
        }
    }
    return temp;
}

function getTeamExtras(deliveries){
    for(let team of teams2016 ){
        let sum = 0;
        for(let delivery of deliveries ){
            if(teamMatches[team].includes(delivery.match_id) && team == delivery.bowling_team){
                sum += Number.parseInt(delivery.extra_runs);
                teamExtras[team] = sum;
            }
        }
    }
    return teamExtras;
}

function getTeamWins(matches){
    for(let match of matches){
        if(!teamWins[match.winner]){teamWins[match.winner] = 1;}
        else teamWins[match.winner]++;
    }
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
            teamStadWins[match.venue] = {};
        }
    }
    for(let stad in teamStadWins){
        for(let team of allteams){
            teamStadWins[stad][team] = 0;
        }
    }
    for(let match of matches){
        teamStadWins[match.venue][match.winner]++;
    }
    return teamStadWins;
}


module.exports = prepareData;