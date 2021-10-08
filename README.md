# Dream Clean Stream project
This project is developed for Space Apps 2021 Toyohashi<br>
https://2021.spaceappschallenge.org/challenges/statements/leveraging-aiml-for-plastic-marine-debris/teams/dream-clean-stream/project

## Sample Codes
The scripts are working on Google Earth Engine. Please check the following URLs.<br>
#### Ocean Samples
* Atami landslide location <br>
Google Earth Engine https://code.earthengine.google.com/ea302f9d16846283321d1f800fb94d75 <br>
Google Colaboratory https://colab.research.google.com/drive/1M33BPuBllM3rqL2r03wCHNKM-XJYOTkr?usp=sharing <br>
* Kaga port, Shimane prefecture <br>
Google Earth Engine https://code.earthengine.google.com/3d58a4378171d3fe6e3b35d620826b50 <br>
  
#### River Samples
* Katsuragawa (Arashiyama - Katsura, Kyoto prefecture)<br>
Google Earth Engine https://code.earthengine.google.com/3b2580172653743e3618f5d6d504f54a<br>

## Modification Guideline
To apply our code to your interest, please change the following properties. In our codes, those properties are listed below of the comment `/*** Start of main program ***/`.
#### Location
You can change the location with the function `Map.setCenter(lon,lat)`.
#### Date
You can change the target date and the comparing (background) date with variables `str_day` `end_day` `tg_year` `bg_year` or more directly with variables `date_str` `date_end` `bg_str` `bg_end` in `'YYYY-MM-DD'` format.

# Acknowledgements
Python version working on Google Colaboratory is developed by ぴっかりん.
