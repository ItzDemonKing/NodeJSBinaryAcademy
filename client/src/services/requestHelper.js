const apiUrlDeployed = "https://bsa2024-lecturenodejs.onrender.com/api";
const useProductionDeployedBackend = false;
let apiUrl = useProductionDeployedBackend
  ? apiUrlDeployed
  : "http://localhost:3333/api";
const headersMap = new Map();
let baseHeaders = { "Content-Type": "application/json" };

export const get = async (entityName, id = "") => {
  return await makeRequest(`${entityName}/${id}`, "GET");
};

export const post = async (entityName, body) => {
  return await makeRequest(entityName, "POST", body);
};

export const patch = async (entityName, id, body) => {
  return await makeRequest(`${entityName}/${id}`, "PATCH", body);
};

export const deleteReq = async (entityName, id) => {
  return await makeRequest(`${entityName}/${id}`, "DELETE");
};

const makeRequest = async (path, method, body) => {
  if (headersMap.has("x-access-token") && headersMap.has("x-user-id")) {
    baseHeaders["x-access-token"] = headersMap.get("x-access-token");
    baseHeaders["x-user-id"] = headersMap.get("x-user-id");
  }
  try {
    const url = `${apiUrl}/${path}`;
    const res = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: { ...baseHeaders },
    });

    const dataObj = await res.json();

    if (res.ok) {
      const headers = res.headers;
      if (headers.has("x-access-token")) {
        headersMap.set("x-access-token", headers.get("x-access-token"));
      }
      if (headers.has("x-user-id")) {
        headersMap.set("x-user-id", headers.get("x-user-id"));
      }
      return dataObj;
    }

    alert(`${dataObj.message}`);
    return dataObj;
  } catch (err) {
    console.error(err);
  }
};
