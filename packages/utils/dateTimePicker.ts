export const getCurrAdjacentMonth = () => {
	const date = new Date();
	const leftYear = date.getFullYear();
	const leftMonth = date.getMonth() + 1;
	let rightYear = leftYear;
	let rightMonth = leftMonth + 1;
	if (leftMonth === 12) {
		rightMonth = 1;
		rightYear = rightYear + 1;
	}

	return {
		leftYear,
		leftMonth,
		rightYear,
		rightMonth,
	};
};

export const timeFormat = (time: number) => {
	return time < 10 ? "0" + time : time;
};

/**
 * 时间戳格式
 * @param time
 * @returns
 */
export const dateFormat = (time: number) => {
	const { year, month, day } = getTimeUtils(time);

	return year + "-" + month + "-" + day;
};

/**
 * 日期时间格式化
 * @param dateTime
 * @returns
 */
export const dateTimeFormat = (dateTime: Date) => {
	const { year, month, day, hour, minu, seco } = getTimeUtils(dateTime);

	return year + "-" + month + "-" + day + " " + hour + ":" + minu + ":" + seco;
};

/**
 * 初始化日期时间选择器的面板
 * @param dateTime
 * @returns
 */
export const initCalendarPanel = (dateTime: Date[]) => {
	const { year: leftYear, month: leftMonth } = getTimeUtils(dateTime[0]);
	const { year: rightYear, month: rightMonth } = getTimeUtils(dateTime[1]);

	let midRightYear = 0;
	let midRightMonth = 0;
	// 当选择的开始日期和结束日期的年和月相同时 月份+1 如果月份12 年份同时+1
	if (leftYear === rightYear && leftMonth === rightMonth) {
		if (rightMonth === "12") {
			midRightYear = rightYear + 1;
			midRightMonth = 1;
		} else {
			midRightMonth = Number(rightMonth) + 1;
		}
	}
	return {
		leftYear,
		leftMonth,
		rightYear: midRightYear,
		rightMonth: midRightMonth,
	};
};

/**
 * 初始化时间 获取当前初始化时间的年、月、日、时、分、秒
 * @param time
 * @returns
 */
export const getTimeUtils = (time: number | Date) => {
	const date = new Date(time);
	const year = date.getFullYear();
	const month = timeFormat(date.getMonth() + 1);
	const day = timeFormat(date.getDate());

	const hour = timeFormat(date.getHours());
	const minu = timeFormat(date.getMinutes());
	const seco = timeFormat(date.getSeconds());

	return {
		year,
		month,
		day,
		hour,
		minu,
		seco,
	};
};

/**
 * 日期组件左侧点击
 * @param month
 * @param year
 * @returns
 */
export const unlinkBefore = (month: number, year: number) => {
	if (month <= 0) {
		month = 12;
		year--;
	}
	return {
		month,
		year,
	};
};

/**
 * 日期组件右侧点击
 * @param month
 * @param year
 * @returns
 */
export const unlinkAfter = (month: number, year: number) => {
	if (month > 12) {
		month = 1;
		year++;
	}
	return {
		month,
		year,
	};
};

/**
 * 获取本月第一天是周几
 * @param year
 * @param month
 * @returns
 */
export const getCurrMonthFirstDay = (year: number, month: number) => {
	const date = new Date(year, month - 1, 1);
	return date.getDay();
};

/**
 * 获取本月有多少天
 * @param year
 * @param month
 * @returns
 */
export const getCurrMonthDayCount = (year: number, month: number) => {
	const date = new Date(year, month, 0);
	return date.getDate();
};

/**
 * 获取上个月在当前页面显示的天数
 * @param year
 * @param month
 * @returns
 */
export const getPrevMonthRestDays = (year: number, month: number) => {
	let days = getCurrMonthFirstDay(year, month);
	let lastDate = getCurrMonthDayCount(year, month - 1);
	if (days === 0) {
		days = 7;
	}
	let restDays: number[] = [];
	while (restDays.length < days) {
		restDays.push(lastDate--);
	}
	return restDays.reverse();
};

/**
 * 获取下一个月在当前页显示的天数
 * @param year
 * @param month
 * @returns
 */
export const getNextMonthRestDays = (year: number, month: number) => {
	const prevMonthRestDayCount = getPrevMonthRestDays(year, month).length;
	const currMonthDayCount = getCurrMonthDayCount(year, month);
	const nextMonthRestDayCount = 42 - prevMonthRestDayCount - currMonthDayCount;
	const restDays: number[] = [];

	for (let i = 1; i <= nextMonthRestDayCount; i++) {
		restDays.push(i);
	}

	return restDays;
};

export interface IDate {
	value: number;
	category: string;
	timestamp: number;
}
/**
 * 获取当前月页面需要显示的全部日期
 * @param year
 * @param month
 * @returns
 */
export const getCurrPageDays = (year: number, month: number) => {
	const prevDays = getPrevMonthRestDays(year, month);
	let currMonthList: number[] = [];
	const currMonthDays = getCurrMonthDayCount(year, month);
	for (let i = 1; i <= currMonthDays; i++) {
		currMonthList.push(i);
	}
	const nextDays = getNextMonthRestDays(year, month);
	const objPrevDays: IDate[] = prevDays.map((item) => {
		const date = year + "-" + (month - 1) + "-" + item;
		return {
			value: item,
			category: "prev",
			timestamp: new Date(date).getTime(),
		};
	});

	const objCurrMonthList: IDate[] = currMonthList.map((item) => {
		const date = year + "-" + month + "-" + item;
		return {
			value: item,
			category: "curr",
			timestamp: new Date(date).getTime(),
		};
	});

	const objNextDays: IDate[] = nextDays.map((item) => {
		const date = year + "-" + (month + 1) + "-" + item;
		return {
			value: item,
			category: "next",
			timestamp: new Date(date).getTime(),
		};
	});

	return [...objPrevDays, ...objCurrMonthList, ...objNextDays];
};

/**
 * 用来处理点击上个月或下个月的日期
 * @param td
 * @param year
 * @param month
 * @returns
 */
export const clickPrevOrNext = (td: IDate, year: number, month: number) => {
	if (td.category === "prev") {
		if (month === 1) {
			year--;
			month = 12;
		} else {
			month--;
		}
	}

	if (td.category === "next") {
		if (month === 12) {
			year++;
			month = 1;
		} else {
			month++;
		}
	}

	return {
		month,
		year,
	};
};

/**
 * 日期数组转时间戳数组
 * @param dateArr
 * @returns
 */
export const dateArrayToTimeStampArray = (dateArr: Date[]) => [
	dateToTimeStamp(dateArr[0]),
	dateToTimeStamp(dateArr[1]),
];

/**
 * 日期转时间戳
 * @param sinDate
 * @returns
 */
export const dateToTimeStamp = (sinDate: Date) => new Date(sinDate).getTime();
