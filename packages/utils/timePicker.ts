import { computed, InjectionKey, ref, Ref } from "vue";
import { getCurrTime } from "./useTime";
type HourList = {
	top: number;
	val: string;
};
export const ulList = [
	{
		count: 24,
		ulRef: ref(),
		liRef: ref(),
		currRef: ref(""),
		id: "hour",
	},
	{
		count: 60,
		ulRef: ref(),
		liRef: ref(),
		currRef: ref(""),
		id: "minu",
	},
	{
		count: 60,
		ulRef: ref(),
		liRef: ref(),
		currRef: ref(""),
		id: "seco",
	},
];

export const selectedTime = (
	targetRefs: Ref<any>,
	targetRef: Element,
	targetTime: Ref<any>,
	category: string
) => {
	let targetList: HourList[] = [];
	targetList = getLiList(targetRefs);

	switch (category) {
		case "hour":
			const hourTop =
				targetList.find(
					(item: { val: string }) => item.val === targetTime.value
				)?.top! - 65;

			targetRef.scrollTo({
				top: hourTop,
			});
			break;
		case "minu":
			let minuTop =
				targetList.find(
					(item: { val: string }) => item.val === targetTime.value
				)?.top! - 65;

			targetRef.scrollTo({
				top: minuTop,
			});
			break;
		case "seco":
			let secoTop =
				targetList.find(
					(item: { val: string }) => item.val === targetTime.value
				)?.top! - 65;

			targetRef.scrollTo({
				top: secoTop,
			});
			break;
		default:
			break;
	}

	targetRef.addEventListener("scroll", () => {
		targetTime.value = targetList.find(
			(item: { top: number }) => item.top > targetRef.scrollTop + 65
		)?.val!;
	});
};

export const getLiList = (targetRefs: Ref<any>) => {
	return targetRefs.value.map((item: any) => {
		return {
			top: item.offsetTop,
			val: item.innerText,
		};
	});
};
