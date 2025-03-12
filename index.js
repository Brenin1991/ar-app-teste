const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

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