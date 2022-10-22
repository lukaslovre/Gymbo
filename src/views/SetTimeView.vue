<template>
  <h1>Set time</h1>
  <button @click="timeInputCounter++">New time period</button>
  <form id="timeEnterForm" @submit.prevent="handleSubmit">
    <div id="dateSelector">
      <img
        src="../assets/leftArr.svg"
        alt="previous day"
        @click="daySelectorDecrease"
      />
      <p>{{ stringDays[daySelector - 1] }}</p>
      <img
        src="../assets/rightArr.svg"
        alt="next day"
        @click="daySelectorIncrease"
      />
    </div>

    <div
      class="timeInputSection"
      v-for="index in timeInputCounter"
      :key="index"
    >
      <label :for="`startTime${index}`">Start time</label>
      <input
        type="time"
        :name="`startTime${index}`"
        :id="`startTime${index}`"
        v-model="startTimeInput[index - 1]"
        required
      />

      <label :for="`endTime${index}`">End time</label>
      <input
        type="time"
        :name="`endTime${index}`"
        :id="`endTime${index}`"
        v-model="endTimeInput[index - 1]"
        required
      />
      <button @click.prevent="removeTimeInput(`${index}`)">
        Remove time period
      </button>
    </div>
    <button>Send</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getFirestore,
  Timestamp,
} from "@firebase/firestore";
import { useStore } from "vuex";

export default {
  name: "SetTimeView",
  setup() {
    const db = getFirestore();
    const store = useStore();

    let timeInputCounter = ref(0);
    let startTimeInput = ref([]);
    let endTimeInput = ref([]);
    const stringDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let daySelector = ref();
    let docData = [];

    const user = computed(() => store.state.user);
    const storeSelectedDay = computed(() => store.state.selectedDay);
    daySelector.value = storeSelectedDay.value;

    const getArrayLenOfDay = (numDay, dbData) => {
      if (numDay == 1) return dbData.Monday.length;
      else if (numDay == 2) return dbData.Tuesday.length;
      else if (numDay == 3) return dbData.Wednesday.length;
      else if (numDay == 4) return dbData.Thursday.length;
      else if (numDay == 5) return dbData.Friday.length;
      else if (numDay == 6) return dbData.Saturday.length;
      else if (numDay == 7) return dbData.Sunday.length;
    };
    const getArrayOfDay = (numDay, dbData) => {
      if (numDay == 1) return dbData.Monday;
      else if (numDay == 2) return dbData.Tuesday;
      else if (numDay == 3) return dbData.Wednesday;
      else if (numDay == 4) return dbData.Thursday;
      else if (numDay == 5) return dbData.Friday;
      else if (numDay == 6) return dbData.Saturday;
      else if (numDay == 7) return dbData.Sunday;
    };

    const loadInitialTimes = async () => {
      const docSnap = await getDoc(doc(db, "schedules", user.value.uid));
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        docData = docSnap.data();

        // OVDJE FILTRIRATI SAMO ONE KOJE SU NA DANASNJI DATUM

        // na homeView treba odabrani datum staviti u store i onda

        timeInputCounter.value = getArrayLenOfDay(
          daySelector.value,
          docSnap.data()
        );
        console.log(timeInputCounter.value);
        //postavljanje ucitanih values-a u input
        for (let i = 0; i < timeInputCounter.value; i++) {
          const arrayOfDay = getArrayOfDay(daySelector.value, docSnap.data());
          startTimeInput.value[i] = arrayOfDay[i].timeStart;
          endTimeInput.value[i] = arrayOfDay[i].timeEnd;
        }
      } else {
        console.log("Dokument schedules za trenutnog usera ne postoji!");
      }
    };
    loadInitialTimes();

    const updateTimes = async () => {
      startTimeInput.value = [];
      endTimeInput.value = [];
      timeInputCounter.value = getArrayLenOfDay(daySelector.value, docData);
      console.log(timeInputCounter.value);
      //postavljanje ucitanih values-a u input
      for (let i = 0; i < timeInputCounter.value; i++) {
        const arrayOfDay = getArrayOfDay(daySelector.value, docData);
        startTimeInput.value[i] = arrayOfDay[i].timeStart;
        endTimeInput.value[i] = arrayOfDay[i].timeEnd;
      }
    };

    const daySelectorDecrease = () => {
      if (daySelector.value == 1) {
        daySelector.value = 8;
      }
      daySelector.value--;
      updateTimes();
    };
    const daySelectorIncrease = () => {
      if (daySelector.value == 7) {
        daySelector.value = 0;
      }
      daySelector.value++;
      updateTimes();
    };

    const handleSubmit = async () => {
      let schedule = [];

      for (let i = 0; i < timeInputCounter.value; i++) {
        console.log(
          i + "-> " + startTimeInput.value[i] + " i " + endTimeInput.value[i]
        );
        if (
          timeToNum(startTimeInput.value[i]) >= timeToNum(endTimeInput.value[i])
        ) {
          alert("Start time must be before End time");
          return;
        }
        const tempDuration = getTimeDuration(
          startTimeInput.value[i],
          endTimeInput.value[i]
        );
        schedule.push({
          timeStart: startTimeInput.value[i],
          timeEnd: endTimeInput.value[i],
          timeDuration: tempDuration,
        });
      }
      // ako su sva vremena validna, posalji u DB
      console.log(schedule);

      updateDbWithTimes(schedule);
    };

    const updateDbWithTimes = async (schedule) => {
      try {
        const userSchedDoc = doc(db, "schedules", user.value.uid);
        if (daySelector.value == 1) {
          await updateDoc(userSchedDoc, { Monday: schedule });
        } else if (daySelector.value == 2) {
          await updateDoc(userSchedDoc, { Tuesday: schedule });
        } else if (daySelector.value == 3) {
          await updateDoc(userSchedDoc, { Wednesday: schedule });
        } else if (daySelector.value == 4) {
          await updateDoc(userSchedDoc, { Thursday: schedule });
        } else if (daySelector.value == 5) {
          await updateDoc(userSchedDoc, { Friday: schedule });
        } else if (daySelector.value == 6) {
          await updateDoc(userSchedDoc, { Saturday: schedule });
        } else if (daySelector.value == 7) {
          await updateDoc(userSchedDoc, { Sunday: schedule });
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    const removeTimeInput = (index) => {
      timeInputCounter.value--;
      startTimeInput.value.splice(index - 1, 1);
      endTimeInput.value.splice(index - 1, 1);
    };
    const timeToNum = (time) => {
      let timeSplit = time.split(":");
      return timeSplit[0] * 60 + parseInt(timeSplit[1]);
    };
    const getTimeDuration = (start, end) => {
      //console.log("Start: " + timeToNum(start));
      //console.log("End: " + timeToNum(end));
      return timeToNum(end) - timeToNum(start);
    };

    return {
      stringDays,
      daySelector,
      startTimeInput,
      endTimeInput,
      timeInputCounter,
      handleSubmit,
      daySelectorDecrease,
      daySelectorIncrease,
      removeTimeInput,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 2.5rem 0 4rem 0;
}

#timeEnterForm {
  text-align: center;
}
.timeInputSection {
  margin-bottom: 5rem;
}
label {
  display: block;
  font-size: 1.5rem;
  margin: 2rem 0 0.5rem 0;
}
input {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1.25rem;
  color: #3c3c3c;
  padding: 0.325em 0.625em;
}
button {
  display: block;
  margin: auto;
}
</style>
