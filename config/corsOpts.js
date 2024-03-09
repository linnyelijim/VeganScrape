const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
module.exports = corsOptions;

/* const whitelist = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://cloud.mongodb.com/",
  "http://linnyelijim-mbrecipes.herokuappcom",
];

const corsOptions = {
  //regulates CORS using whitelist
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.error("Origin not allowed by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
}; */
