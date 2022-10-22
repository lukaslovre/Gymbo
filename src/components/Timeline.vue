<template>
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

  <div id="timelineBody">
    <div class="firstRow" :style="{ width: `${friendsList.length * 30 - 5}%` }">
      <p v-for="friend in friendsList" :key="friend" class="nameInFirstRow">
        {{ friend }}
      </p>
    </div>
    <div class="schedule">
      <div
        class="timeStamp"
        :style="{ width: `${20 + friendsList.length * 30}%` }"
      >
        <p>00:00</p>
        <p>01:00</p>
        <p>02:00</p>
        <p>03:00</p>
        <p>04:00</p>
        <p>05:00</p>
        <p>06:00</p>
        <p>07:00</p>
        <p>08:00</p>
        <p>09:00</p>
        <p>10:00</p>
        <p>11:00</p>
        <p>12:00</p>
        <p>13:00</p>
        <p>14:00</p>
        <p>15:00</p>
        <p>16:00</p>
        <p>17:00</p>
        <p>18:00</p>
        <p>19:00</p>
        <p>20:00</p>
        <p>21:00</p>
        <p>22:00</p>
        <p>23:00</p>
      </div>
      <div class="events">
        <div
          class="event"
          v-for="(time, index) in times"
          :key="index"
          :style="{
            top: `calc(${time.start} * 60 / 1440 * 100%)`,
            height: `calc(${time.duration} * 60 / 1440 * 100%)`,
            left: `calc(20% + ${time.index} * 30%)` /* 30% = width+margin */,
          }"
        ></div>
      </div>
    </div>
  </div>

  <button id="editScheduleBtn" @click="$router.push('set-time')">
    Edit Your Schedule
  </button>
</template>

<script>
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "@vue/runtime-core";

export default {
  name: "Timeline",
  setup() {
    const store = useStore();
    const db = getFirestore();

    const times = ref([]);
    const friendsList = ref([]); //lista username-ova
    const today = new Date();
    const stringDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let daySelector = ref(today.getDay());
    let allScheduleDocs = []; //user store info

    const user = computed(() => store.state.user); //user store info

    const getTimes = async () => {
      try {
        // kreira listu sa prijateljima
        const userDocSnap = await getDoc(doc(db, "users", user.value.uid));
        let friendUids = [user.value.uid, ...userDocSnap.data().friends];
        console.log("friendUids:", friendUids);

        // ucitava schedule svakog prijatelja
        allScheduleDocs = [];
        for (let i = 0; i < friendUids.length; i++) {
          const docSnap = await getDoc(doc(db, "schedules", friendUids[i]));
          if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            friendsList.value.push(docSnap.data().username);
            allScheduleDocs.push(docSnap.data());
            getTimesFromScheduleDoc(docSnap.data(), i);
          } else {
            console.log("No such document!");
          }
        }
        console.log(times.value);
      } catch (e) {
        console.error(e);
      }
    };

    getTimes();

    const timeToHours = (time) => {
      const splitTime = time.split(":");
      return parseInt(splitTime[0]) + parseFloat(splitTime[1] / 60);
    };

    const daySelectorDecrease = () => {
      if (daySelector.value == 1) {
        daySelector.value = 8;
      }
      daySelector.value--;
      store.commit("setSelectedDay", daySelector.value);
      times.value = [];
      for (let i = 0; i < friendsList.value.length; i++) {
        getTimesFromScheduleDoc(allScheduleDocs[i], i);
      }
    };
    const daySelectorIncrease = () => {
      if (daySelector.value == 7) {
        daySelector.value = 0;
      }
      daySelector.value++;
      store.commit("setSelectedDay", daySelector.value);
      times.value = [];
      for (let i = 0; i < friendsList.value.length; i++) {
        getTimesFromScheduleDoc(allScheduleDocs[i], i);
      }
    };

    const getTimesFromScheduleDoc = (dbData, userIndex) => {
      if (daySelector.value == 1) {
        if (dbData.Monday.length != 0) {
          for (let i = 0; i < dbData.Monday.length; i++) {
            const tempTime = {
              index: userIndex,
              start: timeToHours(dbData.Monday[i].timeStart),
              duration: dbData.Monday[i].timeDuration / 60,
            };
            times.value.push(tempTime);
          }
        }
      } else if (daySelector.value == 2) {
        if (dbData.Tuesday.length != 0) {
          for (let i = 0; i < dbData.Tuesday.length; i++) {
            const tempTime = {
              index: userIndex,
              start: timeToHours(dbData.Tuesday[i].timeStart),
              duration: dbData.Tuesday[i].timeDuration / 60,
            };
            times.value.push(tempTime);
          }
        }
      } else if (daySelector.value == 3) {
        if (dbData.Wednesday.length != 0) {
          for (let i = 0; i < dbData.Wednesday.length; i++) {
            const tempTime = {
              index: userIndex,
              start: timeToHours(dbData.Wednesday[i].timeStart),
              duration: dbData.Wednesday[i].timeDuration / 60,
            };
            times.value.push(tempTime);
          }
        }
      } else if (daySelector.value == 4) {
        if (dbData.Thursday.length != 0) {
          for (let i = 0; i < dbData.Thursday.length; i++) {
            const tempTime = {
              index: userIndex,
              start: timeToHours(dbData.Thursday[i].timeStart),
              duration: dbData.Thursday[i].timeDuration / 60,
            };
            times.value.push(tempTime);
          }
        }
      } else if (daySelector.value == 5) {
        if (dbData.Friday.length != 0) {
          for (let i = 0; i < dbData.Friday.length; i++) {
            const tempTime = {
              index: userIndex,
              start: timeToHours(dbData.Friday[i].timeStart),
              duration: dbData.Friday[i].timeDuration / 60,
            };
            times.value.push(tempTime);
          }
        }
      } else if (daySelector.value == 6) {
        if (dbData.Saturday.length != 0) {
          for (let i = 0; i < dbData.Saturday.length; i++) {
            const tempTime = {
              index: userIndex,
              start: timeToHours(dbData.Saturday[i].timeStart),
              duration: dbData.Saturday[i].timeDuration / 60,
            };
            times.value.push(tempTime);
          }
        }
      } else if (daySelector.value == 7) {
        if (dbData.Sunday.length != 0) {
          for (let i = 0; i < dbData.Sunday.length; i++) {
            const tempTime = {
              index: userIndex,
              start: timeToHours(dbData.Sunday[i].timeStart),
              duration: dbData.Sunday[i].timeDuration / 60,
            };
            times.value.push(tempTime);
          }
        }
      }

      /*
      else if (daySelector.value  == 2) return dbData.Tuesday;
      else if (daySelector.value  == 3) return dbData.Wednesday;
      else if (daySelector.value  == 4) return dbData.Thursday;
      else if (daySelector.value  == 5) return dbData.Friday;
      else if (daySelector.value  == 6) return dbData.Saturday;
      else if (daySelector.value  == 7) return dbData.Sunday;
      */
    };
    /*
    onMounted(() => {
      const scrollElement = document.querySelector("#timelineBody");
      console.log(scrollElement.scrollWidth);
    });
      */

    return {
      times,
      friendsList,
      stringDays,
      daySelector,
      daySelectorDecrease,
      daySelectorIncrease,
    };
  },
};
</script>

