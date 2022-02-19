module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			spacing: {
				"7/10": "70%",
				"9/10": "90%",
			},
			colors: {
				modal: "rgba(0, 0, 0, 0.5)",
				ppgreen: "#00795b",
				ppred: "#da2308",
			},
		},
	},
	plugins: [],
	corePlugins: {
		preflight: true,
	},
}
