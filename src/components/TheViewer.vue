<template>
  <div class="flex w-full h-screen">    
    <TableViewer style="width: 70%;"/>
    <div class="flex justify-center" :style="{
      width: '30%',
      height: '100vh',
      borderLeft: '1px solid black',
      overflow: 'scroll',
      backgroundColor: '#F5F5F5',
    }" >
    <!-- {{ drawActions }} -->
    <DrawingTool/>
    </div>
  </div>
</template>

<script>

import DrawingTool from './DrawingTool';
import CanvasDrawMixin from "./mixins/CanvasDrawMixin";
import TableViewer from './TableViewer';

export default {
    name: "TheViewer",
    mixins: [CanvasDrawMixin],
    components: { DrawingTool, TableViewer },
    
}
</script>