<style>
#dateSelector {
  margin: 2rem auto;
  padding: 0.75rem 1rem;
  width: 93.75%;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.375rem;
  box-shadow: 0px 0px 0.5rem rgba(0, 0, 0, 0.125);

  color: #3c3c3c;
  font-weight: 500;
  font-size: 1.375rem;
}
#dateSelector > img {
  width: 2.75rem;
  padding: 0.25rem;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 0.375rem rgba(0, 0, 0, 0.25);
}

#timelineBody {
  margin: auto;
  background-color: white;

  width: 22rem; /*staviti sa media query razlicite sirine za ekrane*/
  padding: 2rem;

  overflow-x: scroll;
}

.firstRow {
  display: flex;
  justify-content: space-between;
  margin-left: 20%;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}
.nameInFirstRow {
  text-align: center;
}
.timeStamp {
  width: 100%;
}
.timeStamp > p {
  height: 2.5rem;
  /*width: 125%; izracunati width na temelju broja korisnika*/
  border-top: 1px solid rgb(199, 193, 212);
}

.schedule {
  position: relative;
}

.event {
  --start: 12;
  --duration: 1;

  width: 25%;
  background-color: rgba(156, 132, 218, 0.5);
  position: absolute;
  border-top: solid 2.5rem rgba(156, 132, 218, 0.75);
  border-bottom: solid 2.5rem rgba(156, 132, 218, 0.75);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  /*
  left: 15%;
  top: calc(var(--start) * 60 / 1440 * 100%);
  height: calc(var(--duration) * 60 / 1440 * 100%);
  */

  border-radius: 0.5rem;
}

#editScheduleBtn {
  display: block;
  margin: 2rem auto;
  padding: 0.375em 1em;
  background-color: #7067cf;
  box-shadow: 0 0 0.25rem #7067cf;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5f5f5;

  transition: transform 100ms ease;
}

#editScheduleBtn:active {
  transform: scale(0.9);
}
</style>
