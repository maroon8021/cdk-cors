exports.handler = () => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "hoge",
  };
};
