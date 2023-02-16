module.exports = {
	apps: [
		{
			name: "lb-ui",
			script: "cd ./ui && npm run start"
		},
		{
			name: "lb-api",
			script: "cd ./api && npm run start"
		},
		{
			name: "lb-proxy",
			script: "cd ./proxy_server && npm run start"
		}
	]
};
