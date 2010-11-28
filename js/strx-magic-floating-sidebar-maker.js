//console.log('strx-floating-sidebar/js/main.js loaded ok');

strx={};
if (typeof console==='undefined'){
	console={log:function(){}, dir:function(){}};
}

(function($){
    strx.start=function(opts){
        $(function(){
            opts=$.extend({}, {content:'#content', sidebar:'#sidebar', wait:3000, debounce:500, animate:3000, offsetTop:0, offsetBottom:0, debug:0, outline:0, findids:0}, opts);
            var $w=$(window), $c=$(opts.content), $ss=$(opts.sidebar), $b=$('body');

            if (opts.outline){
                $ss.add($c).css('outline','3px dashed  red');
            }

			if (opts.findids){
				strx.findids();
			}

			console.dir(opts);

			if ($c.length && $ss.length){
				$ss.each(function(){
					(function($s){
						if ($c.height() > $s.height()){
							setTimeout(function(){
								$s.parent().css('position','relative');
								$s.css({position:'absolute',left:$s.position().left+'px',top:$s.position().top+'px'})
									.find('.widget').css('position','relative');

								var lastScrollY=-1,
									sidebarTop=$s.position().top,
									offsetTop=$s.offset().top-sidebarTop,
									maxTop=sidebarTop+$c.height()-$s.outerHeight(),
									onScroll=function(e){
										var scrollY=$w.scrollTop(), t,
											scrollingDown=scrollY>lastScrollY;

										if ((scrollingDown && scrollY>sidebarTop+offsetTop && scrollY+$w.height()>$s.position().top+$s.height()+offsetTop-sidebarTop) ||
											(!scrollingDown && scrollY<$s.position().top+offsetTop) ){
											if (e.type==='scroll' && ($w.height()>$s.height() || !scrollingDown)){
												//Scorrimento verso l'alto
												t=Math.max(sidebarTop,scrollY-(offsetTop)+ (~~opts.offsetTop) );
											}else{
												//Scorrimento verso il basso o resize
												t=Math.max(sidebarTop, scrollY + $w.height() - $s.outerHeight() - offsetTop - (~~opts.offsetBottom) );
											}
											//console.log('scroll top='+t);
											t=Math.min(t, maxTop);
											$s.stop().animate({top:t+'px'}, ~~opts.animate);

											if (opts.debug){
												window.scrollY=scrollY;
												console.log('top='+t+', scrollY='+scrollY);
											}
										}
										lastScrollY=scrollY;
									};
								if (opts.debug){
									window.$w=$w; window.$c=$c; window.$s=$s; window.$b=$b; window.offsetTop=offsetTop; window.sidebarTop=sidebarTop; window.maxTop=maxTop;
									console.log('windowHeight='+$w.height()+', sidebarOuterHeight='+$s.outerHeight()+', sidebarTop='+sidebarTop+', offsetTop='+offsetTop+', maxTop='+maxTop);
								}

								if (opts.debounce && Function.prototype.debounce){
									onScroll=onScroll.debounce(opts.debounce);
								}

								$w.scroll(onScroll).resize(onScroll);
								onScroll({type:'scroll'});
							},opts.wait);
						}
					})($(this));
				});

			}else{
				if ($c.length===0){console.log(opts.content+' not found');}
				if ($s.length===0){console.log(opts.sidebar+' not found');}
			}

        });
    };
	//Help user find the correct content and sidebar divs
	strx.findids=function(){
		var divs=$('div[id]').get();
		divs=$.map(divs, function(d){
			return '<span class="strx-mfsm-findids" style="cursor:pointer; font-weight:bold;">'+d.id+'</span>';
		});
		var $divs=$('<span>'+divs.join('&nbsp;&nbsp;')+'</span>').appendTo('body').click(function(e){
			var $t=$('#'+$(e.target).html());
			//console.log($t.html());

			var origbg=$t.css('background-color');
			$t.css({backgroundColor:'red'});
			setTimeout(function(){$t.css({backgroundColor:'green'});}, 3000);
			setTimeout(function(){$t.css({backgroundColor:'blue'});}, 6000);
			setTimeout(function(){$t.css({backgroundColor:origbg});}, 9000);

			alert(
				'If the main content background color change, write \n#'+$(e.target).html()+'\n in the Content Selector field'+
				'\n\n'+
				'If the sidebar background color change, write \n#'+$(e.target).html()+'\n in the Sidebar Selector field'
			);

		});
	};
})(jQuery);
