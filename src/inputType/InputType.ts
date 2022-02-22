import { Axis } from "../AxisManager";
import { AxesOption } from "../Axes";
import { ActiveInput } from "../types";
import { MouseEventInput } from "../eventInput/MouseEventInput";
import { TouchEventInput } from "../eventInput/TouchEventInput";
import { PointerEventInput } from "../eventInput/PointerEventInput";
import { TouchMouseEventInput } from "../eventInput/TouchMouseEventInput";
import { SUPPORT_POINTER_EVENTS, SUPPORT_TOUCH } from "../eventInput/EventInput";

export interface IInputType {
	axes: string[];
	element: HTMLElement;
	mapAxes(axes: string[]);
	connect(observer: IInputTypeObserver): IInputType;
	disconnect();
	destroy();
	enable?();
	disable?();
	isEnable?(): boolean;
}

export interface IInputTypeObserver {
	options: AxesOption;
	get(inputType: IInputType): Axis;
	change(inputType: IInputType, event, offset: Axis, useDuration?: boolean);
	hold(inputType: IInputType, event);
	release(inputType: IInputType, event, velocity: number[], inputDuration?: number);
}

export function toAxis(source: string[], offset: number[]): Axis {
	return offset.reduce((acc, v, i) => {
		if (source[i]) {
			acc[source[i]] = v;
		}
		return acc;
	}, {});
}

export function convertInputType(inputType: string[] = []): ActiveInput {
	let hasTouch = false;
	let hasMouse = false;
	let hasPointer = false;

	inputType.forEach(v => {
		switch (v) {
			case "mouse": hasMouse = true; break;
			case "touch": hasTouch = SUPPORT_TOUCH; break;
			case "pointer": hasPointer = SUPPORT_POINTER_EVENTS;
			// no default
		}
	});
	if (hasPointer) {
		return new PointerEventInput();
	} else if (hasTouch && hasMouse) {
		return new TouchMouseEventInput();
	} else if (hasTouch) {
		return new TouchEventInput();
	} else if (hasMouse) {
		return new MouseEventInput();
	}
	return null;
}
