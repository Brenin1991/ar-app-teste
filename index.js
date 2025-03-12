const express = require("express");
const path = require("path");
const os = require("os");
const compression = require("compression");
const expressStaticGzip = require("express-static-gzip");

const app = express();
const PORT = 3000;

app.use(compression());

app.use("/", expressStaticGzip(path.join(__dirname, "public"), {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    serveStatic: {
        setHeaders: (res, path) => {
            if (path.endsWith(".br")) {
                res.setHeader("Content-Encoding", "br");
                res.setHeader("Content-Type", "application/javascript");
            } else if (path.endsWith(".gz")) {
                res.setHeader("Content-Encoding", "gzip");
                res.setHeader("Content-Type", "application/javascript");
            }
        }
    }
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address;
            }
        }
    }
    return "localhost";
};

const localIP = getLocalIP();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em:
    - Local: http://localhost:${PORT}
    - Rede: http://${localIP}:${PORT}`);
});
