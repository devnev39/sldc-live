import { availableDownloads } from "../commons/downloadOptions";
import { Timestamp } from "firebase/firestore";
import * as XLSX from "xlsx";

const initiateLastestFilteredData = () => {
  const latestFilteredData = {};
  for (let d of availableDownloads) {
    latestFilteredData[d] = {
      values: [],
      timestamps: [],
    };
  }
  return latestFilteredData;
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
 * Converts a JSON array to a worksheet with an offset column.
 *
 * @param {Array} jsonArray - The JSON array to convert.
 * @param {number} startCol - The starting column index.
 * @return {Object} The converted worksheet.
 */
export const addToWorksheetWithOffset = (jsonArray, startCol) => {
  const worksheet = {};
  const headers = Object.keys(jsonArray[0]);
  headers.forEach((header, colIndex) => {
    const cellAddress = XLSX.utils.encode_cell({
      c: startCol + colIndex,
      r: 0,
    });
    worksheet[cellAddress] = { v: header, t: "s" };
  });
  jsonArray.forEach((row, rowIndex) => {
    Object.values(row).forEach((value, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({
        c: startCol + colIndex,
        r: rowIndex + 1,
      });
      worksheet[cellAddress] = {
        v: value,
        t: typeof value === "number" ? "n" : "s",
      };
    });
  });
  return worksheet;
};

/**
 * Takes filtered data and fields to generate a combined worksheet.
 *
 * @param {Object} filteredData - The filtered data object.
 * @param {Array} fields - The fields to generate the worksheet from.
 * @return {Object} The combined worksheet generated from the filtered data and fields.
 */
export const filteredDataToWorksheet = (filteredData, fields) => {
  let combinedWorkSheet = {};
  // let offset = 1;
  for (let i = 0; i < fields.length; i++) {
    console.log(fields[i]);
    console.log(filteredData[fields[i]]);
    combinedWorkSheet = {
      ...combinedWorkSheet,
      ...addToWorksheetWithOffset(filteredData[fields[i]], i == 0 ? 0 : i * 3),
    };
  }
  combinedWorkSheet["!ref"] = XLSX.utils.encode_range({
    s: { c: 0, r: 0 },
    e: { c: fields.length * 3 + 1, r: 26 },
  });
  return combinedWorkSheet;
};

// Convert multiple filteredData arrays to a xlsx workbook
export const filteredDataToWorkbook = (filteredData, fields) => {
  const workbook = XLSX.utils.book_new();
  for (let d of filteredData) {
    console.log(d);
    const worksheet = filteredDataToWorksheet(d, fields);
    console.log(worksheet);
    XLSX.utils.book_append_sheet(workbook, worksheet, d.timestamp);
  }
  return XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
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
  const latestFilteredData = initiateLastestFilteredData();

  // Iterate through each doc
  let date = NaN;
  for (let doc of docs) {
    let ts = new Timestamp(doc.created_at.seconds, doc.created_at.nanoseconds);
    date = ts.toDate().toDateString();
    ts = ts
      .toDate()
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Iterate through each datapoint and add the field
    for (let field of fields) {
      // Value from the document
      let docValue = NaN;
      if (field.toLowerCase() == "frequency") {
        docValue = doc.fields.frequency;
      } else {
        docValue = doc["stats"].filter((i) => i.name == field.toUpperCase())[0]
          .value;
      }
      // Compare the value with the latest filtered value to see if it is consistent
      const value = clipDifference(latestFilteredData[field].values, docValue);

      latestFilteredData[field].values.push(value);
      latestFilteredData[field].timestamps.push(ts);
    }
  }

  // Iterate throught the fields to filter the data and set NaN to inconsistent data
  for (let field of fields) {
    filterArray(latestFilteredData[field].values);
  }

  // Convert the object structure to another which is suitable to sheetjs
  for (let field of fields) {
    const values = latestFilteredData[field].values;
    const ts = latestFilteredData[field].timestamps;

    // Convert the object type to array
    latestFilteredData[field] = [];

    // fill the array with the values
    for (let i = 0; i < values.length; i++) {
      const object = {};
      object[field] = values[i];
      object["timestamp"] = ts[i];
      latestFilteredData[field].push(object);
    }
  }

  latestFilteredData.timestamp = date;
  console.log(latestFilteredData);
  return latestFilteredData;
};

export const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};
