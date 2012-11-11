function generateShareLinks(linkToShare, title){ 
linkToShare = encodeURIComponent(linkToShare || '');
title = encodeURIComponent(title || '');

var shareLinks = [];
	shareLinks.push ("<a href='http://facebook.com/sharer.php?u=" + linkToShare + "&t=" + title + "' target='_blank'><span border='0' class='sprite facebook png tip' title='Post on facebook'alt='Facebook' /></a>");

	shareLinks.push ("<a href='http://twitter.com/?status=" + title + "%20%23asciigram%20-%20" + linkToShare + "' target='_blank'><span border='0' class='sprite twitter png tip' title='Tweet's alt='Twitter' /></a>");

	shareLinks.push ("<a href='http://pinterest.com/pin/create/button/?url=" + linkToShare+ "&media=http://comorichweb.nko3.jit.su/logo.png&description=" + title + "' target='_blank'><span border='0' class='sprite pinterest png tip' title='Pin' alt='Twitter' /></a>");

return shareLinks.join("");
}
