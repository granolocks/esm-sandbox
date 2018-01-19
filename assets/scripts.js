$(document).ready(function(e) {
    $('.open-link').click(function(e) {
       var $wrapper = $(this).parent().find('.hider');
	   $wrapper.css('max-height',$wrapper.find('p').height());
       $(this).remove();
    })
});