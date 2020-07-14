<!-- Backbone.js templates for the 'gallery' shortcode using the WP REST API models        -->

<!-- These templates use the WordPress syntax for Backbone.js templates.                   -->
<!-- See bbg_xiv.templateOptions in the file ".../js/bbg_xiv-gallery.js".                  -->

<!-- Tabs Tab Template -->
<script type="text/html" id="bbg_xiv-template_tabs_tab">
<li<# if ( data.index === 0 ) { #> class=" active"<# } #>>
  <a href="#bbg_xiv-tab_pane{{{ data.index }}}" data-toggle="tab"><# print(bbg_xiv.getTitle(data)); #></a>
</li>
</script>

<!-- Tabs Item Template -->
<script type="text/html" id="bbg_xiv-template_tabs_item">
<figure id="bbg_xiv-tab_pane{{{ data.index }}}" role="tabpanel" class="tab-pane fade<# if ( data.index === 0 ) { #> active in<# } #>">
  <a href="{{{ data.link }}}" target="_blank"<# if ( typeof data.gallery_index !== "undefined" ) { #> class="bbg_xiv-gallery_icon" data-gallery-index="{{{ data.gallery_index }}}"<# } #>>
    <img class="bbg_xiv-tabs_img img-rounded" src="<# print(data.common.getSrc(data, 'container', false, data.bandwidth)); #>"
        srcset="<# print(bbg_xiv.getSrcset(data)); #>" sizes="<# print(bbg_xiv.getSizes(data,'container',false)); #>">
  </a>
  <figcaption><# print(bbg_xiv.getPostContent(data)); #></figcaption>
</figure>
</script>

<!-- Justified Gallery Alt Overlay Template -->
<script type="text/html" id="bbg_xiv-template_justified_alt_overlay">
    <div class="bbg_xiv-dense_alt_item bbg_xiv-dense_title">
        <span class="bbg_xiv-item_name">Title: </span><span class="bbg_xiv-item_value"><# print(bbg_xiv.getTitle(data)); #></span>
    </div>
    <div class="bbg_xiv-dense_alt_item bbg_xiv-dense_caption">
        <span class="bbg_xiv-item_name">Caption: </span><span class="bbg_xiv-item_value"><# print(bbg_xiv.getCaption(data,true)); #></span>
    </div>
    <div class="bbg_xiv-dense_alt_item bbg_xiv-dense_alt">
        <span class="bbg_xiv-item_name">Alt: </span><span class="bbg_xiv-item_value"><# print(bbg_xiv.getAlt(data,true)); #></span>
    </div>
    <div class="bbg_xiv-dense_alt_item bbg_xiv-dense_alt">
        <span class="bbg_xiv-item_name">Mime Type: </span><span class="bbg_xiv-item_value">{{{ data.mime_type }}}</span>
    </div>
    <# if ( typeof data.bbg_full_src === 'object' ) { #>
    <div class="bbg_xiv-dense_alt_item bbg_xiv-dense_urls">
        <span class="bbg_xiv-item_name">Image URLs: </span>
        <span class="bbg_xiv-item_value">Full: <a href="{{{ data.bbg_full_src[0] }}}">{{{ data.bbg_full_src[1] }}} x {{{ data.bbg_full_src[2] }}}</a></span>
        <# if ( typeof data.bbg_large_src === 'object' && data.bbg_large_src[0] !== data.bbg_full_src[0] ) { #>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="bbg_xiv-item_value">Large: <a href="{{{ data.bbg_large_src[0] }}}">{{{ data.bbg_large_src[1] }}} x {{{ data.bbg_large_src[2] }}}</a></span>
        <# } #>
        <# if ( typeof data.bbg_medium_large_src === 'object' && data.bbg_medium_large_src[0] !== data.bbg_large_src[0] && data.bbg_medium_large_src[0] !== data.bbg_full_src[0] ) { #>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="bbg_xiv-item_value">Medium Large: <a href="{{{ data.bbg_medium_large_src[0] }}}">{{{ data.bbg_medium_large_src[1] }}} x {{{ data.bbg_medium_large_src[2] }}}</a></span>
        <# } #>
        <# if ( typeof data.bbg_medium_src === 'object' && data.bbg_medium_src[0] !== data.bbg_medium_large_src[0] && data.bbg_medium_src[0] !== data.bbg_large_src[0] && data.bbg_medium_src[0] !== data.bbg_full_src[0] ) { #>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="bbg_xiv-item_value">Medium: <a href="{{{ data.bbg_medium_src[0] }}}">{{{ data.bbg_medium_src[1] }}} x {{{ data.bbg_medium_src[2] }}}</a></span>
        <# } #>
    </div>
    <div class="bbg_xiv-dense_alt_item bbg_xiv-dense_link">
        <span class="bbg_xiv-item_name">Page: <a href="{{{ data.link }}}"><# print(bbg_xiv.getTitle(data)); #></a></span>
    </div>
    <# } #>
</script>

<!-- Table Container Template -->
<script type="text/html" id="bbg_xiv-template_table_container">
<div class="bbg_xiv-table">
  <table class="table table-bordered table-striped bbg_xiv-table">
    <thead>
      <# print(bbg_xiv.dumpFieldNames(data.collection)); #>
    </thead>
    <tbody>
      <# print(bbg_xiv.dumpFieldValues(data.collection)); #>
    </tbody>
  </table>
</div>
</script>
