const rectangularColorSpaces = [
	"srgb",
	"srgb-linear",
	"display-p3",
	"a98-rgb",
	"prophoto-rgb",
	"rec2020",
	"lab",
	"oklab",
	"xyz-d50",
	"xyz-d65",
] as const;

const polarColorSpaces = ["hsl", "hwb", "lch", "oklch"] as const;

const hueInterpolationMethods = [
	// Default:
	// "shorter hue",
	// Specific use-case:
	// "longer hue",
	// "increasing hue",
	// "decreasing hue",
] as const;

export const allInterpolationSpaces = [
	...rectangularColorSpaces,
	// ...polarColorSpaces.flatMap((space) =>
	// 	hueInterpolationMethods.map((method) => `${space} ${method}`)
	// ),
	...polarColorSpaces,
] as const;

export const colorStopSpaces = ["rgb", "hsl", "hwb", "lab", "lch", "oklab", "oklch"] as const;

const cssColorFunctionSpaces = [
	"srgb",
	"srgb-linear",
	"display-p3",
	"a98-rgb",
	"prophoto-rgb",
	"rec2020",
	"xyz-d50",
	"xyz-d65", // alias "xyz"
] as const;

export const allColorSpaces = [...colorStopSpaces, ...cssColorFunctionSpaces] as const;
