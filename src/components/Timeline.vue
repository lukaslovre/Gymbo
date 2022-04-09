<template>
  <div id="dateSelector">
    <h1>- test +</h1>
  </div>
  <div id="timelineBody">
    <div class="firstRow">
      <p>Ivan</p>
      <p>Lukas</p>
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
        <div class="event"></div>
        <div class="event2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  setup() {},
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
}
.timeStamp > p {
  height: 2rem;
  width: 100%; /* izracunati width na temelju broja korisnika*/
  border-top: 1px solid rgb(199, 193, 212);
}

.schedule {
  position: relative;
}

.event {
  --start: 12;
  --duration: 1;

  width: 40%;
  background-color: rgba(156, 132, 218, 0.5);
  position: absolute;
  top: calc(var(--start) * 60 / 1440 * 100%);
  height: calc(var(--duration) * 60 / 1440 * 100%);
  left: 15%;

  border-radius: 0.5rem;
}
.event2 {
  --start: 3;
  --duration: 3;

  width: 40%;
  background-color: rgba(156, 132, 218, 0.5);
  position: absolute;
  top: calc(var(--start) * 60 / 1440 * 100%);
  height: calc(var(--duration) * 60 / 1440 * 100%);
  left: 55%;

  border-radius: 0.5rem;
}
</style>
