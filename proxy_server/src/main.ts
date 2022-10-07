import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";

const app = express();

const UI_URL = "http://0.0.0.0:82";
const API_URL = "http://0.0.0.0:2001";

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

app.use(
	"/api",
	createProxyMiddleware({
		target: API_URL,
		changeOrigin: false,
		pathRewrite: {
			[`^/api`]: ""
		}
	})
);

app.use(
	"/",
	createProxyMiddleware({
		target: UI_URL,
		changeOrigin: false,
		pathRewrite: {
			[`^/`]: "",
		},
	})
);

const httpServer = http.createServer(app);
let httpsServer: https.Server


httpServer.listen(80, () => {
	console.log(`Starting HTTP Proxy on port : ${80}`);
});
