require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/allowedOptions");
const connectDb = require("./config/dbConn");
const mongoose = require("mongoose");
const { logEvents, logger } = require("./middleware/logger");
const PORT = process.env.PORT || 3500;

console.log(process.env.DATABASE_URI);

mongoose.set('strictQuery',true);
connectDb();


app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

// router
app.use(require("./routes/userRoutes"));
app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

// mongodb listeners
mongoose.connection.once("open", () => {
  console.log("Connected to mongodb");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.once('error', err=>{
    console.error(err);
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log')
})
