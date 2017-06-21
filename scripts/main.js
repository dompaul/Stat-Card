var app = {
  template: null,
  url: "/player-stats.json",
  // Initialise app
  init: function(){
    var _self = this;
    _self.getJSON(this.url, function(err, data){
      if (err !== null) {
        console.warn('Something went wrong: ' + err);
      } else {
        _self.loadSelect(data.players);
        _self.bindEvents(data);
      }
    });
  },
  /** Load select option for users
   * @param: {Object} - Football player data
   */
  loadSelect: function(data){
    var select = document.getElementById("select");
    for (var id = 0; id != data.length; id++) {
      var playerId = data[id].player.id;
      var playerName = data[id].player.name.first + " " + data[id].player.name.last;
      var node = document.createElement("option");
      var textnode = document.createTextNode(playerName);
      node.appendChild(textnode);
      node.setAttribute("value", playerId);
      select.appendChild(node);
    }
  },
  /** retrieve JSON data via URL
   * @param: {String} - url string
   * @param: {Function} - checks if request is sucessful or not
   */
  getJSON: function(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  },
  /** Formatting statistical data for the score-card
   * @param: {Number} - Number of player appearances
   * @param: {Number} - Number of goals scored
   * @param: {Number} - Number of player assists
   * @param: {Number} - Number of forward passes
   * @param: {Number} - Number of back passes
   * @param: {Number} - Number of minutes played
   * @return {Object} - Calculated stats for Goals per Match and Passes per Minute
   */
  calculateData: function(appearances, goals, assists, forwardPasses, backPasses, minsPlayed){
    var goalsPerMatch = Math.round((goals / appearances) * 100) / 100;
    var passesPerMinute = Math.round(((backPasses + forwardPasses) / minsPlayed) * 100) / 100;
    return {
      goalsPerMatch: goalsPerMatch,
      passesPerMinute: passesPerMinute
    };
  },
  /** retrieve JSON data via URL
   * @param: {Object} - Object with all statistical player data
   * @return {Object} - Calculated stats card with all relevant pieces
   */
  getStats: function(data){
    var appearances = "";
    var goals = "";
    var assists = "";
    var forwardPasses = "";
    var backPasses = "";
    var minsPlayed = "";

    for (var stat = 0; stat != data.length; stat++) {
      var statName = data[stat].name;
      switch (statName) {
        case "appearances":
          // appearances
          appearances = data[stat].value;
          break;
        case "goals":
          // goals
          goals = data[stat].value;
          break;
        case "goal_assist":
          // assists
          assists = data[stat].value;
          break;
        case "fwd_pass":
          // fwd_pass
          forwardPasses = data[stat].value;
          break;
        case "backward_pass":
          // backward_pass
          backPasses = data[stat].value;
          break;
        case "mins_played":
          // mins_played
          minsPlayed = data[stat].value;
          break;
        default:
          // do nothing
      }
    }
    var sumData = this.calculateData(appearances, goals, assists, forwardPasses, backPasses, minsPlayed);
    return {
      "appearances": appearances,
      "goals": goals,
      "assists": assists,
      "goalsPerMatch": sumData.goalsPerMatch,
      "passesPerMinute": sumData.passesPerMinute
    };
  },
  /** Map the position of the player with the correct key
   * @param: {String} - String containing multiple positions for the player
   * @return {Object} - Selected single position for the player
   */
  mapPosition: function(position){
    var positions = {"D": "Defender","M": "Midfielder","F": "Striker"};
    var playerPosition = positions[position];
    return playerPosition;
  },
  collectPlayerData: function(data, id){
    var _self = this;

    var name = "";
    var positionInfo = "";
    var mainPosition = "";
    var team = "";

    data.forEach(function(item, i, mapObj){
      var playerId = item.player.id;
      var player = item.player;
      var playerStats = item.stats;
      if (parseInt(id) === parseInt(playerId)) {
        name = player.name.first + " " + player.name.last;
        positionInfo = player.info.positionInfo;
        mainPosition = player.info.position;
        team = player.currentTeam.id;
        var stats = _self.getStats(playerStats);
        var position = _self.mapPosition(mainPosition);
        _self.renderStatCard(id, name, positionInfo, stats, team, position);
      }
    });
  },
  /** render the new stat card
   * @param: {Number} - Player ID Number
   * @param: {String} - Player name
   * @param: {String} - Player position
   * @param: {Object} - Player record stat data
   * @param: {Number} - Team ID
   * @param: {String} - Player main position
   */
  renderStatCard: function(id, name, position, stats, team, mainPosition){
    var _self = this;
    _self.template = new Player(id, name, position, stats, team, mainPosition);
    _self.template.render();
  },
  /** Handle click events and user behaviour
   * @param: {Object} - player data
   */
  bindEvents: function(playerData){
    var _self = this;
    var select = document.getElementById("select");
    var firstOption = select.options[0].value;
    _self.collectPlayerData(playerData.players, firstOption);

    select.onchange = function(event){
      var selectedOption = this.options[this.selectedIndex].value;
      /** Create new player object with stats
       * @param: {Object} - player data
       * @param: {Number} - selected player ID
       */
       _self.collectPlayerData(playerData.players, selectedOption);
    };
  }
};

app.init();
