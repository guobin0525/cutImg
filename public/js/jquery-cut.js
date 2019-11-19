jQuery(function($){
    // Create variables (in this scope) to hold the API and image size
    var jcrop_api,
        boundx,
        boundy,
        boundxscale,
        boundyscale,

        // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        //右边框
        $pcnt = $('#preview-pane .preview-container'),
        //右边框内图片
        $pimg = $('#preview-pane .preview-container img'),
        //右侧小框宽高
        xsize = $pcnt.width(),
        ysize = $pcnt.height();
    $('#target').Jcrop({
        onChange: updatePreview,
        onSelect: getData,
        aspectRatio: xsize / ysize,
        boxWidth: 600,
        boxHeight: 600
    },function(){
        // Use the API to get the real image size
        var bounds = this.getBounds();
        boundx = bounds[0];
        boundy = bounds[1];
        //获取图片的缩放比例；
        var boundscale=this.getScaleFactor();
        boundxscale=boundscale[0];
        boundyscale=boundscale[1];

        // Store the API in the jcrop_api variable
        jcrop_api = this;

        // Move the preview into the jcrop container for css positioning
        $preview.appendTo(jcrop_api.ui.holder);
    });

    function updatePreview(c)
    {
        if (parseInt(c.w) > 0)
        {
            var rx = xsize / c.w;
            var ry = ysize / c.h;
            $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
        }
    }
    function getData(c) {
        //获取的c为一个对象，选中区域位置的参数
        //属性：h:高；w:宽；x,y:起点位置；x2,y2:终点位置
        curobj=c;//必须在外面声明全局变量；
        curobj.xsize=xsize;
        curobj.ysize=ysize;
    }
});