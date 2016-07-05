//对应arcgis的InfoWindowTemplate
function PopupMarker(opts)
{
    this._content = opts.content || "";
    this._point = opts.position;
    this._map = opts.map;
    this._name = opts.name || "";
    this._title = opts.title;
    this.isVisible = false;
    //_marker is arcgis graphic object
    this._marker = opts.marker;
    
    if ((typeof opts.icon) != "undefined")
    {
        this.icon_ = opts.icon;
    } 
    else
    {
        this.icon_ = null;
    }

    //marker type
    this.mtype_ = opts.marker_type;

    //设备id 或者 点线面的id
    this.idno_ = opts.id;

    this._showpop = opts.showpop;

    this.infoTemplate = new mapobject.InfoTemplate();
    this.infoTemplate.setTitle(this._title);

    this.infoTemplate.setContent(this._content);


    if (this.mtype_ == "device")
    {
        if (this.icon_ != null)
        {
            this._marker.iconMarker.setInfoTemplate(this.infoTemplate);
        }
        else
        {
            this._marker.labelMarker.setInfoTemplate(this.infoTemplate);
        }
    }
    else
    {
        if (this.icon_ != null) //点对象是图标
        {
            this._marker.iconMarker.setInfoTemplate(this.infoTemplate);
        }
        else 
            this._marker.dxmObject.setInfoTemplate(this.infoTemplate); 
    }

    if (this._showpop)
    {
        this.showMarker();
    }
}

PopupMarker.prototype.FreeRes = function ()
{
    this.infoTemplate = null;
}


PopupMarker.prototype.onAdd = function ()
{ 
}


PopupMarker.prototype.onRemove = function ()
{
    FreeRes();
}

PopupMarker.prototype.setPosition = function (point)
{
    this._point = point;
}

PopupMarker.prototype.setIcon = function (icon)
{
    if (this._icon == icon)
        return false;

    this._icon = icon;
    return true;
}

PopupMarker.prototype.isNull = function(value) {
    if (!value && value != 0 || value == undefined || value == "" || value == null || typeof value == "undefined") {
        return true;
    }
    return false;
};

PopupMarker.prototype.hide = function ()
{
    GFRAME.map.infoWindow.hide();
    this.isVisible = false;
};

PopupMarker.prototype.show = function ()
{
    this.infoTemplate.setTitle(this._title);
    this.infoTemplate.setContent(this._content);

    if (this.icon_ != null)
    {
        GFRAME.map.infoWindow.setContent(this._marker.iconMarker.getContent());
        if (!GFRAME.IsCustomInfoWin)
            GFRAME.map.infoWindow.setFeatures([this._marker.iconMarker]);
        GFRAME.InfoWinSourceGraphic = this._marker.iconMarker;
    }
    else
    {
        GFRAME.map.infoWindow.setContent(this._marker.labelMarker.getContent());
        if (!GFRAME.IsCustomInfoWin)
            GFRAME.map.infoWindow.setFeatures([this._marker.labelMarker]);

        GFRAME.InfoWinSourceGraphic = this._marker.labelMarker;
    }
    //*
    GFRAME.map.infoWindow.show(this._point);
    GFRAME.RemoveFocusRect();
    this.isVisible = true;
};

PopupMarker.prototype.toggle = function () 
{
    if(this.isVisible)
        this.hide();
    else
        this.show();
};

PopupMarker.prototype.update = function (obj)
{
    var need_fresh = false;
    if ((typeof obj.icon) != "undefined")
    {
        this.setIcon(obj.icon);
    }
    if ((typeof obj.position) != "undefined")
    {
        this._point = obj.position;
        this.setPosition(this._point);
    }
    if ((typeof obj.text) != "undefined")
    {
        this._content = obj.text;
    }

    if ((typeof obj.content) != "undefined")
    {
        this._content = obj.content;
    }

    if ((typeof obj.id) != "undefined")
    {
        this.idno_ = obj.id;
    }

    if ((typeof obj.name) != "undefined")
    {
        this._name = obj.name;
    }

    if ((typeof obj.title) != "undefined")
    {
        this._title = obj.title;
    }

    this.Refresh();
};

PopupMarker.prototype.hideMarker = function ()
{
    this.hide();
};

PopupMarker.prototype.showMarker = function ()
{
    this.show();
};

PopupMarker.prototype.Refresh = function ()
{
    this.infoTemplate.setTitle(this._title);
    this.infoTemplate.setContent(this._content);

    //如果当前显示的infowindow 是更新此设备 , 就要刷新infowindow的内容
    if (!GFRAME.map.infoWindow.isShowing)
        return;

    if (this.mtype_ == 'device' && this.idno_ == GFRAME.openPopMarkerVehicle)
    {
        if (this.icon_ != null)
            GFRAME.map.infoWindow.setContent(this._marker.iconMarker.getContent());
        else
            GFRAME.map.infoWindow.setContent(this._marker.labelMarker.getContent());

        GFRAME.map.infoWindow.show(this._point);
    }


}
