const express = require("express");

const AppError = require("./utils/AppError");
const routes = require("./routes");


const app = express();
app.use(express.json());

app.use(routes);

app.use((error, request, response, next)  => {
  if(error instanceof AppError) {
    response.status(error.statuCode).json({
      status: "Error.",
      message: error.message
    });
  };

  console.error(error);

  response.status(500).json({
    status: "Error.",
    message: "Internal-Server-Error"
  });
});

const PORT = 3333;
app.listen(PORT, () => { console.log(`Server is running on port: ${PORT}`) });