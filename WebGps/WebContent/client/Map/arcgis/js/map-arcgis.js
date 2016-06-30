// JavaScript Document
//window.mapobject = window.esri || {}; //设置全局的命名空间
//mapobject.maps = esri.geometry || {}; //overlayers of map (arcgis.geometry=baidu.overlayer)

//单击设置marker在地图中心，缩放级别放
function dblclickSetRoomCenter(weidu, jingdu, map)
{
    var _zoom = map.getZoom();
    if (_zoom < 11)
    {
        map.setCenter(new mapobject.maps.Point(Number(jingdu), Number(weidu)));
        map.setZoom(11);
    } else if (_zoom >= 11 && _zoom <= 18)
    {
        map.setCenter(new mapobject.maps.Point(Number(jingdu), Number(weidu)));
        map.setZoom(_zoom + 2);
    }
};

//调用googleAPI进行地址解析
function parseAddress(weidu, jingdu, arr, name)
{
    if (!initParseAddress)
    {
        return;
    }

    if (document.getElementById(arr) != null)
    {
        GFRAME.Geocoder.on("location-to-address-complete", function (evt)
        {
            if (name != "")
            {
                _str = "&nbsp;<span class='b'>" + name + ":</span>&nbsp;";
            }
            else
            {
                _str = "&nbsp;";
            }

            if (evt.address.address)
            {
                saddr = evt.address.address.Match_addr;
                if (saddr != null)
                {
                    _str += saddr;
                }
            }

            document.getElementById(arr).innerHTML = _str;
        });


        var pt = new mapobject.maps.Point(jingdu, weidu);
        GFRAME.Geocoder.locationToAddress(pt, 100);
    }
}

//调用googleAPI进行地址解析
function parseAddressEx(weidu, jingdu, callback)
{
    var pt = new mapobject.maps.Point(jingdu, weidu);
    //callback paramtere?
    GFRAME.Geocoder.on("location-to-address-complete", function(evt)
    {
        var _str = "";
        var res = 0;
        if (evt.address.address)
        {
            var saddr = evt.address.address.Match_addr;
            if (saddr != null)
            {
                _str += saddr;
                res = 1;
            }
        }

        callback(res, _str);
    });
    GFRAME.Geocoder.locationToAddress(pt, 100);
}

//调用googleAPI进行地址解析
function myParseAddress(jingdu, weidu, userdata)
{
    var pt = new mapobject.maps.Point(jingdu, weidu);
    GFRAME.Geocoder.on("location-to-address-complete", function (evt)
    {
        var address = "";
        var ret = false;
        var error = 0;

        if (evt.address.address)
        {
            address = evt.address.Match_addr;
            ret = true;
        }
        else
        {
            error = 1;
        }
        if (isChrome)
        {
            app.sendMessage('OnParseAddress', [ret, address, userdata.toString(), error]);
        } else
        {
            window.external.OnParseAddress(ret, address, userdata.toString(), error);
        }
    });

    GFRAME.Geocoder.locationToAddress(pt, 100);
}
