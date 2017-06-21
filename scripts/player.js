var Player = function(id, name, position, stats, team, mainPosition){
  this.id = id;
  this.name = name;
  this.position = position;
  this.appearances = stats.appearances;
  this.goals = stats.goals;
  this.assists = stats.assists;
  this.goalsPerMatch = stats.goalsPerMatch;
  this.passesPerMinute = stats.passesPerMinute;
  this.team = team;
  this.mainPosition = mainPosition;
};

// update image src in DOM
Player.prototype.updateImage = function(){
  var imageElem = document.getElementById("player-image");
  var url = "/img/p" + this.id + ".png";
  imageElem.setAttribute("src", url);
};

// update player name and position in DOM
Player.prototype.playerDetails = function(){
  var nameElem = document.getElementById("name");
  var positionElem = document.getElementById("position");
  var teamElem = document.getElementById("badge");
  nameElem.innerHTML = this.name;
  positionElem.innerHTML = this.mainPosition;
  teamElem.setAttribute("class", "icon-" + this.team);
};

// update player stats in the DOM
Player.prototype.updateStats = function(){
  var appearancesElem = document.getElementById("appearances");
  var goalsElem = document.getElementById("goals");
  var assistsElem = document.getElementById("assists");
  var perMatchElem = document.getElementById("goals-per-match");
  var perMinuteElem = document.getElementById("passes-per-minute");

  appearancesElem.innerHTML = "Appearances <strong>" + this.appearances + "</strong>";
  goalsElem.innerHTML = "Goals <strong>" + this.goals + "</strong>";
  assistsElem.innerHTML = "Assists <strong>" + this.assists + "</strong>";
  perMatchElem.innerHTML = "Goals per match <strong>" + this.goalsPerMatch + "</strong>";
  perMinuteElem.innerHTML = "Passes per minute <strong>" + this.passesPerMinute + "</strong>";
};

// render the UI with new player object
Player.prototype.render = function(){
  this.updateImage();
  this.playerDetails();
  this.updateStats();
};
