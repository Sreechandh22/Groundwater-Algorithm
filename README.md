# Groundwater-Algorithm
The algorithm accurately detects and tracks changes in groundwater levels using remote sensing indices such as LSWI, NDVI, and NDWI. 
Map.setCenter(84.255, 27.675, 12);

var
geometry = ee.Geometry.Point(84.25616666666667, 27.675);

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

// Define a function to calculate LSWI for each image
function addLSWI(image) {
  var lswi = image.normalizedDifference(['B8', 'B11']).rename('LSWI');
  return image.addBands(lswi);
}

// Map over the image collection and calculate NDVI and LSWI for each image
var s2_with_ndvi_lswi = s2.map(addNDVI).map(addLSWI);

// Calculate mean NDVI and LSWI for two time periods
var start_date = '2020-01-01';
var end_date1 = '2020-06-30';
var end_date2 = '2020-12-31';

var mean_ndvi1 = s2_with_ndvi_lswi
    .filterDate(start_date, end_date1)
    .select('NDVI')
    .mean();
    
var mean_ndvi2 = s2_with_ndvi_lswi
    .filterDate(end_date1, end_date2)
    .select('NDVI')
    .mean();
    
var mean_lswi1 = s2_with_ndvi_lswi
    .filterDate(start_date, end_date1)
    .select('LSWI')
    .mean();
    
var mean_lswi2 = s2_with_ndvi_lswi
    .filterDate(end_date1, end_date2)
    .select('LSWI')
    .mean();

// Calculate the difference between the two mean NDVI and LSWI values
var ndvi_diff = mean_ndvi2.subtract(mean_ndvi1);
var lswi_diff = mean_lswi2.subtract(mean_lswi1);

// Create binary masks of healthy and stressed vegetation areas using threshold values
var ndvi_mask = ndvi_diff.gt(0.2);
var lswi_mask = lswi_diff.gt(0.1);

// Display the results on the map
Map.addLayer(mean_ndvi1, {min: 0, max: 1}, 'Mean NDVI 1');
Map.addLayer(mean_ndvi2, {min: 0, max: 1}, 'Mean NDVI 2');
Map.addLayer(ndvi_diff, {min: -0.2, max: 0.2, palette: ['red', 'white', 'green']}, 'NDVI Difference');
Map.addLayer(ndvi_mask, {palette: 'red, green'}, 'NDVI Mask');

Map.addLayer(mean_lswi1, {min: 0, max: 1}, 'Mean LSWI 1');
Map.addLayer(mean_lswi2, {min: 0, max: 1}, 'Mean LSWI 2');
Map.addLayer(lswi_diff, {min: -0.2, max: 0.2, palette: ['red', 'white', 'green']}, 'LSWI Difference');
Map.addLayer(lswi_mask, {palette: 'red, green'}, 'LSWI Mask');

// Add legend
var legend = ui.Panel({
  style: {
    position: 'bottom-left'
  }
});

var NDVI_legend = ui.Label({
  value: 'NDVI Difference',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});
legend.add(NDVI_legend);

var makeRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: '#' + color,
      // Use padding to give the box height and width.
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(makeRow('FF0000', 'Negative difference'));
legend.add(makeRow('FFFFFF', 'No difference'));
legend.add(makeRow('00FF00', 'Positive difference'));

legend.add(ui.Label());
legend.add(ui.Label({
  value: 'NDVI Mask',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
}));

legend.add(makeRow('FF0000', 'Below threshold'));
legend.add(makeRow('00FF00', 'Above threshold'));

legend.add(ui.Label());
legend.add(ui.Label({
  value: 'LSWI Difference',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
}));

legend.add(makeRow('FF0000', 'Negative difference'));
legend.add(makeRow('FFFFFF', 'No difference'));
legend.add(makeRow('00FF00', 'Positive difference'));

legend.add(ui.Label());
legend.add(ui.Label({
  value: 'LSWI Mask',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
}));

legend.add(makeRow('FF0000', 'Below threshold'));
legend.add(makeRow('00FF00', 'Above threshold'));

Map.add(legend);

// Define the Sentinel-2 image collection
var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
          .filterDate('2020-01-01', '2020-12-31')
          .filterBounds(ee.Geometry.Point([84.255, 27.675]))
          .filterMetadata('CLOUD_COVERAGE_ASSESSMENT', 'less_than', 10);

// Define a function to calculate NDVI
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['B8', 'B4']).rename('NDVI'));
}

// Map the function over the image collection
var s2_with_ndvi = s2.map(addNDVI);

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

// Load the Landsat 8 surface reflectance collection
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
                  .filterBounds(geometry)
                  .filterDate('2015-01-01', '2021-12-31')
                  .filter(ee.Filter.calendarRange(6,8,'month'));

// Select the NDWI band from each image
var ndwiCollection = collection.map(function(image) {
  var ndwi = image.normalizedDifference(['B3', 'B5']).rename('NDWI');
  return image.addBands(ndwi);
});

// Create a time series chart of NDWI difference
var ndwiDiffChart = ui.Chart.image.series({
  imageCollection: ndwiCollection.select('NDWI'),
  region: geometry,
  reducer: ee.Reducer.mean(),
  scale: 30,
}).setOptions({
  title: 'NDWI Difference Over Time',
  vAxis: {title: 'NDWI Difference'},
  hAxis: {title: 'Date', format: 'YYYY-MM', gridlines: {count: 7}},
});

print(ndwiDiffChart);

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
