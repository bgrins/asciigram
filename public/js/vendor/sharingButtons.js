function generateShareLinks(linkToShare, title){ 
linkToShare = encodeURIComponent(linkToShare || '');
title = encodeURIComponent(title || '');

var shareLinks = [];
	shareLinks.push ("<a href='http://facebook.com/sharer.php?u=" + linkToShare + "&t=" + title + "' target='_blank'><img src='img/social-icons/facebook.png' border='0' class='png tip' title='Post on facebook'style='margin:0 4px; 0 4px;' alt='Facebook' /></a>");

	shareLinks.push ("<a href='http://twitter.com/?status=" + title + "%20-%20" + linkToShare + "' target='_blank'><img src='img/social-icons/twitter.png' border='0' class='png tip' title='Tweet' style='margin:0 4px; 0 4px;' alt='Twitter' /></a>");

	shareLinks.push ("<a href='http://pinterest.com/pin/create/button/?url=" + linkToShare+ "&media=http://www.addthis.com/cms-content/images/features/pinterest-lg.png&description=" + title + "' target='_blank'><img src='img/social-icons/pinterest.png' border='0' class='png tip' title='Pin' style='margin:0 4px; 0 4px;' alt='Twitter' /></a>");

return shareLinks.join("");
}
