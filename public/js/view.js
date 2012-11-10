(function(file) {
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

	var player = document.getElementById("player");
	_.each(frames, function(f) {
		setTimeout(function() {
			player.textContent = f.content;
		}, f.timestamp - start);
	});
})(window.LOADEDFILE);