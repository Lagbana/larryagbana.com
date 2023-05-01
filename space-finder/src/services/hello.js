exports.main = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello Peeps! This table is called ${process.env.TABLE_NAME}`,
    }),
  };
};
