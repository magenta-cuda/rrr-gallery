// Dense Container Template

const DenseContainer = props => {
    const collection = props.images
    const mode       = props.mode
    if ( typeof collection === 'string' ) {
        return <h1>{collection}</h1>
    }
    const jsxTitles = []
    const jsxImages = []
    collection.forEach(function(model) {
         jsxTitles.push(<DenseTitle data={model.attributes} key={model.attributes.id} />);
         jsxImages.push(<DenseImage data={model.attributes} key={model.attributes.id} />);
    })
    return (
        <div id={collection.id} className="bbg_xiv-dense_container" data-bbg_xiv-gallery-id={collection.id}>
          <button type="button" id="bbg_xiv-highlight_color"></button>
          <button type="button" id="bbg_xiv-normal_color"></button>
          <div className="bbg_xiv-dense_button_box">
            <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="title"
              checked={data.mode === "title"} \>&nbsp;Title&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="caption"
              checked={data.mode === "caption"} \>&nbsp;Caption&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="alt"
              checked={data.mode === "alt"} \>&nbsp;Alt
          </div>
          <div className="bbg_xiv-dense_right_btns">
            <button type="button" className="bbg_xiv-dense_info_btn btn" title="get help">
                <span class="glyphicon glyphicon-question-sign"></span>
            </button>
            <button type="button" className="bbg_xiv-dense_close_btn btn btn-default" title="close">
                <span class="glyphicon glyphicon-remove"></span>
            </button>
          </div>
          <div className="bbg_xiv-dense_titles">
            <ul className="list-unstyled">
              {jsxTitles}
            </ul>
          </div>
          <div className="bbg_xiv-dense_images">
            <div className="bbg_xiv-dense_flex_images">
              {jsxImages}
            </div>
          </div>
          {/* Full Browser Viewport View of an Image */}
          <div className="bbg_xiv-dense_outer">
          </div>
          <div className="bbg_xiv-dense_inner">
            <button className="bbg_xiv-dense_close"><span class="glyphicon glyphicon-remove"></span></button>
            <h1 className="bbg_xiv-dense_title"></h1>
            <img className="img-rounded bbg_xiv-img_overlay" sizes={bbg_xiv.getSizes(null,'viewport',false)} />
            <h1 className="bbg_xiv-dense_caption"></h1>
          </div>
        </div>
    )
}
