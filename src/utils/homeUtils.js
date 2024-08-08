/**
 * lst: List of values
 * returns average of provided values neglecting NaN values
 */
export const getAverage = (lst) => {
  let size = lst.length;
  let sum = 0;
  for (let dp of lst) {
    if (dp && !isNaN(dp)) sum += dp;
    else size -= 1;
  }
  return Math.round(sum / size);
};

/**
 * data: List of values
 * Returns true if the last value has increased or false if decreased covering all posibilities
 * Returns: bool
 */
export const isIncreased = (data) => {
  let len = data.length;
  let val1 = data[len - 1];
  if (len == 1) return true;
  let val2 = data[len - 2];

  while (isNaN(val1) && len > 1) {
    val1 = data[--len];
  }
  while (isNaN(val2) && len > 1) {
    val2 = data[--len];
  }

  if (val1 >= val2) return true;
  return false;
};

/**
 * data: List of values
 * Returns the last non NaN value from the list
 */
export const getValue = (data) => {
  let len = data.length;
  let value = data[len - 1];
  while (isNaN(value) && len > 1) {
    value = data[--len];
  }
  return value;
};
