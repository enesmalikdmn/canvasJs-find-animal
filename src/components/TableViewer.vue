<template>
  <div class="viewer-container">
      <div class="viewer-wrapper flex flex-col"
      :style="{
          height: '100vh',
          overflow: 'scroll',
          backgroundColor: '#F5F5F5',
      }"
      >
          <div class="w-full flex">
            <div class="flex absolute flex-col ml-2">
              <dp-switch class="flex justify-center text-sm" :style="{right: 0, paddingTop: '3.5rem', paddingRight: '0.5rem'}"  v-model="drawingAutoRow">Auto Draw</dp-switch> 
            </div>
          </div>
          <div :style="{
              scale: scale,
              transformOrigin: '0 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              }" >
              <div class="absolute">
                <ImgViewer />
                <CanvasOverlay />
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import ImgViewer from './ImgViewer';
import CanvasOverlay from './CanvasOverlay';
import { mapActions, mapGetters } from 'vuex';
import CanvasDrawMixin from "./mixins/CanvasDrawMixin";
import { getDrawAction } from "../../src/helpers/draw.js"

export default {
  name: "TheViewer",
  mixins: [CanvasDrawMixin],
  components: { ImgViewer, CanvasOverlay },
  data () {
      return {
        imgInfo: {
          imgId: 0,
        },
      };
  },
  computed: {
    ...mapGetters('auth', ['jwtToken']),
    ...mapGetters('packages', ['activePackage', 'activePage', 'firstLabelPackage']), 
    ...mapGetters("viewer", ["rotateDegree", "tableData", "pdfWidth", "pdfHeight", "scale", "drawActions", "imgDrawingList", "imgLabelList", "cellOfRectangle", "selectedTool"]),
    drawingAutoRow: {
      get () {
        return this.$store.state.drawingAutoRow;
      },
      set (value) {
        this.$store.dispatch("viewer/setDrawingAutoRow", value);
      },
    }
  },
  methods: {
    getDrawAction,
    ...mapActions("viewer", ["setTableRowCount", "setTableData", "setIsPreviewLineActive", "setDrawCount", "setSelectedTool", "setPdfWidth", "setPdfHeight", "setScale", "setImgLabelList", "setImgDrawingList", "setDrawActions", "setRotateDegree", "setCellOfRectangle", "setColumnLabels", "setFilledCells"]),
    settingDrawingMode () {
      this.drawActions[0].drawingMode ? this.setSelectedTool(this.drawActions[0].drawingMode) : this.setSelectedTool('resizableRectangle')
    },
    async settingPassedPageInfo (page, guid) {
      this.drawActions[0].drawingMode = this.selectedTool
      this.drawActions[0].rotateDegree = this.rotateDegree
      this.drawActions[0].guid = guid
      this.drawActions[0].page = page
      this.cellOfRectangle[0].guid = guid
      this.cellOfRectangle[0].page = page
    },
    resetDrawActions () {
      this.setDrawActions([{
        bottom:951,
        height:710,
        left:1075,
        right:1715,
        top:51,
        width:876,
        x:1075,
        y:51
      }])
    },
    resetCellOfRectangle () {
      this.setCellOfRectangle([{
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        row: [],
        column: [],
        labelName: [],
        rotateDegree: 0,
        guid: '',
        page: 0,
      }])
    },
    async getActivePageDrawing () {
      // Is there an object with active page and activePackage.guid in imgDrawingList true return false
      const drawingIndex = this.imgDrawingList.findIndex(
        (item) =>
        item[0].page === this.activePage &&
        item[0].guid === this.activePackage.guid
      )
      if (drawingIndex > -1) {
        this.imgDrawingList.map((item) => {
          if (this.activePage === item[0].page && this.activePackage.guid === item[0].guid) {
            this.setDrawActions(item);
            this.setDrawCount(item.length);
            const rotateDegree = this.drawActions[0].rotateDegree ? this.drawActions[0].rotateDegree : 0;
            this.setRotateDegree(rotateDegree);
          }
        });
        this.imgLabelList.map((item) => {
          if (this.activePage === item[0].page && this.activePackage.guid === item[0].guid && this.drawActions[0].drawingMode === 'label') {
            this.setCellOfRectangle(item);
            this.setColumnLabels(this.cellOfRectangle.filter((item) => item.row.includes(1)));
            this.setFilledCells(this.cellOfRectangle.filter((item) => item.labelName.length > 0))
          }
        });
      }
    this.settingDrawingMode();
    this.setIsPreviewLineActive(false)
    this.draw()
    },
    saveTableBeforeRefresh () {
      this.settingPassedPageInfo(this.activePage, this.activePackage.guid)
      this.saveDrawingToList(this.activePage, this.activePackage.guid)
    },
    saveDrawingToList (page, guid) {
      // TODO: refactor it
      if(this.imgDrawingList.length === 0) {
          this.setImgDrawingList(this.drawActions)
          this.setImgLabelList(this.cellOfRectangle)
      } else {
        this.imgDrawingList.map((item, index) => {
          /// listede geçtiğimiz sayfanın çizimi varsa güncelle yoksa yeni ekle
          if (page === item[0].page && guid === item[0].guid) {
            this.imgDrawingList[index] = this.drawActions
            this.imgLabelList[index] = this.cellOfRectangle
          } else if (this.imgDrawingList.filter((item) => item[0].page === page && guid === item[0].guid).length === 0) {
            this.setImgDrawingList(this.drawActions)
            if (this.cellOfRectangle.length === 0) return
            this.setImgLabelList(this.cellOfRectangle)
          }
        })
      }
      this.resetDrawActions()
      this.setDrawCount(0)
      this.setRotateDegree(0)
      this.setTableRowCount(1)
      this.resetCellOfRectangle()
      this.setFilledCells([])
      this.setColumnLabels([])
    }
  },
  mounted() {
    this.setScale(1);
    this.imgLabelList.map((item, index) => {
      if (item[0]?.x1 === this.cellOfRectangle[0]?.x1 && item[0]?.y1 === this.cellOfRectangle[0]?.y1) {
        this.imgInfo.imgId = index;
      }
    })
    const viewerWrapper = document.querySelector(".viewer-wrapper");
    this.setPdfWidth(viewerWrapper.offsetWidth);
    this.setPdfHeight(viewerWrapper.offsetHeight);
    window.addEventListener("beforeunload", this.saveTableBeforeRefresh);
    this.clearRect()
    // finding the object in the imgDrawingList which has the same page and guid
    this.getActivePageDrawing()
  },
  watch: {
    activePage: {
      handler (newValue, oldValue) {
        this.clearRect()
        this.settingPassedPageInfo(oldValue, this.activePackage.guid)
        // çizim listemizde varsa güncelle yoksa yeni ekle
        this.saveDrawingToList(oldValue, this.activePackage.guid)
        // yeni sayfanın çizimini gücelleyiyor
        this.getActivePageDrawing()
      }
    },
    activePackage : {
      handler (newValue, oldValue) {
        this.clearRect()
        this.settingPassedPageInfo(this.activePage, oldValue.guid)
        this.saveDrawingToList(this.activePage, oldValue.guid)
        // yeni sayfanın çizimini gücelleyiyor
        this.getActivePageDrawing()
      }
    },
    // imgDrawingList () {
    //   // delete the object in the imgDrawingList which hasn't page or guid
    //   this.setImgDrawingList(this.imgDrawingList.filter((item) => item[0].page && item[0].guid))
    // },
    // imgLabelList () {
    //   // delete the object in the imgLabelList which hasn't page or guid
    //   this.setImgLabelList(this.imgLabelList.filter((item) => item[0].page && item[0].guid))
    // },
  },
}
</script>
<style scoped>
.viewer-container {
  width: calc(100% - (64px + 200px + 362px));
height: 100vh;
}
.viewer-wrapper {
z-index: 1;
top: 0;
right: 0;
}
.close-icon {
background-color: #184171;
border-radius: 0.4rem 0.4rem 0 0;
}
</style>
