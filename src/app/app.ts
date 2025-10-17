import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";

import { debounceTime } from "rxjs";

import * as constants from "./constants";
import Color from "colorjs.io";

@Component({
	selector: "app-root",
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	protected readonly title = signal("gradient");

	private fb = inject(FormBuilder);

	public form = this.fb.group({
		startColor: ["#ffffff", [Validators.required]],
		endColor: ["#0000ff", [Validators.required]],
	});

	private values = toSignal(this.form.valueChanges.pipe(debounceTime(50)), {
		initialValue: this.form.value,
	});

	public direction = signal<"to right" | "to bottom">("to right");

	public constants = constants;

	public rotate(): void {
		this.direction.set(this.direction() === "to right" ? "to bottom" : "to right");
	}

	public reset(): void {
		window.location.reload();
	}

	public getGradient(method: string, space: string): string {
		const direction = this.direction();
		let startColor = new Color(this.values().startColor as string).to(
			legendColorJS[space as keyof typeof legendColorJS]
		);
		let endColor = new Color(this.values().endColor as string).to(
			legendColorJS[space as keyof typeof legendColorJS]
		);

		let c1 = startColor.toString({ precision: 3 });
		let c2 = endColor.toString({ precision: 3 });

		if (space === "srgb") {
			c1 = `color(srgb ${startColor.srgb["r"]} ${startColor.srgb["g"]} ${startColor.srgb["b"]})`;
			c2 = `color(srgb ${endColor.srgb["r"]} ${endColor.srgb["g"]} ${endColor.srgb["b"]})`;
		}

		return `linear-gradient(${direction} in ${method}, ${c1}, ${c2})`;
	}
}

// npm package "colorjs" had color space labels different than in CSS spec,
// this is just a mapping object for colorjs, while "srgb" space has an
// exception and is built manually.
const legendColorJS = {
	"rgb": "srgb", // CSS function rgb()
	"hsl": "hsl", // CSS function hsl(), browser automatically converts it to rgb()
	"lab": "lab", // CSS function lab()
	"lch": "lch", // CSS function lch()
	"oklab": "oklab", // CSS function oklab()
	"oklch": "oklch", // CSS function oklch()
	"srgb": "srgb", // CSS function color() with color space argument "srgb"
	"srgb-linear": "srgb-linear", // CSS function color() with color space argument "srgb-linear"
	"display-p3": "p3", // CSS function color() with color space argument "display-p3"
	"a98-rgb": "a98rgb", // CSS function color() with color space argument "a98-rgb"
	"prophoto-rgb": "prophoto", // CSS function color() with color space argument "prophoto-rgb"
	"rec2020": "rec2020", // CSS function color() with color space argument "rec2020"
	"xyz-d50": "xyz-d50", // CSS function color() with color space argument "xyz-d50"
	"xyz-d65": "xyz-d65", // CSS function color() with color space argument "xyz-d65"
} as const;
