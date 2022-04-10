<template>
  <h1>Set time</h1>
  <button @click="timeInputCounter++">New time period</button>
  <form id="timeEnterForm" @submit.prevent="handleSubmit">
    <label for="date">Date</label>
    <input type="date" name="date" id="date" required v-model="dateInput" />
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
  getFirestore,
  Timestamp,
} from "@firebase/firestore";
import { useStore } from "vuex";

export default {
  name: "SetTimeView",
  setup() {
    const db = getFirestore();
    const store = useStore();

    let timeInputCounter = ref(1);
    let startTimeInput = ref([]);
    let endTimeInput = ref([]);
    const dateInput = ref();

    const user = computed(() => store.state.user);

    const loadInitialTimes = async () => {
      const docSnap = await getDoc(doc(db, "schedules", user.value.uid));
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());

        // OVDJE FILTRIRATI SAMO ONE KOJE SU NA DANASNJI DATUM

        // na homeView treba odabrani datum staviti u store i onda
        // ga izvuci ovdje za filtraciju
        //const selectedDateTimesets = docsnap.data().schedules.filter()

        timeInputCounter.value = docSnap.data().schedules.length;
        console.log(timeInputCounter.value);
        //postavljanje ucitanih values-a u input
        for (let i = 0; i < timeInputCounter.value; i++) {
          startTimeInput.value[i] = docSnap.data().schedules[i].timeStart;
          endTimeInput.value[i] = docSnap.data().schedules[i].timeEnd;
        }
      }
    };
    loadInitialTimes();

    const handleSubmit = () => {
      let schedule = { schedules: [] };

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
        schedule.schedules[i] = {
          date: Timestamp.fromDate(new Date(dateInput.value)),
          timeStart: startTimeInput.value[i],
          timeEnd: endTimeInput.value[i],
          timeDuration: tempDuration,
        };
      }
      // ako su sva vremena validna, posalji u DB
      setDoc(doc(db, "schedules", user.value.uid), schedule).catch((e) => {
        console.error("Error adding document: ", e);
      });
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
      dateInput,
      startTimeInput,
      endTimeInput,
      timeInputCounter,
      handleSubmit,
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
  width: 80%;
  margin: auto;
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
