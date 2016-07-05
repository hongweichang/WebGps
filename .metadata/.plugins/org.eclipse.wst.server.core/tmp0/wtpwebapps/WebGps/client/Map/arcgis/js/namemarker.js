//NameMarker => icon with table  , 设备图标和文字,  点(带图标),线,面等文字
function NameMarker(opts)
{
    this.icon_ = null;
    if ((typeof opts.icon) != "undefined")
    {
        this.icon_ = opts.icon;
    }

    this.point_ = opts.position;
    this.text_ = opts.text || "";
    this.map_ = opts.map;
    
    //marker type
    this.mtype_ = opts.marker_type;

    //设备id 或者 点线面的id
    this.idno_="";
    
    if((typeof opts.idno) != "undefined")
        this.idno_ = opts.idno;

    this.iconMarker = null;
    this.textMarker = null;
    this.dxmObject = null;
    if (this.mtype_ == "device")
    {
        if (this.icon_ != null)
        {
            this.iconMarker = this.CreateIconMarker();
        }

        this.labelMarker = this.CreateTextLabel();
    }
    else //marker
    {
        //点线面对象
        if (this.icon_ != null) //点对象是图标和文字
        {
            this.iconMarker = this.CreateIconMarker();
            this.labelMarker = this.CreateTextLabel();
        }
        else
            this.dxmObject = opts.dxmobj;    
    } 
}

NameMarker.prototype.CreateIconMarker = function ()
{
    var pic = new mapobject.symbol.PictureMarkerSymbol({
        "url": this.icon_,
        "height": 24,
        "width": 24,
        "angle": 0
    });

    //pic.setOutline(null);

    marker = new mapobject.Graphic(this.point_, pic, { "marker_type": this.mtype_, "idno": this.idno_});
    

    GFRAME.markerLayer.add(marker);

    return marker;

}

NameMarker.prototype.GetTextPoint = function (point)
{
    var text_point = point;
    /*
    //如果有了iconmarker  ,文字需要偏移一点显示
    if (this.iconMarker != null)
    {
        text_point.setSpatialReference(new mapobject.SpatialReference({ wkid: 4326 }));
        var screenpoint = this.map_.toScreen(point);
        //文字放在图标右侧.
        //screenpoint = screenpoint.offset(16, 12);
        //text_point = mapobject.maps.toMapPoint(this.map_.extent, this.map_.width, this.map_.height, screenpoint);

        text_point = this.map_.toMap(screenpoint).normalize();
        text_point = text_point.normalize();
    }
    */
    return text_point;
}

NameMarker.prototype.CreateTextLabel = function ()
{
    var text_point = this.GetTextPoint(this.point_);

    var font = new mapobject.symbol.Font("8px", mapobject.symbol.Font.STYLE_NORMAL, mapobject.symbol.Font.VARIANT_NORMAL, mapobject.symbol.Font.WEIGHT_BOLD);
    font.setWeight(mapobject.symbol.Font.WEIGHT_BOLD); 
    var label = new mapobject.symbol.TextSymbol(this.text_, font, new mapobject.Color([255, 0, 200, 0.8]));

    var marker = null;
    if (this.iconMarker != null)
        marker = new mapobject.Graphic(text_point, label.setOffset(24,-13));
    else
    {
        marker = new mapobject.Graphic(text_point, label);
    }

    GFRAME.markerLayer.add(marker);

    return marker;
}


NameMarker.prototype.onAdd = function ()
{
   
};

NameMarker.prototype.FreeRes = function ()
{
    if (this.iconMarker != null)
    {
        GFRAME.markerLayer.remove(this.iconMarker);
        this.iconMarker.geomery = null;
        this.iconMarker.symbol = null;
        this.iconMarker = null;
    }

    if (this.labelMarker != null)
    {
        GFRAME.markerLayer.remove(this.labelMarker);
        this.labelMarker.geomery = null;
        this.labelMarker.symbol = null;
        this.labelMarker = null;
    }
}

NameMarker.prototype.onRemove = function ()
{
    this.FreeRes();
};

NameMarker.prototype.update = function (obj)
{
    var need_fresh = false;

    if ((typeof obj.icon) != "undefined")
    {
        need_fresh = true;
        this.setIcon(obj.icon);
    }

    if ((typeof obj.position) != "undefined")
    {
        need_fresh = true;
        this.setPosition(obj.position);
    }

    //for device
    if ((typeof obj.idno) != "undefined")
    {
        need_fresh = true;
        this.setName(obj.idno);
    }

    //for marker
    if ((typeof obj.name) != "undefined")
    {
        need_fresh = true;
        this.setName(obj.name);
    }

    if (need_fresh)
        this.refresh();
};

NameMarker.prototype.setPosition = function (position)
{
    this.point_ = position;
    
    if (this.iconMarker != null)
    {
        this.iconMarker.setGeometry(position);
    }

    if (this.labelMarker != null)
    {
        var text_point = this.GetTextPoint(position);
        this.labelMarker.setGeometry(text_point);
    }
};

NameMarker.prototype.setIcon = function (icon)
{
    if (this.icon_ != icon)
    {
        this.icon_ = icon;
        var pic_symbol = this.iconMarker.symbol;
        pic_symbol.setUrl(this.icon_); 
    }
};

NameMarker.prototype.setName = function (text)
{
    if (this.text_ != text)
    {
        this.text_ = text;
        if (this.labelMarker != null)
        {
            var txt_symbol = this.labelMarker.symbol;
            txt_symbol.setText(this.text_);
        }
    }
};

NameMarker.prototype.refresh = function ()
{
    //GFRAME.markerLayer.redraw(); 
}