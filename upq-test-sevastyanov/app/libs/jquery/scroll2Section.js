/** ==================================================
 * scroll2section 1.0
 * Licensed GPLv3 for open source use
 * example:
 * $(selector).scroll2Section({options});
 * selector can be one or more elements
 * options: 
 *          menu: #menu,               //selector of menu [unique selector]
 *          offSetTop:0,              // page offset top
 *          activeClass:'active',     // class to active menu link
 *          activeParent:'li'         // parent closest of menu link
 ==================================================*/

 (function ( $ ) {
    var scroll2Section = function(el,options){
        var smallScreen = (window.matchMedia('(max-width: 767px)').matches);
        var is_mobile   = (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent));
        var $el         = $(el), data = $el.data();
        

        //scroll to section
        var $window             = $(window);
        var $section            = $(el);
        var scrollParent        = options.scrollParent || 'html,body';
        var offSetTop           = options.offsetTop || 0;
        var changeHash          = true;
        var $menu               = $(options.menu),
            $menuItem           = $menu.find("a[data-section]");
        var menuItems           = [];
        var locked              = false;

        var currentHash         = null;
        var scrollPos           = $(document).scrollTop();
        var tempScrollTop,
            currentScrollTop    = $window.scrollTop();
        //if body has navfix class, the scroll will check the 
        var useAffix           = options.useAffix || false;
        
        //push menu items to array for section controller
        $menuItem.each(function(){
            var $item   = $(this);
            var href    = $item.attr('href').toString().str2Hash().clearHash();
            menuItems.push(href);
            

            $item.click(function(e){
                
                changeHash  = false;
                
                var $this   = $(this),
                id      = $this.attr("href").str2Hash().clearHash();
                
                if(!id) return true;
                $this.closest(options.activeParent).addClass(options.activeClass);
                scrollToAnchor(id);
                e.preventDefault();
                return false;
            });


        });

        function inMenuItems(item){
            return (menuItems.indexOf(item)!=-1);
        }
       
                
        $section.each(function () {
            var $self                   = $(this);
            $window.scroll(function () {
                var offsetCoords        = $self.offset(),
                    sectionOffsetTop    = offsetCoords.top;
                    if(useAffix){
                        offSetTop = $menu.outerHeight();
                    }
                if (locked === false && (($window.scrollTop() + offSetTop) >= $self.offset().top) && (($self.offset().top + $self.height() - offSetTop) > $window.scrollTop()) && changeHash) {
                    var id          = $self.attr('id');
                    var inMenu      = inMenuItems(id);
                    if(!id.length || currentHash === "#!" + id || !inMenu) return true;
                    currentHash     = "#!" + id;
                    $(scrollParent).trigger('visibleSection',id);
                    activateMenuItem(id);
                    if (window.history && window.history.pushState) {
                        history.pushState("", document.title, currentHash);
                    }
                }
            });
        });

        function activateMenuItem(id){
            var active = $menuItem.filter("[href$='#!" + id  + "']");
            $menuItem.not(active).closest(options.activeParent).removeClass(options.activeClass);
            active.closest(options.activeParent).addClass(options.activeClass);
            $menu.trigger('update',active);
            changeHash  = true;
            locked      = false;
        }

        function scrollToAnchor(id){
            var sl              = 1;
            var $target         = $("#"+id);
            if($target.length > 0 && locked === false) {
                locked          = true;
                var dp          = $target.attr('data-padding') || 0;
                var dm          = $target.offset().top - parseInt(dp) - offSetTop;
                changeHash      = false;
                $('body').addClass('scrolling');
                // trigger scroll
                $(scrollParent).stop().animate({
                    'scrollTop': dm
                }, options.duration, function () {
                    var hash = "#!"  + id;
                    $('body').removeClass('scrolling');
                    if(sl === $(scrollParent).length){
                        setTimeout(function(){
                            activateMenuItem(id);
                        },100);
                    }
                    if (window.history && window.history.pushState) {
                        history.pushState("", document.title, hash);
                    }
                    sl++;
                });
            }
        }

        if(window.location.hash){
            currentHash = window.location.hash.clearHash();
            var menuItemActive = $menuItem.filter("[href$='#!" + currentHash  + "']");
            if(menuItemActive.length==1) menuItemActive.trigger('click');
            changeHash = false;
        }

        //check mobile and use default iframe and remove autoplay options if instantiated
     
       
        return $menu;
    };

    String.prototype.clearHash = function(str){
        return this.replace("#!",'');
    };

    String.prototype.str2Hash = function(str){
        var s = this.indexOf("#!");
        if(s ==-1 ) return this;
        var l = this.length;
        return this.slice(s, l); 
    };

    /**
     * @example 
     * $(section)
     * 
     * @param   {Object} [opcional]    Opcional
     * @returns {Number}
     */
    $.fn.scroll2Section = function(options) {
        options = $.extend( {}, $.fn.scroll2Section.options, options );
        if($(this).hasClass('loaded')) return this;
        return new scroll2Section(this,options);
        
    };
    $.fn.scroll2Section.options = {menu:"#menu",offSetTop:0,activeClass:'active',activeParent:'li',duration:1000};
    

}( jQuery ));