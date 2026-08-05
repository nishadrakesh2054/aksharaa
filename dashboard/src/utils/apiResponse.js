export const listFromResponse = (responseData, keys = []) => {
  for (const key of keys) {
    if (Array.isArray(responseData?.[key])) return responseData[key];
    if (Array.isArray(responseData?.data?.[key])) return responseData.data[key];
  }

  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData)) return responseData;
  return [];
};

export const itemFromResponse = (responseData, keys = []) => {
  for (const key of keys) {
    if (responseData?.[key] && !Array.isArray(responseData[key])) return responseData[key];
    if (responseData?.data?.[key] && !Array.isArray(responseData.data[key])) {
      return responseData.data[key];
    }
  }

  if (responseData?.data && !Array.isArray(responseData.data)) return responseData.data;
  return responseData || {};
};
