var keys = require('./keys');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command=process.argv[2];

switch (command){
	case "movie-this":
		movieFunction();
	break;
	case "my-tweets":
		twitterFunction();
	break;
	case `spotify-this-song`:
		spotifyFunction();
	break;
	case 'do-what-it-says':
		choiceIsNotYours();
	break;
}

//--------------for movies------------//


function movieFunction(){

	var movieArgument=process.argv.slice(3).join("%20");
	var omdbapiURL= `http://www.omdbapi.com/?apikey=trilogy&t=${movieArgument}&plot=short`;

	if (movieArgument === "")
	{
		omdbapiURL= `http://www.omdbapi.com/?apikey=trilogy&t=Mr.%20Nobody&plot=short`;
	}

	request(omdbapiURL, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);


  }
});

}

//===========end for movies==============//


//-----------for twitter---------------//

function twitterFunction(){

	var client = new twitter(keys.twitter);

	var params = {
  		screen_name: 'JPCVX',
  		count: 20
	};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for (var i=0; i<tweets.length; i++){
    	console.log(`\nTweet: ${tweets[i].text}`);
    	console.log(`Date Created: ${tweets[i].created_at}`)
    }
  }
});

}

//===========end for twitter=============//

//-----------spotify---------------//

function spotifyFunction(){

	var spotify = new Spotify(keys.spotify);
	var songArgument=process.argv.slice(3).join("%20");
	var params = {
		type: 'track',
		query: songArgument
	}

	var Path;

	if (songArgument === "")
	{
		params.query="The Sign Ace of Base";
		
	}


	spotify.search(params, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
for (var i=0; i < data.tracks.items.length ; i++) {

 Path = data.tracks.items[i]; 

 
console.log(`\nArtist: ${Path.artists[0].name}`);
console.log(`Name: ${Path.name}`);
console.log(`Spotify Preview URL: ${Path.preview_url}`);
console.log(`Album: ${Path.album.name}\n`);

}

});


}

//===============end for spotify==============//

//--------------do what you say-------------//

function choiceIsNotYours () {

 fs.readFile('random.txt', "utf8", function(err, data) {
    
    var commandArg = data.split(",");


//-----------beginning of switch statements. there must be a better way to do this but this also works------/
    switch (commandArg[0]) {
    	case "spotify-this-song":
    	var spotify = new Spotify(keys.spotify);
	var params = {
		type: 'track',
		query: commandArg[1]
	}

	var Path;

	spotify.search(params, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
for (var i=0; i < data.tracks.items.length ; i++) {

 Path = data.tracks.items[i]; 

 
console.log(`\nArtist: ${Path.artists[0].name}`);
console.log(`Name: ${Path.name}`);
console.log(`Spotify Preview URL: ${Path.preview_url}`);
console.log(`Album: ${Path.album.name}\n`);

}

});

    	break;

    	case "movie-this":

    	var movieArgument=commandArg[1];
	var omdbapiURL= `http://www.omdbapi.com/?apikey=trilogy&t=${movieArgument}&plot=short`;

	request(omdbapiURL, function(error, response, body) {

  if (!error && response.statusCode === 200) {

   
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);


  }
});

    	break; 

    	case "my-tweets":
    	twitterFunction();
    	break;
    }
//===========end of switch statements. there must be a better way to do this but this also works======/  

  });


}

//======================end for do what it says===============///