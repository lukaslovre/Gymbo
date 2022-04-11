<template>
  <div id="dateSelector">
    <h1>- test +</h1>
  </div>
  <div id="actionButtons">
    <img src="../assets/group-icon.svg" alt="show/hide users" />
    <router-link to="/set-time">
      <img src="../assets/edit-icon.svg" alt="edit time" />
    </router-link>
  </div>
  <div id="timelineBody">
    <div class="firstRow">
      <p v-for="friend in friendsList" :key="friend.uid">
        {{ friend.nickname }}
      </p>
    </div>
    <div class="schedule">
      <div class="timeStamp">
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
            left: `calc(20% + ${time.index} * 40%)`,
          }"
        ></div>
      </div>
    </div>
  </div>
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
    const friendsList = ref();

    const user = computed(() => store.state.user); //user store info

    const getTimes = async () => {
      // kreira listu sa prijateljima
      const userDocSnap = await getDoc(doc(db, "users", user.value.uid));
      let friendUids = [
        { uid: user.value.uid, nickname: userDocSnap.data().username },
      ];
      userDocSnap
        .data()
        .friends.forEach((friend) =>
          friendUids.push({ uid: friend.uid, nickname: friend.nickname })
        );
      friendsList.value = friendUids;

      // ucitava schedule svakog prijatelja
      for (let i = 0; i < friendUids.length; i++) {
        const docSnap = await getDoc(doc(db, "schedules", friendUids[i].uid));
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          docSnap.data().schedules.forEach((time) => {
            const tempTime = {
              index: i,
              start: timeToHours(time.timeStart),
              duration: time.timeDuration / 60,
            };
            times.value.push(tempTime);
          });
        } else {
          console.log("No such document!");
        }
      }
      console.log(times.value);
    };

    getTimes();

    const timeToHours = (time) => {
      const splitTime = time.split(":");
      return parseInt(splitTime[0]) + parseFloat(splitTime[1] / 60);
    };
    /* 
    onMounted(() => {
      const scrollElement = document.querySelector("#timelineBody");
      console.log(scrollElement.scrollWidth);
    });
      */

    return { times, friendsList };
  },
};
</script>

<style>
#dateSelector {
  margin: 3rem 0;
  text-align: center;
}

#timelineBody {
  margin: auto;
  background-color: white;

  width: 22rem; /*staviti sa media query razlicite sirine za ekrane*/
  padding: 2rem;

  overflow-x: scroll;
}
/* iz drugog dokumenta */

.firstRow {
  display: flex;
  justify-content: space-around;
  margin-left: 5ch;
}
.timeStamp > p {
  height: 2.5rem;
  width: 100%; /*izracunati width na temelju broja korisnika*/
  border-top: 1px solid rgb(199, 193, 212);
}

.schedule {
  position: relative;
}

.event {
  --start: 12;
  --duration: 1;

  width: 35%;
  background-color: rgba(156, 132, 218, 0.5);
  position: absolute;
  /* 
  left: 15%;
  top: calc(var(--start) * 60 / 1440 * 100%);
  height: calc(var(--duration) * 60 / 1440 * 100%);
  */

  border-radius: 0.5rem;
}
#actionButtons {
  width: 22rem;
  margin: 0.75rem auto;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
}
</style>
