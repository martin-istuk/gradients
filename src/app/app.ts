import { Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";

import { debounceTime } from "rxjs";
import Color from "colorjs.io";

import * as constants from "./constants";

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

	public showBorders = false;
	public direction = "to right";

	public constants = constants;

	public columnCount = signal(constants.allColorSpaces.length + 1);
	public rowCount = signal(constants.allInterpolationMethods.length + 1);

	public rotate(): void {
		this.direction = this.direction === "to right" ? "to bottom" : "to right";
	}

	public reset(): void {
		window.location.reload();
	}

	public borders(): void {
		this.showBorders = !this.showBorders;
	}

	public getColorFunctionLabel(space: string): string {
		const dedicatedCssColorFunctions: Array<string> = [...this.constants.colorStopSpaces];
		return dedicatedCssColorFunctions.includes(space) ? `${space}()` : `color('${space}')`;
	}

	private table = viewChild.required<ElementRef<HTMLDivElement>>("table");

	public removeColorStop(space: string): void {
		const table = this.table().nativeElement;
		Array.from(table.children).forEach((element) => {
			const div = element as HTMLDivElement;
			const dataSpace = div.attributes.getNamedItem("data-space")?.value;
			if (dataSpace === `space-${space}`) {
				div.remove();
			}
		});
		this.columnCount.set(this.columnCount() - 1);
	}

	public removeColorMethod(method: string): void {
		const table = this.table().nativeElement;
		Array.from(table.children).forEach((element) => {
			const div = element as HTMLDivElement;
			const dataMethod = div.attributes.getNamedItem("data-method")?.value;
			if (dataMethod === `method-${method}`) {
				div.remove();
			}
		});
		this.rowCount.set(this.rowCount() - 1);
	}

	public getGradient(method: string, space: string): string {
		console.log("getGradient()");
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

		return `linear-gradient(${this.direction} in ${method}, ${c1}, ${c2})`;
	}
}

// npm package "colorjs" has color space labels different than in CSS spec,
// this is just a mapping object for colorjs, while "srgb" space has an
// exception and is built manually.
const legendColorJS = {
	"rgb": "srgb", // CSS function rgb()
	"hsl": "hsl", // CSS function hsl(),
	"hwb": "hwb", // CSS function hwb(),
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
