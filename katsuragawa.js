/**
 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

function calcFDI(image) {
  var nirMod = image.select('B6')
              .add(image.select('B11').subtract(image.select('B6')))
              .multiply((8330-6650)/(1610-665));
  return image.select('B8').subtract(nirMod)
          .rename('FDI')
          .copyProperties(image,['system:time_start']);
}

function calcPI(image) {
  return image.select('B8').divide(image.select('B8').add(image.select('B4')))
          .rename('PI')
          .copyProperties(image,['system:time_start']);
}

function calcNDVI(image) {
  return (image.select('B8').subtract(image.select('B4')))
          .divide(image.select('B8').add(image.select('B4')))
          .rename('NDVI')
          .copyProperties(image,['system:time_start']);
}

/*** Start of main program ***/
var str_day = '07-01'
var end_day = '08-31'
var tg_year = '2021'
var bg_year = '2020'


var date_str = tg_year+'-'+str_day;
var date_end = tg_year+'-'+end_day;

var bg_str = bg_year+'-'+str_day;
var bg_end = bg_year+'-'+end_day;

var tg = ee.ImageCollection('COPERNICUS/S2')
  .filterDate(date_str, date_end)
  // Pre-filter to get less cloudy granules.
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);//.median();

var bg = ee.ImageCollection('COPERNICUS/S2')
  .filterDate(bg_str, bg_end)
  // Pre-filter to get less cloudy granules.
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);//.median();

var tg_med = tg.median();
var bg_med = bg.median();

// Adding FDI Floating Debris Index
tg_med = ee.Image.cat(tg_med,tg.map(calcFDI).median());
bg_med = ee.Image.cat(bg_med,bg.map(calcFDI).median());

// Adding PI Plastic Index
tg_med = ee.Image.cat(tg_med,tg.map(calcPI).median());
bg_med = ee.Image.cat(bg_med,bg.map(calcPI).median());

// Adding NDVI Normalized Difference Vegitation Index
tg_med = ee.Image.cat(tg_med,tg.map(calcNDVI).median());
bg_med = ee.Image.cat(bg_med,bg.map(calcNDVI).median());
print('tg_med',tg_med);

var diff = (tg_med.subtract(bg_med).divide(bg_med));
print('diff',diff);

var vis = {
  min: [-0.5,-2.0,-0.5], // 0.0
  max: [0.5,2.0,0.5], // 0.15
  //bands: ['B4', 'B3', 'B2'],
  //bands: ['B5', 'B6', 'B4'],
  //bands: ['B7', 'B11', 'B8'],
  bands:['PI','NDVI','FDI'],
};
var visopt = {
  min: 0.0,
  max: 0.15,
  //bands: ['B4', 'B3', 'B2'],
  //bands: ['B5', 'B6', 'B4'],
  //bands: ['B7', 'B11', 'B8'],
  bands:['B4','B3','B2'],
};

Map.setCenter(135.698060,34.998136,14);
Map.addLayer(tg_med, visopt,'rgb');
Map.addLayer(diff, vis,'indexDiff');
