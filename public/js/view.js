

(function(file) {
	if (!file) {
		return;
	}

	var player = $("#player")[0];
	var video = new File(file.id, file.frames, player);

	$("#file-player").toggleClass("image", video.isImage);

	var pauseButton = $("#player-pause");
	var playButton = $("#player-play");
	var restartButton = $("#player-restart");

	pauseButton.click(function() {
		video.pause();
		playButton.show();
		pauseButton.hide();
	});

	playButton.click(function() {
		video.play(video.currentFrame);
		playButton.hide();
		pauseButton.show();
	});

	restartButton.click(function() {
		video.stop();
		//video.play();
	});

	playButton.click();

	$("#timeshift").attr("max", video.getLength());
	$("#timeshift").on("change", function(e) {
		video.pause();
		video.setFrame($(this).val());
	});
	video.ontick = function() {
		$("#timeshift").val(video.currentFrame);
	};




	$('.share').html(generateShareLinks("http://comorichweb.nko3.jit.su/view/"+file.lookup, "Check out the sweet asciigram I created!!"));
})(window.LOADEDFILE);

