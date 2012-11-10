(function(files) {

	if (!files) {
		return;
	}

	var popularHtml = ""; 

	for (var i=0; i< files.length; i++){ 
		popularHtml += "<div class='popular-preview'>"+"<pre>"+files[i].frames[0].content+"</pre></div>";
	}

	$('.popular-container').html(popularHtml);

/*	$('.share').html('Number of views: '+afile.numberOfViews);

	var frames = _.map(file.frames, function(frame) {
		return new Frame(frame);
	});

	log(frames.length);

	frames = _.sortBy(frames, function(f) {
		return f.timestamp;
	});

	var player = document.getElementById("player");
	start();

	function start() {
		showFrame(frames[0]);
	}

	function showFrame(frame) {
		player.textContent = frame.content;
		var idx = _.indexOf(frames, frame) + 1;
		if (idx > frames.length - 1) {
			return;
		}
		var nextFrame = frames[idx];
		setTimeout(function() {
			showFrame(nextFrame)
		}, frame.timestamp - nextFrame.timestamp)
	}

	function stop() {
		clearInterval(timeout);
	}*/

})(window.LOADPOPULAR);
