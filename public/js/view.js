
var FilePlayerView = {
	_filePlayer: null,
	init: function(filePlayer) {


		var pauseButton = $("#player-pause");
		var playButton = this.playButton = $("#player-play");
		var restartButton = $("#player-restart");
		var that = this;
		var getFilePlayer = _.bind(this.getFilePlayer, this);

		pauseButton.click(function() {

			var filePlayer = getFilePlayer();

			filePlayer.pause();
			playButton.show();
			pauseButton.hide();
		});

		playButton.click(function() {

			var filePlayer = getFilePlayer();
			log(filePlayer);
			filePlayer.play(filePlayer.currentFrame);
			playButton.hide();
			pauseButton.show();
		});

		restartButton.click(function() {

			var filePlayer = getFilePlayer();

			filePlayer.stop();
		});

		playButton.click();

		$("#timeshift").on("change", function(e) {

			var filePlayer = getFilePlayer();

			filePlayer.pause();
			filePlayer.setFrame($(this).val());
		});


		if (filePlayer) {
			this.setFilePlayer(filePlayer);
		}

	},
	getFilePlayer: function() {
		return this._filePlayer || {
			play: function() {},
			pause: function() {},
			stop: function() {},
			getLength: function() {return 0;},
			setFrame: function() { },
			currentFrame: 0
		};
	},
	setFilePlayer: function(filePlayer) {
		this._filePlayer = filePlayer;
		log("here", filePlayer);
		var player = this.getFilePlayer();

		$("#file-player").toggleClass("image", player.isImage);
		$("#timeshift").attr("max", player.getLength());

		filePlayer.ontick = function() {
			$("#timeshift").val(player.currentFrame);
		};

		this.playButton.click();
	}
};

(function(file) {

	if (!file) {
		return;
	}

	var player = $("#player")[0];
	var fileObj = new File(file.id, file.frames, player);
	new FilePlayer(fileObj, player, function(filePlayer) {
		FilePlayerView.init(filePlayer);
		filePlayer.play();
	});

	$('.share').html(generateShareLinks("http://comorichweb.nko3.jit.su/view/"+file.lookup, "Check out the sweet asciigram I created!!"));

})(window.LOADEDFILE);

