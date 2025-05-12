// for scalability and reuse of code, in case n params have to be checked, we create a combined array of all params to be their existence checked
export function checkEveryParamExistence(...params) {
  return params.every(
    (param) => param !== null && param !== undefined && param !== ""
  );
}

export function checkAtLeastOneParamExist(...params) {
  return params.some((param) => param !== null && param !== undefined);
}

export function filterOnlyExistingParams(ojbParams, currentObj) {
  let copyObject = {};
  for (let prop in ojbParams) {
    if (
      ojbParams[prop] !== null &&
      ojbParams[prop] !== undefined &&
      ojbParams[prop] !== ""
    ) {
      copyObject[prop] = ojbParams[prop];
    }
  }

  //we only over write existing values or keep them as them was
  return { ...currentObj, ...copyObject };
}

export function emailToLowerCased(email) {
  return email.toLowerCase();
}
