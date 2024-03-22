
# SLDC Live

SLDC Live fetches real-time generation data for Maharashtra from SLDC Kalwa in image format. An Optical Character Recognition (OCR) model then processes the image to extract the data and store it in Firestore.

## Architecture
The image processing and data extraction service runs on Google Cloud Run. Eventarc triggers the FastAPI service every hour to process the SLDC Kalwa image and extract generation data for Maharashtra. The extracted data is then stored in Firestore with timestamps for easy retrieval.

[![My Skills](https://skillicons.dev/icons?i=gcp,react,redux,vite,firebase,)](https://skillicons.dev)


