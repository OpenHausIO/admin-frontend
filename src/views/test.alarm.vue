<template>
    <div>

        <div class="time-selector">
            <div class="scroll-selector">
                <label for="hours">Hour:</label>
                <div class="scroll-list" @scroll="updateHour" ref="hourList">
                    <div v-for="h in 24" :key="h" class="scroll-item" :class="{ selected: h - 1 === hour }">
                        {{ h - 1 }}
                    </div>
                </div>
            </div>

            <div class=" scroll-selector">
                <label for="minutes">Minute:</label>
                <div class="scroll-list" @scroll="updateMinute" ref="minuteList">
                    <div v-for="m in 60" :key="m" class="scroll-item" :class="{ selected: m - 1 === minute }">
                        {{ m - 1 }}
                    </div>
                </div>
            </div>
        </div>

        <div class="day-selector">
            <div v-for="(day, index) in days" :key="index" class="day-circle"
                :class="{ selected: selectedDays.includes(index + 1) }" @click="toggleDay(index + 1)">
                {{ day }}
            </div>
        </div>

        <div class="text-center">

            {{ hour }} - {{ minute }}
            <br />
            {{ selectedDays }}

        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            selectedDays: [],
            hour: 0,
            minute: 0
        };
    },
    methods: {
        toggleDay(day) {
            if (this.selectedDays.includes(day)) {
                this.selectedDays = this.selectedDays.filter(selectedDay => selectedDay !== day);
            } else {
                this.selectedDays.push(day);
            }
        },
        updateHour() {
            const scrollTop = this.$refs.hourList.scrollTop;
            const itemHeight = this.$refs.hourList.firstElementChild.offsetHeight;
            this.hour = Math.round(scrollTop / itemHeight);
        },
        updateMinute() {
            const scrollTop = this.$refs.minuteList.scrollTop;
            const itemHeight = this.$refs.minuteList.firstElementChild.offsetHeight;
            this.minute = Math.round(scrollTop / itemHeight);
        }
    },
    mounted() {
        // Center the scroll position initially
        this.$refs.hourList.scrollTop = this.hour * this.$refs.hourList.firstElementChild.offsetHeight;
        this.$refs.minuteList.scrollTop = this.minute * this.$refs.minuteList.firstElementChild.offsetHeight;
    }
};
</script>

<style scoped>
.time-selector {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
    align-items: center;
}

.scroll-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.scroll-list {
    width: 60px;
    height: 120px;
    overflow-y: scroll;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
    scroll-behavior: smooth;
}

.scroll-item {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
}

.scroll-item.selected {
    background-color: #007bff;
    color: white;
    font-weight: bold;
}

.day-selector {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
}

.day-circle {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #f0f0f0;
    color: #333;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.day-circle.selected {
    background-color: #007bff;
    color: white;
}

.day-circle:hover {
    background-color: #d6e0f5;
}
</style>
