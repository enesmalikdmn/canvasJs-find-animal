<template>
  <div class="bg-img flex flex-col w-full h-screen">    
    <TableViewer style="width: 100%;" class=""/>
  </div>
</template>

<script>

import CanvasDrawMixin from "./mixins/CanvasDrawMixin";
import TableViewer from './TableViewer';

export default {
    name: "TheViewer",
    mixins: [CanvasDrawMixin],
    components: { TableViewer },
    
}
</script>

<style scoped>
.bg-img {
  background-image: url('@/assets/child.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
</style>
