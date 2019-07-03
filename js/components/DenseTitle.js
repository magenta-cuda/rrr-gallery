// Dense Title Template

const DenseTitle props => {
    const data = props.data
    return (
        <li id={`bbg_xiv-dense_title_${data.index}`}>
            <a href={data.link} target="_blank">
                <span className="bbg_xiv-dense_li_title" title={bbg_xiv.getCaption(data)}
                        style={data.mode !== "title" ? "display:none;" : ""}>
                    {bbg_xiv.getTitle(data)}
                </span>
                <span className="bbg_xiv-dense_li_caption" title={bbg_xiv.getTitle(data)}
                        style={data.mode !== "caption" ? style="display:none;" : ""}>
                    {bbg_xiv.getCaption(data)}
                </span>
                <span className="bbg_xiv-dense_li_alt" title={bbg_xiv.getTitle(data)}
                        style={data.mode !== "alt" ? "display:none;" : ""}>
                    {bbg_xiv.getAlt(data)}
                </span>
            </a>
            <button className="bbg_xiv-dense_full_btn bbg_xiv-dense_from_title btn">
                <span className="glyphicon glyphicon-fullscreen"></span>
            </button>
        </li>
    )
}
