# Varuna Springs: Groundwater Analysis in Nepal

Welcome to the Varuna Springs project repository. This project focuses on analyzing the impact of solar irrigation systems on groundwater resources in Nepal and exploring the feasibility of using remote sensing satellite systems for reliable groundwater monitoring.

## Table of Contents

- [Introduction](#introduction)
- [Project Objectives](#project-objectives)
- [Approach](#approach)
- [Setup](#setup)
- [Usage](#usage)
  - [ndvi_analysis.js](#ndvi_analysisjs)
  - [groundwater_level.js](#groundwater_leveljs)
- [License](#license)

## Introduction

This project aims to analyze the impact of solar irrigation systems on groundwater resources in Nepal using satellite data. The analysis focuses on identifying correlations between traditional groundwater measurements and space-based observations, leveraging three years of existing research and data.

## Project Objectives

1. Determine the impact of solar irrigation systems on groundwater resources.
2. Explore the feasibility of using remote sensing satellite systems for reliable groundwater monitoring.
3. Identify correlations between traditional groundwater measurements and space-based observations.

## Approach

### Groundwater Measurement Data
Utilized existing groundwater measurement data collected manually over the past three years to establish a baseline for our analysis.

### Satellite Data
Leveraged Earth Observation satellites to gather information based on vegetation patterns, which are critical for understanding the groundwater cycle.

### Analysis
Two main scripts were developed to perform the analysis:
1. **ndvi_analysis.js**: Analyzes NDVI values using Sentinel-2 data.
2. **groundwater_level.js**: Analyzes groundwater levels using Sentinel-2 and GLEAM data.

## Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/Groundwater-Analysis-Nepal.git
    cd Groundwater-Analysis-Nepal
    ```

2. Open the code files in Google Earth Engine to run the analysis.

## Usage

### ndvi_analysis.js

This script analyzes NDVI values using Sentinel-2 data.

1. Open `code/ndvi_analysis.js` in Google Earth Engine.
2. The script sets the center of the map to the desired location.
3. Loads the Sentinel-2 image collection.
4. Defines a function to calculate NDVI for each image.
5. Calculates mean NDVI for specified time periods.
6. Displays the results on the map.
7. Creates a chart of mean NDVI values over time.

### groundwater_level.js

This script analyzes groundwater levels using Sentinel-2 and GLEAM data.

1. Open `code/groundwater_level.js` in Google Earth Engine.
2. The script defines a region of interest as a point.
3. Loads the Sentinel-2 Surface Reflectance collection.
4. Displays the image.
5. Adds a water mask.
6. Loads the GLEAM dataset and filters by date.
7. Adds the groundwater level mapping to the map.
8. Creates a chart showing the groundwater level over time.

## License

This project is licensed under the MIT License.

---

### Contact

For any inquiries or collaboration opportunities, please contact sreechandh2204@gmail.com.
