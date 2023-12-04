require("express-async-errors");
require("dotenv/config");

const express = require("express");

const AppError = require("./utils/AppError");
const routes = require("./routes");
const connectionDataBase = require("./database/sqlite");
const uploadsConfig = require("./configs/upload");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);
connectionDataBase();

app.use((error, request, response, next)  => {
  if(error instanceof AppError) {
    response.status(error.statusCode).json({
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

app.use("/files", express.static(uploadsConfig.UPLOADS_FOLDER));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server is running on port: ${PORT}`) });