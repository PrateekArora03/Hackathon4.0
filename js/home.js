$(function () {
    $('.flexslider').flexslider({
        animation: 'fade',
        controlsContainer: '.flexslider'
    });

	var ctrl_content_menu = function(){
		var fn = $(this).data('fn'), div_id = $(this).data('div_id');
		switch(fn){
			case 'next':
			case 'prev':
				var children = $('#'+div_id).children(), show_who = false;
				for(var i = 0; i < children.length-1; i++){
					if($(children[i]).is(':visible')){
						if(fn == 'next'){
							if(i == children.length-2){
								show_who = children[0];
							}else{
								show_who = children[i+1];
							}
						}else if(fn == 'prev'){
							if(i == 0){
								show_who = children[children.length-2];
							}else{
								show_who = children[i-1];
							}
						}
						if(show_who !== false){
							if(div_id == 'xssm_content'){
								$(show_who).slideDown(1000);
								$(children[i]).slideUp(1000);
							}else{
								$(show_who).show();
								$(children[i]).hide();
							}
						}
							
						break;
					}
				}
				break;
			case 'close':
				$('#'+div_id).toggle();
				$('#'+div_id+"_hide").toggle();
				break;
		}
	},
	theme_hilight_click = function(){
		var code = $(this).data('code');
		$('#thonly .menu li').removeClass("current");
		$(this).addClass('current');
		$('#thonly .menu-icon img').hide();
		$('#thonly_icon_'+code).show();
		$('#thonly .thonlylist').hide();
		$('#thonly_content_'+code).show();
	},
	theme_hilight_text_toggle = function(){
		$(this).parent().siblings(".text").toggleClass("active");
		$(this).children("i").toggleClass("fa-close").toggleClass("fa-plus");
	},
	destination_change = function(){
		var code = $(this).data('code');
		$('#thailand_destination .thailandmap').attr('class', 'thailandmap').addClass(code);
		$('#thailand_destination .container.background').attr('class', 'container').addClass('background').addClass(code);
		
		$('#thailand_destination .thailandmap button').removeClass('current');
		$('#thailand_destination .thailandmap button.'+code).addClass('current');
		$('#thailand_destination .wrap-region').hide();
		$('#thailand_destination .wrap-region.region-'+code).show();
		$('#thailand_destination .wrap-region-menu li').removeClass('current');
		$('#thailand_dest_'+code).addClass('current');
	};

	$('#hero_content').children().hide();
	$('#hero_content div:nth-child(1)').show();
	$('#hero_content .super-btn').show();
	$('#hero_content .super-btn .btn-infotoggle div').data('div_id', 'hero_content').click(ctrl_content_menu);
	$('#hero_content .super-btn .x').data('fn', 'close');
	$('#hero_content .super-btn .next').data('fn', 'next');
	$('#hero_content .super-btn .prev').data('fn', 'prev');
	$('#hero_content_hide .super-btn .btn-infotoggle div').data('div_id', 'hero_content').click(ctrl_content_menu);
	$('#hero_content_hide .super-btn .x').data('fn', 'close');
	$('#xssm_content').children().hide();
	$('#xssm_content div:nth-child(1)').show();
	$('#xssm_content .btnbox-xssm').show();
	$('#xssm_content .btnbox-xssm button').data('div_id', 'xssm_content').click(ctrl_content_menu);
	$('#xssm_content .btnbox-xssm .btn-right button').data('fn', 'next');
	$('#xssm_content .btnbox-xssm .btn-left button').data('fn', 'prev');
	
	$('#thonly .menu li').click(theme_hilight_click);
	$('#thonly .x').click(theme_hilight_text_toggle);
	
	$('#thailand_destination .thailandmap button').click(destination_change);
	$('#thailand_destination .wrap-region-menu li').click(destination_change);
});