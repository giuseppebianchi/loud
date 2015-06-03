SC.initialize({
  client_id: '2aca68b7dc8b51ec1b20fda09b59bc9a',
  redirect_uri: 'http://giuseppebianchi.github.io/loud/index.html'
});

/*SC.get("/groups/55517/tracks", {limit: 1}, function(tracks){
  alert("Latest track: " + tracks[0].title);
});*/
$('#connect').click(function(){
	SC.connect(function() {
	  SC.get('/me/activities', function(me) { 
	    console.log(JSON.stringify(me, null, 4)); 
	  });
	});
});

var playingTrack;
var progressBar = $(".waveform-bar");
var progressBarEnd = $("#progress-bar-end");
var progressLoading = $(".waveform-loading");

/*SC.get("/tracks/6360030", function(track){
		//alert(track.title);
		$('.title').html(track.title);
		$('.artist').html(track.user.username);
		$('.artwork').attr('src', track.artwork_url.replace('large', 't500x500'));
		$('.waveform').attr('src', track.waveform_url);
		$('.blur').css('background-image', 'url(' + track.artwork_url.replace('large', 't500x500') + ')');
});
SC.stream("/tracks/6360030", {
	  autoPlay: true,
	  whileloading: null,   
	  whileplaying: null,
	  pan: 0, 
	  stream: true,
	  whileplaying: function(){
	  		progressBar.css("width", ((this.position/this.durationEstimate)*100) + '%');
	  		progressBarEnd.css("left", ((this.position/this.durationEstimate)*100) + '%');
			},
	  whileloading: function(){
	  		progressLoading.css('width', ((this.bytesLoaded/this.bytesTotal) * 100) + '%');
	  		//progressBar.css("width", ((this.position/this.durationEstimate)*100) + '%');
	  		}
	}, function(sound){
	playingTrack = sound;

});*/




$('#start').click(function(){
	if(playingTrack.paused){
		playingTrack.resume();
		$(this).html('<i class="fa fa-pause"></i>').addClass('btn-danger').removeClass('btn-primary');
	}else{
		playingTrack.pause();
		$(this).html('<i class="fa fa-play"></i>').addClass('btn-success').removeClass('btn-danger');
		
	}
});

$('.closePlayer').click(function(){
			$('#player').fadeOut("fast");
});
$('.openPlayer').click(function(){
			$('#player').fadeIn("fast");
});

SC.get("/users", {q: "tini"}, function(users){
	var box = $('.result');
	$.each(users, function(){

		box.append('<a class="user" id_sc='+this.id+'>' + this.username + ' - ' + this.id + '</a><br>');

	})

});

$('body').on("click", '.user', function(){

	var id_user = $(this).attr("id_sc");
	var sc_url = "/users/"+ id_user + "/tracks"
	SC.get(sc_url, function(tracks){
		$('.tracklist').empty();

			$.each(tracks, function(){
			$('.tracklist').prepend('<a class="track" id_track='+ this.id +'>' + this.title + ' - ' + this.id + '</a><br>');
			});

	});

});


$('body').on("click", '.track', function(){

	SC.get("/tracks/" + $(this).attr("id_track"), function(track){
		//alert(track.title);
		$('.title').html(track.title);
		$('.artist').html(track.user.username);
		$('.artwork').attr('src', track.artwork_url.replace('large', 't500x500'));
		$('.waveform').attr('src', track.waveform_url);
		$('.blur').css('background-image', 'url(' + track.artwork_url.replace('large', 't500x500') + ')');
	});

	if(playingTrack){
		SC.destroySound('playingTrack');
		alert("distrutto");
	}

	SC.stream("/tracks/" + $(this).attr("id_track"), {
	  autoPlay: true,
	  whileloading: null,   
	  whileplaying: null,
	  pan: 0, 
	  stream: true,
	  whileplaying: function(){
	  		progressBar.css("width", ((this.position/this.durationEstimate)*100) + '%');
	  		progressBarEnd.css("left", ((this.position/this.durationEstimate)*100) + '%');
			},
	  whileloading: function(){
	  		progressLoading.css('width', ((this.bytesLoaded/this.bytesTotal) * 100) + '%');
	  		//progressBar.css("width", ((this.position/this.durationEstimate)*100) + '%');
	  		}
	}, function(sound){
	playingTrack = sound;
	alert("stream");
	});

});




