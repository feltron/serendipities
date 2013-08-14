function Map(id){
  this.id = id;
  this.leaflet = L.map('map'); // .setView([37.775, -122.418], 13);
  L.tileLayer.provider('Stamen.Toner').addTo(this.leaflet);
  this.segments = [];
  this.activities = [];
}

Map.prototype.drawDay = function(day){
  if (!day.segments) return this;
  this.segments = day.segments;

  this.leaflet.setView([37.775, -122.418], 13);

  this.segments.forEach(function(segment){
    if (segment.place) this.addPlaceSegment(segment);
    if (segment.activities) this.addActivitiesSegment(segment);
  }, this);
};

Map.prototype.addPlaceSegment = function(segment){

};

Map.prototype.addActivitiesSegment = function(segment){
  this.activities = this.activities.concat(segment.activities);
  segment.activities.forEach(function(activity){
    this.addActivity(activity);
  }, this);
};

Map.ActivityColors = {
  'wlk':'green',
  'trp':'gray',
  'cyc':'blue',
  'run':'red'
};

Map.prototype.addActivity = function(activity){
  var trackPoints, color;

  trackPoints = activity.trackPoints.map(function(trackPoint){
    return new L.LatLng(trackPoint.lat,trackPoint.lon);
  });

  color = Map.ActivityColors[activity.activity] || 'black';
  L.polyline(trackPoints, {color: color}).addTo(this.leaflet);
};


$(function(){

  map = new Map('map');

  $('#map-date').submit(function(event) {
    event.preventDefault();
    var date = $(this).find('input.date').val();

    var request = $.ajax({
      method: 'GET',
      url: '/mapdata',
      dataType: 'json',
      data: {date:date}
    });

    request.done(function(data){
      map.drawDay(data);
    });
  });



});




