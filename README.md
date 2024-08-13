# SLDC Live
The application SLDC Live monitors, records, and offers analysis of the demand and generation of energy in the state of Maharashtra.

It accomplishes that by fusing several frameworks and technologies. Each job in the program consists of multiple subtasks.

A detailed explanation of each step and its operation is provided below.

Frontend - https://github.com/devnev39/sldc-live

OCR Backend - https://github.com/devnev39/sldc-live-back

ML Backend - https://github.com/devnev39/sldc-back-ml

## Table of content

- [Features](#Features)
- [Data collection](#Data-collection)
- [Data download](#Data-download)
- [Deep learning model for prediction](#Deep-learning-model-for-prediction)
- [Prediction and statistics](#Prediction-and-statistics)
- [Automated deep learning pipeline](#Automated-deep-learning-pipeline)
- [Usage](#Usage)
- [Contact](#Contact)

## Features
- **Realtime** demand and consumption data.
- **Prediction** and **analysis** of the saved data.
- Comprehensive **breakdown of generation data up to the last 15 days**.
- Upto **15 days of data for normal viewing**.
- Upto **300 days of data for training deep learning models and statistics**.
- **Fully automated deep learning model pipeline with Cloud run and Scheduler.**
- **Fully automated data scraping pipeline with Cloud run, Scheduler and Firebase.**
- **7-day cycle of automated training** the deep learning model.
- **Responsive design** of all kind of devices - Phones, Tablet, Desktop.


## Data collection

The first step is always to obtain the data, which is done by scanning a SCADA system picture from the website of the state load dispatch centre (SLDC), which has all the information on the generation, breakdown, and consumption of energy.

The data is then processed and saved in firebase database for future viewing and model training.

For showing all of the data like breakdown of the generation, 15-days data collection is used. For deep learning model training 300 days worth of data is stored which inclued few parameters only.

The data is captured each hour in a day. So in a day there are 24 observations. 

[![My Skills](https://skillicons.dev/icons?i=firebase,gcp,docker)](https://skillicons.dev)

## Data download
The scraped data is accessible to everyone. Visit the application at https://sldc-live.vercel.app and click the download icon in the top right corner. You can download up to 15 days of data from the "Normal" tab for standard viewing. For data intended for ML/AI purposes, switch to the "Data for ML/AI" tab to download the relevant datasets.

## Deep learning model for prediction

The deep learning model is used to predict / forecast load demand curve. The default model used in this project is a simple **LSTM model** which is trained with **Tensorflow**. The model is **fine tuned** with latest data **each monday**. **The model training and fine tuning pipeline is fully automated with Cloud run, Cloud scheduler, github releases.**

For **extra configuration of model parameters** such as epochs, batch size, window size of data, and model version, a config database is used which provides configuration for the whole application.

The model is trained in python Tensorflow and used in react frontend. For this **onnx** is used which allows cross platoform use of any deep learning model with it's graph based inference.

**Trained models** can be found in the application's analysis section and also in the following github profile's release history. The releases contain both onnx and keras model for trying out.

[SLDC Back ML](https://www.github.com/devnev39/sldc-back-ml)
## Prediction and statistics

The application provides forecasts for today's and tomorrow's state demand. In "today" mode, you can compare the forecasted data with the actual data, allowing you to assess the model's performance. In "tomorrow" mode, only the predictions are displayed.

The predictions are generated each time the analysis page is rendered, rather than being cached, allowing users to see how the model has learned and adapted to the demand patterns in real-time.

Additionally, the model's parameters can be viewed in the "Model Properties" section.


## Automated deep learning pipeline

The model is retrained every Monday using the latest data. Each week, we can either fine-tune an existing model or create and train a new one, although training multiple models simultaneously is not currently supported.

This process utilizes Cloud Run and Cloud Scheduler. The training configurations are stored in Firebase, allowing users to edit them and monitor the model's performance across different parameters.

[![My Skills](https://skillicons.dev/icons?i=firebase,gcp,docker,tensorflow)](https://skillicons.dev)
## Usage

This application can be used to study how load demand fluctuates throughout the day. By analyzing these patterns, electrical engineering students can gain a deeper understanding of how state load demand changes and how our extensive electrical infrastructure manages this critical aspect of daily life. It is fascinating to see how such a vital component can be streamlined with the help of data.

While natural factors significantly impact our electric grid, simple forecasting models can still provide valuable insights into load demand under normal conditions.

Students and professors can use this application to observe the real-time dynamics of our electrical infrastructure.
## Tech Stack

### Frontend

[![My Skills](https://skillicons.dev/icons?i=react,redux,vite,githubactions)](https://skillicons.dev)


### Backend & Deep Learning

[![My Skills](https://skillicons.dev/icons?i=fastapi,firebase,gcp,tensorflow,docker,github)](https://skillicons.dev)
## Contact

Bhuvanesh Bonde

[LinkedIn](https://linkedin.com/in/bhuvanesh-bonde)

devnev39@gmail.com

bhuvaneshbonde9@gmail.com

