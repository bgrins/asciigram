
function Frame(obj) {
	this.content = obj.content.replace(/&nbsp;/g, " ").replace(/<br>/g, "\n");
	window.tmpcontent = this.content;
	this.timestamp = new Date(obj.timestamp);
}

function Video(file) {
	this.timeout = false;
	var frames = _.map(file.frames, function(frame) {
		return new Frame(frame);
	});	

	this.frames = _.sortBy(frames, function(f) { 
		return f.timestamp;
	});
}

Video.prototype.play = function(player) {
	var vid = this;
	showFrame(this.frames[0]);
	
	function showFrame(frame) {
		player.textContent = frame.content;
		var idx = _.indexOf(vid.frames, frame) + 1;
		if (idx > vid.frames.length - 1) {
			return;
		}

		var nextFrame = vid.frames[idx];
		vid.timeout = setTimeout(function() {
			showFrame(nextFrame)
		}, frame.timestamp - nextFrame.timestamp)
	}
};

Video.prototype.stop = function() {
	clearTimeout(this.timeout);
};

// get the x/y resolution of the first frame
Video.prototype.getResolution = function() {
	var frame = this.frames[0];
	var line


};

(function(file) {
	if (!file) {
		return;
	}

	var video = new Video(file);
	var player = document.getElementById("player");
	video.play(player);
})(window.LOADEDFILE);
