const rectangularColorSpaces = [
	"srgb", // blue bug
	"srgb-linear", // too light
	"display-p3", // same as "srbg"
	"a98-rgb", // 1% lighter than "srbg"
	"prophoto-rgb", // too light
	"rec2020", // blue bug
	"lab", // blue bug, red bug
	"oklab",
	"xyz-d50", // too light
	"xyz-d65", // alias "xyz", too light
] as const;

const polarColorSpaces = [
	"hsl", // too grey & extra colors
	"hwb", // too light & extra colors
	"lch", // extra colors
	"oklch", // blue bug, red bug
] as const;

const hueInterpolationMethods = [
	"shorter hue",
	// "longer hue", // specific use-case
	// "increasing hue", // specific use-case
	// "decreasing hue", // specific use-case
] as const;

export const allInterpolationMethods = [
	...rectangularColorSpaces,
	...polarColorSpaces.flatMap((space) =>
		hueInterpolationMethods.map((method) => `${space} ${method}`)
	),
] as const;

const colorStopSpaces = [
	"rgb",
	"hsl",
	"lab", // extra colors
	"lch", // extra colors
	"oklab",
	"oklch", // extra colors
] as const;

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
