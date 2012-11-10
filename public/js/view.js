(function(file) {
	if (!file) {
		return;
	}

	function Frame(obj) {
		this.content = obj.content;
		this.timestamp = new Date(obj.timestamp);
	}

	var frames = _.map(file.frames, function(frame) {
		return new Frame(frame);
	});

	var start = _.min(_.map(frames, function(frame) {
		return frame.timestamp.getTime();
	}));

	frames = _.sortBy(frames, function(f) {
		return f.timestamp;
	});

	var player = document.getElementById("player");
	start();

	function start() {
		showFrame(frames[0]);
	}

	function showFrame(frame) {
		player.textContent = curFrame.content;
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