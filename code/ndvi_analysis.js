//Sreechandh Devireddy

// Set the center of the map to the desired location
Map.setCenter(84.255, 27.675, 12);

// Load Sentinel-2 image collection
var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterDate('2020-01-01', '2020-12-31')
    .filterBounds(Map.getCenter())
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .sort('system:time_start', false);

// Define a function to calculate NDVI for each image
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// Map over the image collection and calculate NDVI for each image
var s2_with_ndvi = s2.map(addNDVI);

// Calculate mean NDVI for two time periods
var start_date = '2020-01-01';
var end_date1 = '2020-06-30';
var end_date2 = '2020-12-31';

var mean_ndvi1 = s2_with_ndvi
    .filterDate(start_date, end_date1)
    .select('NDVI')
    .mean();

var mean_ndvi2 = s2_with_ndvi
    .filterDate(end_date1, end_date2)
    .select('NDVI')
    .mean();

// Calculate the difference between the two mean NDVI values
var ndvi_diff = mean_ndvi2.subtract(mean_ndvi1);

// Create a binary mask of healthy and stressed vegetation areas using a threshold value
var mask = ndvi_diff.gt(0.2);

// Display the results on the map
Map.addLayer(mean_ndvi1, {min: 0, max: 1}, 'Mean NDVI 1');
Map.addLayer(mean_ndvi2, {min: 0, max: 1}, 'Mean NDVI 2');
Map.addLayer(ndvi_diff, {min: -0.2, max: 0.2, palette: ['red', 'white', 'green']}, 'NDVI Difference');
Map.addLayer(mask, {palette: 'red, green'}, 'Vegetation Mask');

// Create a chart of mean NDVI values over time
var chart = ui.Chart.image.series({
  imageCollection: s2_with_ndvi.select('NDVI'),
  region: ee.Geometry.Point([84.255, 27.675]).buffer(500),
  reducer: ee.Reducer.mean(),
  scale: 10,
});
chart.setOptions({
  title: 'Mean NDVI over time',
  vAxis: {title: 'NDVI'},
  hAxis: {title: 'Date'},
});
print(chart);
