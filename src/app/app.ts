import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import * as constants from "./constants";
import { toSignal } from "@angular/core/rxjs-interop";

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

	public values = toSignal(this.form.valueChanges, {
		initialValue: this.form.value,
	});

	public direction = signal<"to right" | "to bottom">("to right");

	public constants = constants;

	public rotate(): void {
		this.direction.set(
			this.direction() === "to right" ? "to bottom" : "to right"
		);
	}

	public reset(): void {
		window.location.reload();
	}
}
