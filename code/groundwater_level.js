// Define a region of interest as a point
var point = ee.Geometry.Point(84.25616666666667, 27.675);

// Load Sentinel-2 Surface Reflectance collection
var collection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(point)
  .filterDate('2020-01-01', '2022-12-31')
  .sort('system:time_start')
  .map(function(image) {
    var timestamp = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');
    return image.set('system:time_start', timestamp);
  });

// Print the collection to verify that the "system:time_start" property is being set
print(collection);

// Display the image
var visParams = {bands: ['B4', 'B3', 'B2'], max: 3000};
Map.centerObject(point, 12);
Map.addLayer(collection.median(), visParams, 'Median RGB');

// Add water mask
var waterThreshold = 1200; // adjust this threshold as per your requirements
var ndwi = collection
  .map(function(image) {
    return image.normalizedDifference(['B3', 'B8']).rename('NDWI');
  })
  .median();
var waterMask = ndwi.lt(waterThreshold); // create a mask for pixels below threshold
Map.addLayer(waterMask.updateMask(waterMask), {palette:'blue'}, 'Water mask');

// Load the GLEAM dataset and filter by date
var gleam = ee.ImageCollection('JRC/GSW1_2/YearlyHistory')
    .filter(ee.Filter.date('2020-01-01', '2022-12-31'))
    .select('waterClass');

// Define the colors to use for each water class
var colors = ['white', 'blue', 'lightblue', 'green', 'yellow', 'orange', 'red', 'brown'];

// Add the groundwater level mapping to the map
var glMapping = gleam.max().visualize({palette: colors});
Map.addLayer(glMapping, {}, 'Groundwater Level Mapping');

// Reduce the water mask to a single value representing the percentage of the area covered by water
var waterPercentage = waterMask.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: point,
  scale: 10,
  maxPixels: 1e9
}).get('NDWI');

// Print the water percentage to the console
print('Water percentage:', waterPercentage);

// Create a chart showing the groundwater level over time
var chart = ui.Chart.image.series({
  imageCollection: collection,
  region: point,
  reducer: ee.Reducer.mean(),
  scale: 10,
  xProperty: 'system:time_start' // Use 'system:time_start' as the x-axis property
}).setOptions({
  title: 'Groundwater Level over Time',
  vAxis: {title: 'Groundwater Level (dB)'},
  hAxis: {title: 'Date'},
  lineWidth: 1,
  pointSize: 3
});

// Display the chart
print(chart);
