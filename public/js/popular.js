(function(files) {
	$(document).on('click', '.popular-preview a.post', function(e){
		var lookup = $(this).closest('.popular-preview').data('id');
		var url = $(this).data('url');
		$.post(url+lookup);
		return false;
	});
})();
