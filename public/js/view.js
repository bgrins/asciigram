

(function(file) {
	if (!file) {
		return;
	}

	var player = $("#player")[0];
	var video = new File(file.id, file.frames, player);

	var preview = new FilePreview(video, player, function(preview) {

		$("#file-player").toggleClass("image", preview.isImage);

		var pauseButton = $("#player-pause");
		var playButton = $("#player-play");
		var restartButton = $("#player-restart");

		pauseButton.click(function() {
			preview.pause();
			playButton.show();
			pauseButton.hide();
		});

		playButton.click(function() {
			preview.play(preview.currentFrame);
			playButton.hide();
			pauseButton.show();
		});

		restartButton.click(function() {
			preview.stop();
			//preview.play();
		});

		playButton.click();

		$("#timeshift").attr("max", preview.getLength());
		$("#timeshift").on("change", function(e) {
			preview.pause();
			preview.setFrame($(this).val());
		});

		preview.ontick = function() {
			$("#timeshift").val(preview.currentFrame);
		};

	});





	$('.share').html(generateShareLinks("http://comorichweb.nko3.jit.su/view/"+file.lookup, "Check out the sweet asciigram I created!!"));
})(window.LOADEDFILE);

