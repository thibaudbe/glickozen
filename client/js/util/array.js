
/*
 * Array util functions that should feel familiar to scala developers.
 * None of these util functions mutate the source Array.
 */

/*
* Finds the first element of the array satisfying a predicate, or return undefined.
*/
export function find(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return arr[i];
  }
};

/*
* Flattens an Array of Arrays
*/
export function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push.apply(result, arr[i]);
  }
  return result;
};

/*
* Creates an array with all falsey values removed (false, null, 0, "", undefined, NaN)
*/
export function compact(arr) {
  return arr.filter(x => x);
};

/*
* Counts the number of items in the array which satisfy a predicate.
*/
export function count(arr, predicate) {
  return arr.filter(predicate).length;
};

/*
* Creates an array without any duplicate item.
* If a key function is passed, items will be compared based on the result of that function;
* if not, their string representation will be used.
*/
export function distinct(arr, keyFunction) {
  keyFunction = keyFunction || (x => x);

  let set = {};
  let result = [];

  arr.forEach(item => {
    let key = keyFunction(item);
    if (!set[key]) {
      set[key] = 1;
      result.push(item);
    }
  });

  return result;
};

/*
* Computes the difference of this array and another array.
* Returns an array containing the items of this array that are not also contained in the other array.
*/
export function diff(arr, other, keyFunction) {
  keyFunction = keyFunction || (x => x);

  let result = [];
  let otherKeys = toSet(other.map(keyFunction));

  arr.forEach(item => {
    if (!otherKeys[keyFunction(item)]) result.push(item);
  });

  return result;
};

/*
* Creates an object composed of keys generated from the results of running each element of arr through discriminator.
* The corresponding value of each key is an array of the elements responsible for generating the key.
*/
export function groupBy(arr, discriminator) {
  let groups = {};
  for (let i = 0; i < arr.length; i++) {
    let elem = arr[i];
    let key = discriminator(elem);
    if (!groups[key]) groups[key] = [];
    groups[key].push(elem);
  }
  return groups;
};

/*
* Finds index of first element satisfying some predicate.
*/
export function indexWhere(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
};

/*
* Inserts an element inside the Array
*/
export function insert(arr, index, elem) {
  const copy = arr.slice();
  copy.splice(index, 0, elem);
  return copy;
};

/*
* Maps the array with a function returning an Array and returns a flat Array.
*/
export function flatMap(arr, fn) {
  return flatten(arr.map(fn));
};

/*
* Finds the largest Number.
*/
export function max(arr) {
  return Math.max.apply(null, arr);
};

/*
* Returns a new Array with all instances of elem removed
*/
export function remove(arr, elem) {
  return arr.filter(x => x != elem);
};

/*
 * Remove the item at the specified index.
 */
export function removeAt(arr, indexToRemove) {
  return arr.filter((_, index) => index != indexToRemove);
}

/*
* Returns an Array of integers from start to stop (inclusive),
* incremented or decremented by step.
*/
export function range(start, stop, step) {
  if (arguments.length == 1) {
    stop = arguments[0] - 1;
    start = 0;
  }

  step = step || 1;

  let items = [];
  let next = start;
  let increasing = (step > 0);

  while ((increasing && next <= stop) || (!increasing && next >= stop)) {
    items.push(next);
    next = next + step;
  }

  return items;
};

/*
* Returns the sum of this array of Integers.
*/
export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
};

/*
* Selects first n elements.
*/
export function take(arr, n) {
  return arr.slice(0, n);
};

/*
* Selects last n elements.
*/
export function takeRight(arr, n) {
  return (arr.length < n)
    ? arr.slice(0)
    : arr.slice(arr.length - n);
};

/*
* Takes longest prefix of items that satisfy a predicate.
*/
export function takeWhile(arr, predicate) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) result.push(arr[i]);
    else break;
  }
  return result;
};

/*
* Returns a copy of this array with one single replaced element.
*/
export function updated(arr, index, elem) {
  if (index < 0) return arr;

  let copy = arr.slice();
  copy[index] = elem;
  return copy;
};

/*
* Converts this array into an object where the keys are the array elements
* (so they should be strings or have a proper toString method) and values are truthy.
*/
export function toSet(arr) {
  let result = {};
  for (let i = 0; i < arr.length; i++) {
    result[arr[i]] = true;
  }
  return result;
};

/*
* Reverses the array.
*/
export function reverse(arr) {
  let result = arr.slice();
  result.reverse();
  return result;
};

/*
* Returns a new sorted Array.
* The sort is stable.
*
* An option Object can be passed to modify the sort behavior.
* All options are compatible with each other.
* The supported options are:
*
* ignoreCase: Assuming strings are going to be sorted, ignore their cases. Defaults to false.
*
* localCompare: Assuming strings are going to be sorted,
*   handle locale-specific characters correctly at the cost of reduced sort speed. Defaults to false.
*
* by: Assuming objects are being sorted, a function either pointing to or computing the value
*   that should be used for the sort. Defaults to null.
*
* reverse: Reverse the sort. Defaults to false.
*/
export function sorted(arr, options) {
  let o = options || {},
    by = o.by !== undefined ? o.by : null,
    localeCompare = o.localeCompare !== undefined ? o.localeCompare : false,
    ignoreCase = o.ignoreCase !== undefined ? o.ignoreCase : false,
    reverse = o.reverse !== undefined ? o.reverse : false,
    result = [],
    mapped = [],
    missingData = [],
    sortFunction,
    item;

  for (let i = 0, length = arr.length; i < length; i++) {
    item = arr[i];

    if (by && item)
      item = by(item);

    if (item === null || item === undefined || item === '') {
      missingData.push(item);
      continue;
    }

    if (ignoreCase)
      item = item.toUpperCase();

    mapped.push({
      index: i,
      value: item
    });
  }

  if (localeCompare) {
    sortFunction = function(a, b) {
      if (a.value !== b.value) {
        return a.value.localeCompare(b.value);
      }
      return a.index < b.index ? -1 : 1;
    };
  }
  else {
    sortFunction = function(a, b) {
      if (a.value !== b.value) {
        return (a.value < b.value) ? -1 : 1;
      }
      return a.index < b.index ? -1 : 1;
    };
  }

  mapped.sort(sortFunction);

  for (let i = 0, length = mapped.length; i < length; i++) {
    result.push(arr[mapped[i].index]);
  }

  if (missingData.length)
    result = result.concat(missingData);

  if (reverse)
    result.reverse();

  return result;
};


/*
 * Converts an Array-like objects (such as the arguments or a NodeList) to a regular Array
 */
export function toArray(arrayLike) {
  return [].slice.call(arrayLike);
};
