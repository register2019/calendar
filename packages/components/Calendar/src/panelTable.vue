<template>
	<div :class="['dc-panel', props.calendarParams.distinguish]">
		<div class="dc-panel-title">{{ props.calendarParams.title }}</div>
		<table :class="['dc-panel-table']">
			<tbody>
				<tr v-for="(tds, index) in props.calendarParams.tds" :key="index">
					<td class="dc-panel-table-td" v-for="td in tds" :key="td.timestamp">
						<div>
							<span :class="[dateColor(td.category, td.timestamp)]">
								{{ td.value }}
							</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
import { log } from "console";
import { ref, reactive, watch, onMounted, computed } from "vue";
import { getTimeUtils } from "../../../utils";
import { Panel } from "./constants";
type Props = {
	calendarParams: Panel;
};

const props = defineProps<Props>();

const dateColor = (params: string, ts: number) => {
	const { year, month, day } = getTimeUtils();
	const currTimeStamp = new Date(`${year}-${month}-${day}`).getTime();
	console.log(params, ts, currTimeStamp, ts === currTimeStamp);
	if (params === "prev" || params === "next") {
		return "dc-isNotCurrMonth";
	} else if (params === "curr" && ts === currTimeStamp) {
		return "dc-isCurrDay";
	}
};
</script>
<style lang="scss" scoped>
.dc-panel {
	width: 50%;
	&-title {
		text-align: center;
	}
	&-table {
		width: 100%;
		cursor: pointer;
		&-td {
			width: 32px;
			height: 30px;
			padding: 4px 0;
			box-sizing: border-box;
			text-align: center;
			position: relative;
		}
	}
}
.is-left {
	border-right: 1px solid #e4e7ed;
}
.dc-isNotCurrMonth {
	color: #a8abb2;
}
.dc-isCurrDay {
	color: #409eff;
}
</style>
