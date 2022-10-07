module.exports = {
	apps: [
		{
			name: "ui",
			script: "cd ./ui && npm run start"
		},
		{
			name: "api",
			script: "cd ./api && npm run start"
		},
		{
			name: "proxy",
			script: "cd ./proxy_server && npm run start"
		}
	]
};
