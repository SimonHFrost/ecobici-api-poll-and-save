# Ecobici Api Poll And Save

This repo contains a Github Action that queries the Ecobici General Bikeshare Feed Specification (GBFS) at (https://ecobici.cdmx.gob.mx/en/open-data/)[https://ecobici.cdmx.gob.mx/en/open-data/] and saves a snapshot of data.

## Data

Station status over time is saved in the folder `data/station_status`, filename is timestamp of the snapshot data.

Data range is from 05/04/24 to 22/04/24. Hopefully this will help infer daily/weekly trends.

All other files are scripts created to help retrieve data.