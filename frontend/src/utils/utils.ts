import cogoToast from "cogo-toast";

type ToastType = "loading" | "success" | "error" | "warn";
type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right"
	| undefined;
interface ToastOptions {
	position?: ToastPosition;
	[key: string]: any;
}
export const toast = (
	type: ToastType,
	message: string,
	options: ToastOptions = {}
): any => {
	return cogoToast[type](message, {
		position: "top-left",
		...options,
	});
};
