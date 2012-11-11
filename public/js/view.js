

(function(file) {
	if (!file) {
		return;
	}

	var player = $("#player")[0];
	var video = new File(file.id, file.frames, player);

	var preview = new FilePlayer(video, player, function(filePlayer) {

		$("#file-player").toggleClass("image", filePlayer.isImage);

		var pauseButton = $("#player-pause");
		var playButton = $("#player-play");
		var restartButton = $("#player-restart");

		pauseButton.click(function() {
			filePlayer.pause();
			playButton.show();
			pauseButton.hide();
		});

		playButton.click(function() {
			filePlayer.play(filePlayer.currentFrame);
			playButton.hide();
			pauseButton.show();
		});

		restartButton.click(function() {
			filePlayer.stop();
		});

		playButton.click();

		$("#timeshift").attr("max", filePlayer.getLength());
		$("#timeshift").on("change", function(e) {
			filePlayer.pause();
			filePlayer.setFrame($(this).val());
		});

		filePlayer.ontick = function() {
			$("#timeshift").val(filePlayer.currentFrame);
		};

	});





	$('.share').html(generateShareLinks("http://comorichweb.nko3.jit.su/view/"+file.lookup, "Check out the sweet asciigram I created!!"));
})(window.LOADEDFILE);

