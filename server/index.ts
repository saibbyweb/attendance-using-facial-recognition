import { server, port, environment, dbConnect, mongoose } from "@server/helpers/essentials";
mongoose.set("debug", (collectionName, method, query, doc) => {
  if(collectionName === 'collections' && method !== 'aggregate' && method !== 'findOne' && method !== 'find')
    console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});

const history = require("connect-history-api-fallback");

const { app } = server;
app.set("trust proxy", true);
server.enableCorsIfNeeded();

let httpsApp = null;

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log("🔘 " + req.method + ": " + req.url);
    next();
  });
}

// app.use("/", (req, res) => {
//   res.send('WORKING BRO');
// });

/* serve static spa build */
server.applyStaticMiddleware("/frontend");

// app.use(
//   history({
//     disableDotRule: true,
//     verbose: true,
//   })
// );

server.applyStaticMiddleware("/frontend");

/* connect to mongodb */
dbConnect();

app.get("/api", (req, res) =>
  res.send("Hi from typescript and esrun. why is it so fast")
);

const running = `ExpressJS running on http://localhost:${port} - Environment: ${environment}`;

function start() {
  app.listen(port, () => console.log(running));
}


start();