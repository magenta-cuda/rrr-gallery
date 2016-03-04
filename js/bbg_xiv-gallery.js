// Backbone.js Model View Presenter for the 'gallery' shortcode

(function(){
    var bbg_xiv=window.bbg_xiv=window.bbg_xiv||{};
    bbg_xiv.helpUrl="https://bbfgallery.wordpress.com/#options";
    // use WordPress templating syntax; see .../wp-includes/js/wp-util.js
    bbg_xiv.templateOptions={
        evaluate:    /<#([\s\S]+?)#>/g,
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
        escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
        variable:    'data'
    };
    
    bbg_xiv.images={};
    bbg_xiv.search={};   // for multi part search results
    
    bbg_xiv.Image=Backbone.Model.extend({idAttribute:"ID"});
    
    bbg_xiv.Images=Backbone.Collection.extend({model:bbg_xiv.Image});
    
    bbg_xiv.ImageView=Backbone.View.extend({
        render:function(srcOnly){
            var html=this.template(this.model.attributes);
            if(srcOnly){
                return html;
            }
            this.$el.html(html);
            return this;
        }    
    });
    
    bbg_xiv.GalleryView=Backbone.View.extend({
        render:function(){
            var html=this.template(this.model.attributes);
            this.$el.html(html);
            return this;
        }
    });
    
    bbg_xiv.renderBootstrapGallery=function(container,collection){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_gallery_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function(model,index){
            imageView.model=model;
            imagesHtml+=imageView.render(true);
            // Bootstrap's grid needs "clear" elements to correctly align non-uniformly sized items
            if(index%4===3){
                imagesHtml+='<br class="clearfix visible-lg-block">';
            }
            if(index%3===2){
                imagesHtml+='<br class="clearfix visible-md-block">';
            }
            if(index%2===1){
                imagesHtml+='<br class="clearfix visible-sm-block">';
            }
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_gallery_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.container"));
    }

    bbg_xiv.renderFlex=function(container,collection){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_flex_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function(model,index){
            imageView.model=model;
            imagesHtml+=imageView.render(true);
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:collection.id,
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_flex_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-flex_container"));
        if(bbg_xiv.interface==="touch"){
            container.find("div.bbg_xiv-flex_container div.bbg_xiv-flex_item div.bbg_xiv-dense_full_btn").css({color:"gray",borderColor:"gray"});
        }
    }
 
    bbg_xiv.renderCarousel = function( container, collection, id ) {
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_carousel_item").html(),null,bbg_xiv.templateOptions);
        var bulletsHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.index=index;
            imageView.model=model;
            var active=index ===0?' class="active"':'';
            bulletsHtml+='<li data-target="#'+id+'" data-slide-to="'+index+'"'+active+'></li>';
            imagesHtml+=imageView.render(true);
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:id,
                    bullets:bulletsHtml,
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_carousel_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find( "div.carousel.slide"));
    }

    bbg_xiv.renderTabs=function(container,collection,id){
        var tabView=new bbg_xiv.ImageView();
        tabView.template=_.template(jQuery("script#bbg_xiv-template_tabs_tab").html(),null,bbg_xiv.templateOptions);
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_tabs_item").html(),null,bbg_xiv.templateOptions);
        var tabsHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.index=index;
            imageView.model=tabView.model=model;
            tabsHtml+=tabView.render(true);
            imagesHtml+=imageView.render(true);
        });
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:id,
                    tabs:tabsHtml,
                    items:imagesHtml
                }
            }
        });
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_tabs_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-template_tabs_container"));
    }

    bbg_xiv.renderDense=function(container,collection,id,mode){
        var titleView=new bbg_xiv.ImageView();
        titleView.template=_.template(jQuery("script#bbg_xiv-template_dense_title").html(),null,bbg_xiv.templateOptions);
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_dense_image").html(),null,bbg_xiv.templateOptions);
        var titlesHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.mode=mode;
            model.attributes.index=index;
            imageView.model=titleView.model=model;
            titlesHtml+=titleView.render(true);
            imagesHtml+=imageView.render(true);
        });
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:id,
                    gallery:collection.id,
                    mode:mode,
                    titles:titlesHtml,
                    images:imagesHtml
                }
            }
        });
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_dense_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-dense_container"));
    }
    
    // renderGeneric() may work unmodified with your template.
    // Otherwise you can use it as a base for a render function specific to your template.
    // See renderGallery(), renderCarousel() or renderTabs() - all of which need some special HTML to work correctly.

    bbg_xiv.renderGeneric=function(container,collection,template){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_"+template+"_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function(model,index){
            imageView.model=model;
            imagesHtml+=imageView.render(true);
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_"+template+"_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("bbg_xiv-container"));
    }

    // debugging utilities
    
    // dumpFieldNames() dumps field names as <th> elements in a <tr> element
    var fieldNames=[];
    bbg_xiv.dumpFieldNames=function(collection){
        collection.forEach(function(model){
            Object.keys(model.attributes).forEach(function(key){
                if(fieldNames.indexOf(key)===-1){
                    fieldNames.push(key);
                }
            });
        });
        var buffer="<tr>";
        fieldNames.forEach(function(name){
            buffer+="<th>"+name+"</th>";
        });
        buffer+="</tr>";
        return buffer;
    };
    
    // dumpFieldValues() dumps field values as <td> elements in <tr> elements
    bbg_xiv.dumpFieldValues=function(collection){
        var buffer="";
        collection.forEach(function(model){
            buffer+="<tr>";
            fieldNames.forEach(function(name){
                buffer+="<td>"+model.attributes[name]+"</td>";
            });
            buffer+="</tr>";
        });
        return buffer;        
    };
    
    bbg_xiv.renderTable=function(container,collection){
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    collection:collection
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_table_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-table"));
    };
    
    bbg_xiv.constructImages=function(gallery){
        var images=bbg_xiv.images[gallery.id]=new bbg_xiv.Images();
        images.id=gallery.id;
        try{
            images.reset(JSON.parse(window.bbg_xiv[gallery.id+"-data"]));
            // find closest match for thumbnail, small, medium and large
            var widths=[Math.log(bbg_xiv.bbg_xiv_flex_min_width),Math.log(768),Math.log(992),Math.log(1200)];
            images.models.forEach(function(model){
                var diffs=[Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE];
                var urls=[];
                var attributes=model.attributes;
                var sizes=attributes.sizes;
                sizes.full={url:attributes.url,width:attributes.width,height:attributes.height};
                Object.keys(sizes).forEach(function(size){
                    var image=sizes[size];
                    widths.forEach(function(width,i){
                        var diff=Math.abs(Math.log(image.width)-width);
                        if(diff<diffs[i]){
                            diffs[i]=diff;
                            urls[i]=image.url;
                        }
                    });
                });
                model.attributes.bbg_xiv_thumbnail_url=urls[0];
                model.attributes.bbg_xiv_small_url=urls[1];
                model.attributes.bbg_xiv_medium_url=urls[2];
                model.attributes.bbg_xiv_large_url=urls[3];
            });
        }catch(e){
            console.log("reset(JSON.parse()) failed:",e);
        }
        return images;
    };
    
    bbg_xiv.renderGallery=function(gallery,view){
        var jqGallery=jQuery(gallery);
        var images=bbg_xiv.images[gallery.id];
        if(!images){
            images=bbg_xiv.constructImages(gallery);
        }
        function constructOverlay(){
            // gallery or dense view shows a full browser viewport view of an image when its fullscreen glyph is clicked
            var outer=jqGallery.find("div.bbg_xiv-dense_outer");
            var inner=jqGallery.find("div.bbg_xiv-dense_inner").click(function(e){
                // fade out and hide overlay
                inner.css("opacity","0.0");
                outer.css("opacity","0.0");
                window.setTimeout(function(){
                    inner.hide();
                    outer.hide();
                },2000);
            });
            var fullImg=inner.find("img");
            var fullLarge=inner.find("source[media='(min-width:1200px)']");
            var fullMedium=inner.find("source[media='(min-width:992px)']");
            var fullSmall=inner.find("source[media='(max-width:991px)']");
            var fullTitle=inner.find("h1.bbg_xiv-dense_title");
            var fullTitleColor=fullTitle.css("color");
            var fullTitleShadow=fullTitle.css("text-shadow");
            var fullCaption=inner.find("h1.bbg_xiv-dense_caption");
            var fullCaptionColor=fullCaption.css("color");
            var fullCaptionShadow=fullCaption.css("text-shadow");
            if(bbg_xiv.interface==="touch"){
                // force hover effects on touchscreen
                fullTitle.css({color:fullTitleColor,textShadow:fullTitleShadow});
                fullCaption.css({color:fullCaptionColor,textShadow:fullCaptionShadow});
            }else{
                // only show title on mouseover
                fullImg.hover(
                    function(){
                        fullTitle.css({color:fullTitleColor,textShadow:fullTitleShadow});
                        fullCaption.css({color:fullCaptionColor,textShadow:fullCaptionShadow});
                    },
                    function(){
                        fullTitle.css({color:"transparent",textShadow:"none"});
                        fullCaption.css({color:"transparent",textShadow:"none"});
                    }
                );
            }
            jqGallery.find("button.bbg_xiv-dense_full_btn").click(function(e){
                var jqThis=jQuery(this);
                // the buttons are of three different types so the associated image is found differently depending on the type
                if(jqThis.hasClass("bbg_xiv-dense_from_image")){
                    var img=jQuery(this).parents("div.bbg_xiv-dense_flex_item").find("img")[0];
                }else if(jqThis.hasClass("bbg_xiv-dense_from_title")){
                    var img=jQuery("div#"+this.parentNode.id.replace("title","image")).find("img")[0];
                }else if(jqThis.hasClass("bbg_xiv-flex_from_image")){
                    var img=jQuery(this).parents("div.bbg_xiv-flex_item").find("img")[0];
                }
                fullImg[0].src=img.src;
                fullLarge[0].srcset=img.src;
                fullMedium[0].srcset=img.src;
                fullSmall[0].srcset=img.src;
                // try and replace img src with better match 
                try{
                    var imageId=img.dataset.bbg_xivImageId;
                    if(imageId){
                        var galleryId=jQuery(img).parents("div[data-bbg_xiv-gallery-id]")[0].dataset.bbg_xivGalleryId;
                        if(galleryId){
                            var urls=bbg_xiv.getImageUrl(bbg_xiv.images[galleryId].get(imageId).attributes);
                            fullImg[0].src=urls.src;
                            fullLarge[0].srcset=urls.src;
                            fullMedium[0].srcset=urls.medium;
                            fullSmall[0].srcset=urls.small;
                        }
                    }
                }catch(e){
                }
                fullTitle[0].textContent=img.alt;
                fullCaption[0].textContent=img.title;
                // show and fade in overlay
                outer.show();
                inner.show();
                window.setTimeout(function(){
                    inner.css("opacity","1.0");
                    outer.css("opacity","0.93");
                },100);
                e.preventDefault();
                e.stopPropagation();
            });
        }
        switch(view){
        case "Gallery":
            if(Modernizr.flexbox&&Modernizr.flexwrap&&!window.bbg_xiv['bbg_xiv_disable_flexbox']){
                bbg_xiv.renderFlex(jqGallery,images);
                constructOverlay();
            }else{
                bbg_xiv.renderBootstrapGallery(jqGallery,images);
            }
            jQuery(window).resize();
            if(bbg_xiv.search[gallery.id]){
                // search results have a heading
                jQuery("div#"+gallery.id+"-heading").show();
            }
            break;
        case "Carousel":
            var overflow=jQuery("html").css("overflow-y");
            jQuery("html").css("overflow-y","hidden");
            var carouselId="bbg_xiv-carousel_"+gallery.id;
            bbg_xiv.renderCarousel(jqGallery,images,carouselId);
            jqGallery.find("button.bbg_xiv-carousel_close_btn").click(function(e){
                // restore "Gallery View"
                var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                var liSelectView=jqGallery.parent().find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
                var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li").removeClass("active").first().addClass("active");
                liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
                jQuery(window).resize();
                jQuery("html").css("overflow-y",overflow);
                e.preventDefault();      
            });
            jQuery("#"+carouselId).carousel({interval:bbg_xiv.bbg_xiv_carousel_interval});
            break;
        case "Tabs":
            bbg_xiv.renderTabs(jqGallery,images,"bbg_xiv-tabs_"+gallery.id);
            // Hide the expand glyph if not needed.
            jqGallery.find("nav.navbar div.navbar-collapse ul.nav").each(function(e){
                if(jQuery(this).height()-3<=jQuery(this.parentNode).height()){
                    jqGallery.find("nav.navbar span.glyphicon").hide();
                    jQuery(this.parentNode).addClass("bbg_xiv-hide_scroll");
                }
            });
            // Clicking the expand glpyh shows all the tabs.
            jqGallery.find("span.glyphicon-collapse-down,span.glyphicon-collapse-up").click(function(e){
                var jqThis=jQuery(this);
                var navbar=jQuery(this.parentNode).find("div.navbar-collapse");
                if(jqThis.hasClass("glyphicon-collapse-down")){
                    jqThis.removeClass("glyphicon-collapse-down").addClass("glyphicon-collapse-up");
                    navbar.removeClass("bbg_xiv-closed").addClass("bbg_xiv-open");
                }else{
                    jqThis.removeClass("glyphicon-collapse-up").addClass("glyphicon-collapse-down");
                    navbar.removeClass("bbg_xiv-open").addClass("bbg_xiv-closed");
                }
            });
            jqGallery.find("nav.navbar ul.nav li a").click(function(e){
                if(!Modernizr.objectfit){
                    // Microsoft Edge does not support CSS object-fit so do the object fit with JavaScript code
                    jQuery(this.href.substr(this.href.lastIndexOf("#"))+" img").each(function(){
                        var img=this;
                        var i=0;
                        var j=0;
                        var r0;
                        window.setTimeout(function f(){
                            var w=img.naturalWidth;
                            var h=img.naturalHeight;
                            var parent=jQuery(img.parentNode.parentNode.parentNode);
                            var W=parent.width();
                            var H=0.7*jQuery(window).height();
                            if(!w||!h||!W||!H||W<64||H<64){
                                if(i++<16){
                                    window.setTimeout(f,250);
                                }
                                return;
                            }
                            var r=Math.max(w/W,h/H);
                            if(r<0.125||r>8){
                                return;
                            }
                            if(typeof r0!=='undefined'&&r===r0){
                                return;
                            }
                            w=Math.floor(w/r);
                            h=Math.floor(h/r);
                            jQuery(img).css({width:w+"px",height:h+"px"});
                            r0=r;
                            if(j++<16){
                                window.setTimeout(f,250);
                            }
                        },250);
                    });
                }
                window.setTimeout(function(){
                    // the timeout is necessary to give browser time to render the image before the scrolling is done
                    if(window.matchMedia("(max-aspect-ratio:1/1)").matches){
                        // portrait mode
                        jQuery(window).scrollTop(jqGallery.find("div.tab-content").offset().top-60);
                    }else{
                        // landscape mode
                        jQuery(window).scrollTop(jqGallery.find("div.tab-content").offset().top-80);
                    }
                },500);
            });
            break;
        case "Dense":
            var overflow=jQuery("html").css("overflow-y");
            jQuery("html").css("overflow-y","hidden");
            bbg_xiv.renderDense(jqGallery,images,"bbg_xiv-dense_"+gallery.id,"title");
            jqGallery.find("div.bbg_xiv-dense_images div.bbg_xiv-dense_flex_images div.bbg_xiv-dense_flex_item")
                .css("width",100/bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns+"%");
            var normal=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-normal_color").css("background-color");
            var highlight=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-highlight_color").css("background-color");
            jqGallery.find("div.bbg_xiv-dense_titles ul li").hover(
                function(e){
                    // highlight matching image
                    jQuery(this).css({"background-color":highlight});
                    var img=jQuery("div#"+this.id.replace("title","image")).css({"border-color":highlight});
                    // scroll images view if matching image is hidden
                    var top=img.position().top;
                    var height=img.height();
                    var bottom=top+height;
                    var div=img.parents("div.bbg_xiv-dense_images")
                    var scrollTop=div.scrollTop();
                    var scrollHeight=div.height();
                    if(top<0){
                        div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                    }else if(bottom>scrollHeight){
                        div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                    }
                },
                function(e){
                    jQuery(this).css({"background-color":normal});
                    jQuery("div#"+this.id.replace("title","image")).css({"border-color":normal});
                }
            );
            jqGallery.find("div.bbg_xiv-dense_flex_item").hover(
                function(e){
                    jQuery(this).css({"border-color":highlight});
                    // highlight matching title
                    var li=jQuery("li#"+this.id.replace("image","title")).css({"background-color":highlight});
                    // scroll titles view if matching title is hidden
                    var top=li.position().top;
                    var height=li.height();
                    var bottom=top+height;
                    var div=li.parents("div.bbg_xiv-dense_titles")
                    var scrollTop=div.scrollTop();
                    var scrollHeight=div.height();
                    if(top<0){
                        div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                    }else if(bottom>scrollHeight){
                        div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                    }
                },
                function(e){
                    jQuery(this).css({"border-color":normal});
                    jQuery("li#"+this.id.replace("image","title")).css({"background-color":normal});
                }
            );
            jqGallery.find("input.bbg_xiv-dense_li_mode").change(function(e){
                // show titles or captions depending on the radio buttons 
                if(this.checked){
                    var div=jQuery("div.bbg_xiv-dense_container div.bbg_xiv-dense_titles");
                    if(this.value==="title"){
                        div.find("span.bbg_xiv-dense_li_caption").hide();
                        div.find("span.bbg_xiv-dense_li_title").show();
                    }else if(this.value==="caption"){
                        div.find("span.bbg_xiv-dense_li_title").hide();
                        div.find("span.bbg_xiv-dense_li_caption").show();
                    }
                }
            });
            jqGallery.find("button.bbg_xiv-dense_close_btn").click(function(e){
                // restore "Gallery View"
                var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                var liSelectView=jqGallery.parent().find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
                var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li").removeClass("active").first().addClass("active");
                liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
                jQuery(window).resize();
                jQuery("html").css("overflow-y",overflow);
                e.preventDefault();      
            });
            constructOverlay();
            break;
        // TODO: Add entry for new views here
        case "Table":
            bbg_xiv.renderTable(jqGallery,images);
            break;
        default:
            break;
        }
    };
    
    bbg_xiv.getThumbnailUrl=function(data){
        switch(bbg_xiv.bandwidth){
        case "normal":
            return {
                src      :data.url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_medium_url,
                large    :data.bbg_xiv_large_url
            };
        case "low":
            return {
                src      :data.bbg_xiv_small_url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_small_url,
                large    :data.bbg_xiv_small_url
            };
        case "very low":
            return {
                src      :data.bbg_xiv_thumbnail_url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_thumbnail_url,
                medium   :data.bbg_xiv_thumbnail_url,
                large    :data.bbg_xiv_thumbnail_url
            }; 
        }
    };
    
    bbg_xiv.getImageUrl=function(data){
        switch(bbg_xiv.bandwidth){
        case "normal":
            return {
                src      :data.url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_medium_url,
                large    :data.bbg_xiv_large_url
            };
        case "low":
        case "very low":
            return {
                src      :data.bbg_xiv_small_url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_small_url,
                large    :data.bbg_xiv_small_url
            };
        }
    };
    
    bbg_xiv.setCookie=function(name,value,expires){
        var d=new Date();
        d.setTime(d.getTime()+(expires*24*60*60*1000));
        document.cookie=name+"="+value+"; expires="+d.toUTCString()+"; path=/";
    };

    bbg_xiv.getCookie=function(name){
        var cookie=document.cookie;
        cookie+=";"
        var start=cookie.indexOf(name+"=");
        if(start===-1){
            return null;
        }
        start+=name.length+1;
        var end=cookie.indexOf(";",start);
        if(end===-1){
            return null;
        }
        return cookie.substring(start,end);
    };

    bbg_xiv.calcBreakpoints=function(){
        var minFlexWidth=window.bbg_xiv['bbg_xiv_flex_min_width'];
        bbg_xiv.breakpoints=[
            {width:2*minFlexWidth,cssClass:"100"},
            {width:3*minFlexWidth,cssClass:"50"},
            {width:4*minFlexWidth,cssClass:"33_3333"},
            {width:5*minFlexWidth,cssClass:"25"},
            {width:6*minFlexWidth,cssClass:"20"},
            {width:7*minFlexWidth,cssClass:"16_6666"},
            {width:8*minFlexWidth,cssClass:"14_2857"},
            {width:9*minFlexWidth,cssClass:"12_5"},
            {width:10*minFlexWidth,cssClass:"11_1111"},
            {width:11*minFlexWidth,cssClass:"10"},
            {width:12*minFlexWidth,cssClass:"9_0909"},
            {width:1000000,class:"8_3333"}
        ];
    };

    bbg_xiv.getOptionsFromCookie=function(){
        // override options with cookie values if they exists
        var cookie=bbg_xiv.getCookie("bbg_xiv");
        if(cookie){
            var options=JSON.parse(cookie);
            var carousel_interval=options.bbg_xiv_carousel_interval;
            if(jQuery.isNumeric(carousel_interval)&&carousel_interval>=1000){
                bbg_xiv.bbg_xiv_carousel_interval=carousel_interval;
            }
            var flex_min_width=options.bbg_xiv_flex_min_width;
            if(jQuery.isNumeric(flex_min_width)&&flex_min_width>=32&&flex_min_width<=1024){
                bbg_xiv.bbg_xiv_flex_min_width=flex_min_width;
            }
            var max_search_results=options.bbg_xiv_max_search_results;
            if(jQuery.isNumeric(max_search_results)&&max_search_results>=1&&max_search_results<1048576){
                bbg_xiv.bbg_xiv_max_search_results=max_search_results;
            }
            var flex_number_of_dense_view_columns=options.bbg_xiv_flex_number_of_dense_view_columns;
            if(jQuery.isNumeric(flex_number_of_dense_view_columns)&&flex_number_of_dense_view_columns>=2&&flex_number_of_dense_view_columns<=32){
                bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=flex_number_of_dense_view_columns;
            }
            if(typeof options.bbg_xiv_bandwidth==="string"){
                bbg_xiv.bbg_xiv_bandwidth=options.bbg_xiv_bandwidth;
            }
            if(typeof options.bbg_xiv_interface==="string"){
                bbg_xiv.bbg_xiv_interface=options.bbg_xiv_interface;
            }
        }else{
            bbg_xiv.bbg_xiv_bandwidth="auto";
            bbg_xiv.bbg_xiv_interface="auto";
        }
        // compute bandwidth if bandwidth is set to auto - currently since this is not done reliably the user should set the bandwidth option manually
        if(bbg_xiv.bbg_xiv_bandwidth==="auto"){
            if(Modernizr.lowbandwidth){
                // this uses navigator.connection which is only supported by Android
                bbg_xiv.bandwidth="very low";
            }else if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                // determining bandwidth by device type is not reliable!
                bbg_xiv.bandwidth="very low";
            }else{
                bbg_xiv.bandwidth="normal";
            }
        }else{
            bbg_xiv.bandwidth=bbg_xiv.bbg_xiv_bandwidth;
        }
        // compute interface if interface is auto
        if(bbg_xiv.bbg_xiv_interface==="auto"){
            if(Modernizr.touchevents){
                bbg_xiv.interface="touch";
            }else{
                bbg_xiv.interface="mouse";
            }
        }else{
            bbg_xiv.interface=bbg_xiv.bbg_xiv_interface;
        }
    };
    
    bbg_xiv.getOptionsFromCookie();
    bbg_xiv.calcBreakpoints();
    
    jQuery(window).resize(function(){
        var breakpoints=bbg_xiv.breakpoints;
        jQuery("div.bbg_xiv-flex_container, div.bbg_xiv-gallery_container").each(function(){
            var jqThis=jQuery(this);
            var width=jqThis.width();
            breakpoints.forEach(function(breakpoint){
              jqThis.removeClass("bbg_xiv-flex_width_"+breakpoint.cssClass);
            });
            var minFlexWidthForCaption=window.bbg_xiv.bbg_xiv_flex_min_width_for_caption;
            for(var i=0;i<breakpoints.length;i++){
                if(width<breakpoints[i].width){
                    var cssClass=breakpoints[i].cssClass;
                    jqThis.addClass("bbg_xiv-flex_width_"+cssClass);
                    var pxWidth=parseFloat(cssClass.replace("_","."))/100.0*width;
                    if(pxWidth<minFlexWidthForCaption){
                        jqThis.addClass("bbg_xiv-flex_no_caption");
                    }else{
                        jqThis.removeClass("bbg_xiv-flex_no_caption");
                    }
                    break;
                }
            };
        });
        if(bbg_xiv.interface==="mouse"&&jQuery(window).width()>=bbg_xiv.bbg_xiv_flex_min_width_for_dense_view){
            jQuery(".bbg_xiv-large_viewport_only").show();
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").show();
        }else{
            jQuery(".bbg_xiv-large_viewport_only").hide();
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").hide();
        }  
    });

    jQuery("div.bbg_xiv-gallery_envelope").each(function(){
        bbg_xiv.renderGallery(this,"Gallery");
    });

    jQuery(document).ready(function(){
        // wireup the event handlers
        // wireup the handler for view selection
        jQuery("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li > a").click(function(e){
            var jqThis=jQuery(this);
            var li=jqThis.parent();
            li.parent().find("li").removeClass("active");
            li.addClass("active");
            li.parents("li.bbg_xiv-select_view").find("a.bbg_xiv-selected_view span").text(this.textContent);
            var gallery=jqThis.parents("div.bbg_xiv-gallery");
            bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],this.textContent.trim());
            e.preventDefault();
        });
        // wireup the handler for searching
        jQuery("form.bbg_xiv-search_form input[type='text']").keypress(function(e){
            if(e.which===13){
                // need to do this to hide virtual keyboard on mobile devices
                jQuery(this).blur();
            }
        });
        jQuery("form.bbg_xiv-search_form button").each(function(){
            var query;
            var offset;
            var count;
            jQuery(this).click(function(e){
                var startSearch="search images on site";
                var continueSearch="continue current search";
                var divGallery=jQuery(this).parents("div.bbg_xiv-gallery").find("div.bbg_xiv-gallery_envelope")[0];
                var form=jQuery(this).parents("form[role='search']");
                var input=form.find("input[type='text']");
                var value=input.val();
                if(value){
                    // new search
                    query=value;
                    offset=0;
                    // start new search history
                    bbg_xiv.search[divGallery.id]={history:[],index:-1,done:false};
                    // get count
                    var postData={
                        action:"bbg_xiv_search_media_count",
                        query:query,
                        _wpnonce:form.find("input[name='_wpnonce']").val(),
                        _wp_http_referer:form.find("input[name='_wp_http_referer']").val()
                    };
                    jQuery.post(bbg_xiv.ajaxurl,postData,function(r){
                        count=parseInt(r);
                    });
                }else if(typeof query==="undefined"){
                    e.preventDefault();
                    return;
                }
                // get the next part of the multi-part search result
                var postData={
                    action:"bbg_xiv_search_media",
                    query:query,
                    limit:parseInt(bbg_xiv.bbg_xiv_max_search_results),
                    offset:offset,
                    _wpnonce:form.find("input[name='_wpnonce']").val(),
                    _wp_http_referer:form.find("input[name='_wp_http_referer']").val()
                };
                jQuery(divGallery).empty().append('<h1 class="bbg_xiv-info">Loading... please wait.</h1>');
                jQuery.post(bbg_xiv.ajaxurl,postData,function(r){
                    bbg_xiv.images[divGallery.id]=null;
                    bbg_xiv[divGallery.id+"-data"]=r;
                    if(r){
                        var images=bbg_xiv.constructImages(divGallery);
                        var search_limit=parseInt(bbg_xiv.bbg_xiv_max_search_results);
                        var prevOffset=offset;
                        var prevQuery=query;
                        var heading=jQuery("div#"+divGallery.id+"-heading");
                        var search=bbg_xiv.search[divGallery.id];
                        if(offset+images.models.length<count){
                            // this search has more images
                            offset+=search_limit;
                            input.val("").attr("placeholder",continueSearch);
                            heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",false);
                        }else{
                            // all search results have been returned
                            search.done=true;
                            input.attr("placeholder",startSearch).val(query);
                            query=undefined;
                            offset=undefined;
                            heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",true);
                        }
                        // search results uses a heading to show status
                        heading.find("span.bbg_xiv-search_heading_first").text("Search Results for \""+prevQuery+"\"");
                        var title="Images "+(prevOffset+1)+" to "+(prevOffset+images.models.length)+" of "+count;
                        heading.find("span.bbg_xiv-search_heading_second").text(title);
                        // maintain a history of all images returned by this search
                        search.history.push({images:images,title:title});
                        search.index=search.history.length-1;
                        bbg_xiv.renderGallery(divGallery,"Gallery");
                        heading.find("button.bbg_xiv-search_scroll_left").attr("disabled",search.index===0);
                    }else{
                        jQuery(divGallery).empty().append('<h1 class="bbg_xiv-warning">Nothing Found</h1>');
                    }
                    var liSelectView=jQuery(divGallery.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
                    var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li").removeClass("active").first().addClass("active");
                    liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
                });
                e.preventDefault();
            });
        });
        // wireup the handler for setting options
        jQuery("button.bbg_xiv-configure").click(function(e){
            divConfigure.find("input#bbg_xiv-carousel_delay").val(bbg_xiv.bbg_xiv_carousel_interval);
            divConfigure.find("input#bbg_xiv-min_image_width").val(bbg_xiv.bbg_xiv_flex_min_width);
            divConfigure.find("input#bbg_xiv-max_search_results").val(bbg_xiv.bbg_xiv_max_search_results);
            divConfigure.find("input#bbg_xiv-columns_in_dense_view").val(bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns);
            divConfigure.find("input[name='bbg_xiv-bandwidth']").prop("checked",false);
            divConfigure.find("input[name='bbg_xiv-bandwidth'][value='"+bbg_xiv.bbg_xiv_bandwidth+"']").prop("checked",true);
            divConfigure.find("input[name='bbg_xiv-interface']").prop("checked",false);
            divConfigure.find("input[name='bbg_xiv-interface'][value='"+bbg_xiv.bbg_xiv_interface+"']").prop("checked",true);
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.show();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.show();
        });
        var divConfigure=jQuery(".bbg_xiv-configure_inner");
        divConfigure.find("input[type='number']#bbg_xiv-max_search_results").change(function(e){
            // max seems to be broken so fix with javascript
            var jqThis=jQuery(this);
            if(parseInt(jqThis.val())>parseInt(jqThis.attr("max"))){
                jqThis.val(jqThis.attr("max"));
            }
        });
        divConfigure.find("button.bbg_xiv-configure_close,button.bbg_xiv-cancel_options").click(function(e){
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.hide();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.hide();
        });
        divConfigure.find("button.bbg_xiv-help_options").click(function(e){
            window.open(bbg_xiv.helpUrl,"_blank");
            e.preventDefault();
        });
        divConfigure.find("button.bbg_xiv-save_options").click(function(e){
            // save the options
            bbg_xiv.bbg_xiv_carousel_interval=divConfigure.find("input#bbg_xiv-carousel_delay").val();
            bbg_xiv.bbg_xiv_flex_min_width=divConfigure.find("input#bbg_xiv-min_image_width").val();
            bbg_xiv.bbg_xiv_max_search_results=divConfigure.find("input#bbg_xiv-max_search_results").val();
            bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=divConfigure.find("input#bbg_xiv-columns_in_dense_view").val();
            bbg_xiv.bbg_xiv_bandwidth=divConfigure.find("input[name='bbg_xiv-bandwidth']:checked").val();
            bbg_xiv.bbg_xiv_interface=divConfigure.find("input[name='bbg_xiv-interface']:checked").val();
            var cookie=JSON.stringify({
                bbg_xiv_carousel_interval:bbg_xiv.bbg_xiv_carousel_interval,
                bbg_xiv_flex_min_width:bbg_xiv.bbg_xiv_flex_min_width,
                bbg_xiv_max_search_results:bbg_xiv.bbg_xiv_max_search_results,
                bbg_xiv_flex_number_of_dense_view_columns:bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
                bbg_xiv_bandwidth:bbg_xiv.bbg_xiv_bandwidth,
                bbg_xiv_interface:bbg_xiv.bbg_xiv_interface
            });
            bbg_xiv.setCookie("bbg_xiv",cookie,30);
            bbg_xiv.getOptionsFromCookie();
            bbg_xiv.calcBreakpoints();
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.hide();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.hide();
            // redisplay the "Gallery" view using the new option values
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
            // reset navbar to "Gallery" view
            var liSelectView=gallery.find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
            var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li").removeClass("active").first().addClass("active");
            liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
            jQuery(window).resize();
            e.preventDefault();
        });
        // wireup the handler for scrolling through search results
        jQuery("div.bbg_xiv-search_header button.bbg_xiv-search_scroll_left,div.bbg_xiv-search_header button.bbg_xiv-search_scroll_right").click(function(e){
            jqThis=jQuery(this);
            var heading=jqThis.parents("div.bbg_xiv-search_header");
            var id=heading.attr("id").replace("-heading","");
            var gallery=heading.parents("div.bbg_xiv-gallery");
            var search=bbg_xiv.search[id];
            if(jqThis.hasClass("bbg_xiv-search_scroll_left")){
                if(search.index>0){
                    if(!--search.index){
                        jqThis.attr("disabled",true);
                    }
                    heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",false);
                }else{
                }
            }else{
                if(search.index<search.history.length-1){
                    ++search.index;
                    if(search.index===search.history.length-1&&search.done){
                        heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",true);
                    }
                    heading.find("button.bbg_xiv-search_scroll_left").attr("disabled",false);
                }else{
                    // load the next part of the multi-part search
                    gallery.find("nav.navbar form.bbg_xiv-search_form button[type='submit']").click();
                    return;
                }
            }
            if(search.index>=0&&search.index<search.history.length){
                var history=search.history[search.index];
                bbg_xiv.images[id]=history.images;
                heading.find("span.bbg_xiv-search_heading_second").text(history.title);
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                // reset navbar to "Gallery" view
                var liSelectView=gallery.find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
                var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li").removeClass("active").first().addClass("active");
                liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
            }
        });
        jQuery(window).resize();
    });

    //cookie test code
    //window.alert("bbg_xiv_test="+bbg_xiv.getCookie("bbg_xiv_test"));
    //bbg_xiv.setCookie("bbg_xiv_test",window.prompt("bbg_xiv_test","null"));
}());

