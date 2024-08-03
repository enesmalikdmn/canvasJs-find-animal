<template>
  <div class="table-tool flex flex-col max-w-[300px] justify-center p-4 border-r-1 border-gray-500" :style="{gap: '12px'}">
    <div class="flex"  v-for="(item, index) in toolItems" :key="index">
      <dp-tooltip 
      class="w-full"
      :content="item.action === 'delete' ? 'Delete the selected element' : 'Delete the selected piece of element' "
      v-if="item.action === 'delete'"
      >
        <dp-button
          class="w-full text-sm"
          :disabled="selectedTool === item.action"
          :type="selectedTool === item.action ? 'primary' : 'neutral'"
          @click="handleSelectedTool(item)"
        >
          {{ item.name }}
        </dp-button>
      </dp-tooltip>
      <dp-button
          class="w-full text-sm"
          v-if="item.action !== 'delete'"
          :disabled="selectedTool === item.action"
          :type="selectedTool === item.action ? 'primary' : 'neutral'"
          @click="handleSelectedTool(item)"
        >
          {{ item.name }}
      </dp-button>
    </div>
    <!-- <dp-button
    class="w-full text-sm"
      @click="zoomIn"
    >
    Zoom In
    </dp-button>
    <dp-button
    class="w-full text-sm"
    @click="zoomOut"
    >
    Zoom Out
    </dp-button> -->
    <div class="w-full flex justify-between">
      <dp-button class="w-12"
      @click="handleRotate(rotateDegree + 0.5)"
      >
        <i class="dp-icon-rotate" />
      </dp-button>
      <dp-button class="w-12"
      @click="handleRotate(rotateDegree - 0.5)"
      >
        <i class="dp-icon-rotate-left" />
      </dp-button>
      <dp-button
      class="w-12"
      @click="checkRotate"
      >
        <i class="dp-icon-check" />
      </dp-button>
    </div>
    <!-- <div
      class="absolute bottom-0 table-save-button h-12 border border-gray-900 flex items-center justify-center"
    >
      <dp-button
        type="primary"
        size="small"
        @click="handleSave"
        class="bg-blue-1000 w-32 rounded-full"
        :disabled="selectedTool === 'resizableRectangle'"
      >
        <span class="text-sm font-medium uppercase">Save</span>
      </dp-button>
    </div> -->
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import CanvasDrawMixin from "./mixins/CanvasDrawMixin";
export default {
  name: "DrawingTool",
  mixins: [CanvasDrawMixin],
  data() {
    return {
      toolItems: [
        {
          name: "Drawing",
          action: "resizableRectangle",
        },
        // {
        //   name: "Horizontal / Vertical Line (Shortcut: S)",
        //   action: "changeLineAngle",
        // },
        // {
        //   name: "Cell / Rectangle Inside Line (Shortcut: W)",
        //   action: "changeLineSize",
        // },
        {
          name: "Clear All",
          action: "clearAll",
        },
        {
          name: "Delete",
          action: "delete",
        },
      ],
    };
  },
  computed: {
    ...mapGetters('user', ['userID']),
    ...mapGetters('client', ['clientId']),
    ...mapGetters('packages', ['activePackage', 'activePage']),
    ...mapGetters("viewer", ["pdfWidth", "pdfHeight", "columnHeaders", "drawActions", "cellOfRectangle", "imgDrawingList", "imgLabelList", "selectedTool", "scale", "rotateDegree", "isGridActive"]),
  },
  methods: {
    ...mapActions("viewer", ["setSelectedRectangles", "setImgDrawingList", "setImgLabelList", "setTableRowCount", "setColumnHeaders", "setTableData", "setFilledCells", "setDrawCount", "setIsPreviewLineActive", "setDrawActions", "setCellOfRectangle", "setColumnLabels", "setSelectedTool", "setScale", "setRotateDegree", "setIsGridActive"]),
    handleSelectedTool(item) {
      if (item.action === "clearAll") {
        this.clearAllDrawing();
      } else if (item.action === 'changeLineAngle') {
        this.changeLineAngle()
      } else if (item.action === 'changeLineSize') {
        this.changeLineSize()
      } else {
        if(this.selectedTool === 'label') return;
        this.setSelectedTool(item.action);
      }
    },
    handleRotate (degree) {
      this.setIsGridActive(true)
      this.setRotateDegree(degree)
    },
    checkRotate () {
      this.setIsGridActive(false)
    },
    zoomIn() {
      this.setScale(this.scale + 0.25);
    },
    zoomOut() {
      if (this.scale <= 1) return;
      this.setScale(this.scale - 0.25);
    },
    async handleSave (){
      const rectangle = {
          x1: 1,
          y1: 1,
          x2: 0,
          y2: 0,
          rotateDegree: 0,
          headers: [],
          cellOfRectangle: [],
          userId: this.userID,
          clientId: this.clientId,
          docId: this.activePackage.id,
          guid: this.activePackage.guid,
          pageNo: Math.round(this.activePage),
          pageWidth: this.pdfWidth,
          pageHeight: this.pdfHeight,
        }
        rectangle.cellOfRectangle = this.cellOfRectangle.map((item) => {
          const { rotateDegree, ...rest } = item;
          rectangle.rotateDegree = rotateDegree ? rotateDegree : rectangle.rotateDegree;
          this.setWidthAndHeight(rest, rectangle);
          return rest;
        });
        this.cellOfRectangle.map((cell) => {
          if(cell.labelName.includes("header")) {
            const { rotateDegree, ...rest } = cell;
            console.log(rotateDegree);
            this.setWidthAndHeight(rest, rectangle);
            this.setColumnHeaders([...this.columnHeaders, rest]);
          }
        });
        rectangle.headers = this.columnHeaders;
        this.setTableData({rectangle: rectangle})
    },
    setWidthAndHeight (rest, rectangle) {
        const widthScale = 1000;
        const heightScale = 810;
        rest.x1 = rest.x1 / widthScale;
        rest.x2 = rest.x2 / widthScale;
        rest.y1 = rest.y1 / heightScale;
        rest.y2 = rest.y2 / heightScale;
        rectangle.x1 = rest.x1 < rectangle.x1 ? rest.x1 : rectangle.x1;
        rectangle.y1 = rest.y1 < rectangle.y1 ? rest.y1 : rectangle.y1;
        rectangle.x2 = rest.x2 > rectangle.x2 ? rest.x2 : rectangle.x2;
        rectangle.y2 = rest.y2 > rectangle.y2 ? rest.y2 : rectangle.y2;
      }
  },
};
</script>
<style>
.table-tool {
  width: 362px
}
.table-save-button {
  width: 330px
}
</style>