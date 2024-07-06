import { availableDownloads } from "../commons/downloadOptions";
import { Timestamp } from "firebase/firestore";

export const latestFilteredData = {};

const initiateLastestFilteredData = () => {
  for (let d of availableDownloads) {
    latestFilteredData[d] = {
      values: [],
      timestamps: [],
    };
  }
};

// Initial data is in form of single object as a datapoint
// We have to take these datapoints and make it into array

/**
 * Calculates the difference between the last value in the given data array and the provided value.
 * If the last value is not a number, it checks the previous value.
 * If the difference is less than half of the last value, it returns the provided value.
 * Otherwise, it returns NaN.
 *
 * @param {Array} data - The array of values.
 * @param {string|number} value - The value to compare with the last value in the data array.
 * @return {number|NaN} The provided value if it's difference with the last value is less than half of the last value, or NaN otherwise.
 */
export const clipDifference = (data, value) => {
  const lastIndex = data.length - 1;
  if (lastIndex < 0 || isNaN(parseFloat(value))) return parseFloat(value);

  let last = data[lastIndex];
  if (isNaN(last) && lastIndex > 0) last = data[lastIndex - 1];
  if (isNaN(last)) return parseFloat(value);

  const diff = last - parseFloat(value);
  return Math.abs(diff) < last * 0.5 ? parseFloat(value) : NaN;
};

/**
 * Calculates the average of the given array of numbers.
 *
 * @param {Array} nums - The array of numbers to calculate the average.
 * @return {number} The average of the numbers in the array.
 */
export const average = (nums) => {
  return (
    nums.reduce((sum, num) => (isNaN(num) ? sum : sum + num), 0) /
    nums.filter(isNaN).length
  );
};

export const isNaN = (num) => Number.isNaN(num);

/**
 * Filters the given array by replacing values that have differences more than half the average
 * with NaN.
 *
 * @param {Array} arr - The array to be filtered.
 * @return {void} This function does not return a value.
 */
export const filterArray = (arr) => {
  const avg = average(arr);
  for (let i = 0; i < arr.length; i++) {
    if (!isNaN(arr[i])) {
      let diff = arr[i] - avg;
      diff = diff < 0 ? diff * -1 : diff;
      if (diff > avg) {
        arr[i] = NaN;
      }
    }
  }
};

export const filterDifference = (chartData) => {
  for (let dataset of chartData.data.datasets) {
    filterArray(dataset.data);
  }
};

/**
 * 1. Converts each data point to an array form
 * 2. Filters the resulting array
 * 3. Works for only stats fields in the document object
 * 4. Sets the latestFilteredData objects which can be used afterwords
 *
 * @param {Array} docs - The array of documents to process.
 * @param {Array} fields - The fields to check for in each document.
 * @return {void} This function does not return a value.
 */
export const preprocessDocs = (docs, fields) => {
  // Create object with timestamp and values for each category from doc/datapoint
  // Each doc is collection of many datapoints at a single timestamp
  // Collect each data point in an array object
  // The schema of the resulting object should be fixed

  // Initialize latestFilteredData to hold the latest filtered data
  initiateLastestFilteredData();

  // Iterate through each doc
  for (let doc of docs) {
    let ts = new Timestamp(doc.created_at.seconds, doc.created_at.nanoseconds);
    ts = ts
      .toDate()
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Iterate through each datapoint and add the field
    for (let field of fields) {
      // Value from the document
      const docValue = doc["stats"].filter((i) => i.name == field)[0].value;

      // Compare the value with the latest filtered value to see if it is consistent
      const value = clipDifference(latestFilteredData[field].values, docValue);

      latestFilteredData[field].values.push(value);
      latestFilteredData[field].timestamps.push(ts);
    }

    // Iterate throught the fields to filter the data and set NaN to inconsistent data

    for (let field of fields) {
      filterArray(latestFilteredData[field].values);
    }
  }
};
