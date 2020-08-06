const url = 'http://localhost:3000/api';

const getOptions = (reqBody: any) => {
  let bearer_token = 'k33WS-aqnuHAFX2ak__4n';
  const bearer = 'Bearer ' + bearer_token;
  const options = {
    method: 'POST',
    headers: { Authorization: bearer, 'Content-Type': 'application/json' },
    body: JSON.stringify(reqBody),
  };
  return options;
};

export const post = async (reqBody: any) => {
  return await fetch(url, getOptions(reqBody)).then((response) =>
    response.json()
  );
};
