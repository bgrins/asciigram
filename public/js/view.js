
function Frame(obj) {
	this.content = obj.content.replace(/&nbsp;/g, " ").replace(/<br>/g, "\n");
	window.tmpcontent = this.content;
	this.timestamp = new Date(obj.timestamp).getTime();
	this.date = new Date(this.timestamp);
}

function Video(file, player) {
	this.playing = false;
	this.player = player || document.createElement("pre");
	var frames = _.map(file.frames, function(frame) {
		return new Frame(frame);
	});

	this.frames = _.sortBy(frames, function(f) {
		return f.date;
	});


	this.isImage = this.frames.length === 1;
}

Video.prototype.play = function(startFrame) {

	var player = this.player;
	if (this.isImage) {
		player.textContent = this.frames[0].content;
		return;
	}

	if (this.playing) {
		return;
	}

	this.playing = true;

	var vid = this;
	var REFRESH_RATE = 50;
	var speed = 1;

	startFrame = Math.min(this.frames.length - 1, Math.max(startFrame, 0)) || 0;
	var startTime = (new Date()).getTime();
	var currentTime = startTime - this.frames[startFrame].timestamp;
	var currentTimeOffset = startTime - this.frames[0].timestamp;
	var timeShift = currentTimeOffset - currentTime;


	vid.ticks = startFrame;

	var frames = this.frames;

	function findFrame(time) {

		time = time;
		for (var i = 0; i < frames.length; i++) {

			//log(frames[i].timestamp, time);
			if (frames[i].timestamp > time) {
				return {
					frame: frames[i],
					index: i,
					last: i === frames.length - 1
				};
			}
		}
	}

	function play() {

		// If it has been stopped, bail out.
		if (!vid.playing) {
			return;
		}

		currentTime = (new Date()).getTime() - currentTimeOffset;

		var currentFrame = findFrame(currentTime);

		// Finished the video... stop it
		if (!currentFrame) {
			vid.stop();
			return;
		}

		var currentContent = currentFrame.frame.content;

		vid.playing = true;
		vid.ticks++;
		$("#num-ticks").text(vid.ticks);

		vid.setFrame(currentFrame.index);

		if (currentFrame.last) {
			vid.stop();
		}
		else {
			setTimeout(play, REFRESH_RATE);
		}
	}

	play();

	/*
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
	*/
};

Video.prototype.setFrame = function(i) {

	var index = Math.min(this.frames.length - 1, Math.max(i, 0)) || 0;
	var frame = this.frames[index];

	log(index, frame);
	if (frame) {

		this.currentFrame = index;
		this.player.textContent = frame.content;
	}
};

Video.prototype.pause = function() {
	this.playing = false;
};
Video.prototype.stop = function() {
	this.ticks = 0;
	this.currentFrame = 0;
	this.setFrame(0);
	this.playing = false;
};

// get the x/y resolution of the first frame
Video.prototype.getResolution = function() {
	var frame = this.frames[0];
	var lines = frames.split("/n");
	return [ lines[0].length, lines.length ];
};

(function(file) {
	if (!file) {
		return;
	}

	var player = $("#player")[0];
	var video = new Video(file, player);
	video.play();

	$("#file-player").toggleClass("image", video.isImage);

	$("#player-pause").click(function() {
		video.pause();
	});
	$("#player-play").click(function() {
		video.play(video.currentFrame);
	});
	$("#player-restart").click(function() {
		video.stop();
		//video.play();
	});

	$('.share').html(generateShareLinks("http://comorichweb.nko3.jit.su/view/"+file.lookup, "Check out the sweet asciigram I created!!"));
})(window.LOADEDFILE);

