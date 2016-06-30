function PopupMarker(opts) {
  this.isVisible = false;
  this.map_ = opts.map;
  this.latlng_ = opts.position;
  if ((typeof opts.icon) != "undefined") {
 		this.icon_ = opts.icon;
	} else {
		this.icon_ = null;
	}
  this.text_ = opts.text || "";
  this.label_ = opts.label || "";
  if (this.label_ == "") {
 		this.label_ = this.text_;
 	}
  
  this.marker_ = new EV.Marker(this.latlng_,{
		externalGraphic: this.icon_,	 
		graphicWidth:28,
		graphicHeight: 28,
		//graphicYOffset: -19,
		//   pointRadius: 20,
    graphicName: "star",
		// rotation : 45,  //ie7下不支持
		label : this.label_,
		fontColor : "#0000ff",
		fontSize : "12px",
		fontFamily : "Courier New, monospace",
		fontWeight : "bold",
		labelXOffset : 42,
		labelYOffset : 6,
		labelOutlineColor : "white",
		labelOutlineWidth :2
	 });
	//this.marker_.addEventListener("click",function(e){
	//   this.showPopup();
  // });
  this.marker_.name = this.label_;
  this.marker_.setLabel(this.label_);
  this.marker_.setPopupContent(this.text_);
  this.map_.addOverlay(this.marker_);
};

PopupMarker.prototype.setIcon = function(icon) {
	if(this.icon_!=icon){
		this.marker_.setIcon(icon);
		this.icon_ = icon;
	}
};

PopupMarker.prototype.setPosition = function(lnglat) {
	if(this.latlng_!=lnglat){
		this.marker_.setLngLat(lnglat);
		this.latlng_ = lnglat;
	}
};

PopupMarker.prototype.setText = function(text) {
	if(this.text_!=text){
		this.marker_.setPopupContent(text);
		this.text_ = text;
	}
};

PopupMarker.prototype.hide = function() {
	this.marker_.closePopup();
  this.isVisible = false;
};

PopupMarker.prototype.show = function() {
	this.marker_.showPopup();
	this.marker_.popup.closecallback = doClosePopupMarker;
  this.isVisible = true;
};

function doClosePopupMarker() {
	GFRAME.closeMaxPop();
}

PopupMarker.prototype.toggle = function() {
  if (!this.isVisible) {
      this.show();
  } else {
      this.hide();
  }
};

PopupMarker.prototype.update = function(obj) {
  if ((typeof obj.icon) != "undefined") {
  	this.setIcon(obj.icon);
  }
  if ((typeof obj.position) != "undefined") {
    this.setPosition(obj.position);
  }
  if ((typeof obj.text) != "undefined") {
    if (this.text_ != obj.text) {
    	this.text_ = obj.text;
	    this.marker_.setPopupContent(this.text_);
	    if (this.marker_.popup != null) {
	    	this.marker_.popup.autoSize();
	  	}
	  }
  }
};

PopupMarker.prototype.setZIndex = function(index) {
};

PopupMarker.prototype.latlng = function() {
    return this.latlng_;
};

PopupMarker.prototype.hideMarker = function(){
	this.marker_.hide();
};

PopupMarker.prototype.showMarker = function(){
	this.marker_.show();
};

PopupMarker.prototype.destory = function(){
	if (this.marker_ != null) {
		this.marker_.closePopup();
		this.marker_.remove();
		this.marker_ = null;
	}
};