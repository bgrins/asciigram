
function Frame(obj) {
	this.content = obj.content.replace(/&nbsp;/g, " ").replace(/<br>/g, "\n");
	this.timestamp = new Date(obj.timestamp);
}

(function(file) {

	if (!file) {
		return;
	}

	$('.view-count').html('Number of views: '+file.numberOfViews);

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
	}

})(window.LOADEDFILE);
