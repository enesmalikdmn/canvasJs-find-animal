<template>
  <div
  :style="[
      selectedTool === 'delete'
        ? { cursor: selectedCursor }
        : { cursor: rectangleCursor },
    ]"
    @click.shift="handleShiftClick"
  >
  <canvas
  id="canvas2"
  class="canvas-overlay"
  :width="1000"
  :height="810"
  ></canvas>
  <canvas
    id="canvas"
    class="canvas-overlay"
    :width="1000"
    :height="810"
    @mousedown="handleCanvasMouseDown"
    @mousemove="handleCanvasMouseMove"
    @mouseup="handleCanvasMouseUp"
  ></canvas>
  <!-- <i class="dp-icon-x-circled text-red-700 ease-linear	"
  @click="handleDelete"
  :style="{  position: 'absolute', top: getIconYPosition, left: getIconXPosition, display: showDeleteIcon ? 'block' : 'none'}" /> -->
  <LabelBox
  :y=labelYPosition
  :x=labelXPosition
  :width="getLabelBoxWidth"
  :height="getLabelBoxHeight"
  :showLabelBox="showLabelBox"
  @close="handleCloseLabelBox"
  @clearCell="handleClearCell"
  @fillCell="handleFillCell"
  @fillColumnLabels="fillColumnLabels"
  />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import CanvasDrawMixin from "./mixins/CanvasDrawMixin";
import { saveAndDrawLine, drawLine, drawColAndRow, drawingAllColumn, drawingAllRow, resizeRectLines, isDuplicate, isMouseOnLine, isMouseOnRect, isMouseInRect, backColForPreviewLine, nextColForPreviewLine, backRowForPreviewLine, nextRowForPreviewLine, resizeRectangleLines, getCell, checkCloseEnough, isMouseInCell } from "../helpers/draw.js";
import LabelBox from "./LabelBox.vue";
import { labelBoxItems } from "./LabelBoxSchema.js";

export default {
  name: "CanvasOverlay",
  components: { LabelBox },
  mixins: [CanvasDrawMixin],
  data() {
    return {
      selectedCursor: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAExJREFUKFNj/Pfv3/8vX74w/Pz5kwEfYGdnZ+Dh4WFg/PTp03/eXj68imGSn4s/MTC+fv36v8gUUaI0vMl5PaqBYEiRF0okRxypSQMA7/lXqeYoIx8AAAAASUVORK5CYII=), auto`,
      rectangleCursor: 'crosshair',
      mouseX: 0,
      mouseY: 0,
      dragLineHorizontal: false,
      dragLineVertical: false,
      isEqual: false,
      resizeCount: 0,
      selectedDrawIndex: 0,
      targetRowPos: 0,
      targetLinePos: 0,
      pageWidth: 1000,
      pageHeight: 810,
      historyDrawActions: [],
      historyPieceCount: 0,
      rect: {},
      labelXPosition: 0,
      labelYPosition: 0,
      activeCell: {},
      multiSelectedCells: [],
      rectanglePosition: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
    };
  },
  computed: {
    ...mapGetters('packages', ['activePage']),
    ...mapGetters("viewer", ["isPreviewLineActive", "selectedTool", "drawActions", "lineColor", "selectedLineColor", "drawCount", "previewLineType", "sensitivity", "deletedCount", "deletedPieceCount", "deletedLineIndex", "pdfWidth", "pdfHeight", "scale", "rotateDegree", "isGridActive", "cellOfRectangle", "selectedLineInfo", "selectedCell", "columnLabels", "selectedRectangles", "filledCells"]),
    getIconYPosition() {
      const lineSensitivity = this.selectedLineInfo.drawing === 'column' || this.selectedLineInfo.drawing === 'columnPiece' ? 20 : 7
      return this.selectedLineInfo?.y1  - lineSensitivity + 'px'
    },
    getIconXPosition() {
      const lineSensitivity = this.selectedLineInfo.drawing === 'column' || this.selectedLineInfo.drawing === 'columnPiece' ? 8 : 20
      return this.selectedLineInfo.x1  - lineSensitivity + 'px'
    },
    getLabelBoxHeight() {
      return Math.ceil(labelBoxItems.length / 3) * 30 + 10
    },
    getLabelBoxWidth() {
      return labelBoxItems.length >= 3 ? 400 : 300
    }
  },
  methods: {
    saveAndDrawLine,
    drawLine,
    drawColAndRow,
    drawingAllColumn,
    drawingAllRow,
    resizeRectLines,
    isDuplicate,
    isMouseOnLine,
    isMouseOnRect,
    isMouseInRect,
    backColForPreviewLine,
    nextColForPreviewLine,
    backRowForPreviewLine,
    nextRowForPreviewLine,
    resizeRectangleLines,
    getCell,
    checkCloseEnough,
    isMouseInCell,
    ...mapActions("viewer", [
      "setSelectedTool",
      "setDrawActions",
      "setDrawCount",
      "setPreviewLineType",
      "setDeletedCount",
      "setDeletedPieceCount",
      "setDeletedLineIndex",
      "setIsGridActive",
      "setCellOfRectangle",
      "setSelectedLineInfo",
      "setSelectedCell",
      "setColumnLabels",
      "setIsPreviewLineActive",
      "setSelectedRectangles",
      "setFilledCells",
      "setRectPosition"
    ]),
    handleShiftClick () {
      this.multiSelectedCells.forEach((item) => {
        this.fillCell(item, 'rgba(234, 241, 247, 0.5)')
      })
      this.setSelectedRectangles(this.multiSelectedCells)
    },
    handleCloseLabelBox () {
      this.showLabelBox = false
      this.setSelectedRectangles([])
      this.multiSelectedCells = []
    },
    handleFillCell (value) {
      this.fillCell(value)
      const index = this.filledCells.findIndex((item) => {
        return item.x1 === value.x1 && item?.y1 === value?.y1 && item.x2 === value.x2 && item.y2 === value.y2
      })
      if(index === -1) {
        this.setFilledCells([...this.filledCells, value])
      } else {
        this.filledCells[index].labelName = value.labelName
      }
    },
    handleClearCell (value) {
      if(value.labelName.length !== 0) {
        this.filledCells.labelName = value.labelName
      } else {
        this.ctx.clearRect(value.x1 + 1, value?.y1 + 1, (value.x2 - value.x1) - 2, (value.y2 - value?.y1) - 2)
        const index = this.filledCells.findIndex((item) => {
          return item.x1 === value.x1 && item?.y1 === value?.y1 && item.x2 === value.x2 && item.y2 === value.y2
        })
        this.filledCells.splice(index, 1)
        this.setFilledCells(this.filledCells)
      }
    },
    getRectangleDrawCount(resizableRect) {
      if (resizableRect.length > 0) {
        this.setDrawCount(this.drawActions.indexOf(resizableRect[0]))
      }
    },
    resizeRectangle() {
      const resizableRect = this.drawActions.filter((drawing) => {
        return (
          (this.checkCloseEnough(this.mouseX, drawing.startX, this.sensitivity) &&
            this.checkCloseEnough(this.mouseY, drawing.startY, this.sensitivity)) ||
          (this.checkCloseEnough(this.mouseX, drawing.startX + drawing.w, this.sensitivity) &&
            this.checkCloseEnough(this.mouseY, drawing.startY, this.sensitivity)) ||
          (this.checkCloseEnough(this.mouseX, drawing.startX, this.sensitivity) &&
            this.checkCloseEnough(this.mouseY, drawing.startY + drawing.h, this.sensitivity)) ||
          (this.checkCloseEnough(this.mouseX, drawing.startX + drawing.w, this.sensitivity) &&
            this.checkCloseEnough(this.mouseY, drawing.startY + drawing.h, this.sensitivity))
        );
      });
      this.getRectangleDrawCount(resizableRect);
    },
    drawingRectangle() {
      if (
        (this.drawActions[this.drawCount]?.w === undefined &&
        !this.drawActions[this.drawCount]?.lineHeight) &&
        this.drawActions.length >= this.drawCount + 1 && 
        !this.isPreviewLineActive
      ) {
        this.drawActions[this.drawCount].startX = this.mouseX;
        this.drawActions[this.drawCount].startY = this.mouseY;
        this.dragBR = true;
      } else {
        this.dragTL =
          this.checkCloseEnough(
            this.mouseX,
            this.drawActions[this.drawCount].startX,
            this.sensitivity
          ) &&
          this.checkCloseEnough(
            this.mouseY,
            this.drawActions[this.drawCount].startY,
            this.sensitivity
          );
        this.dragTR =
          this.checkCloseEnough(
            this.mouseX,
            this.drawActions[this.drawCount].startX +
              this.drawActions[this.drawCount].w,
              this.sensitivity
          ) &&
          this.checkCloseEnough(
            this.mouseY,
            this.drawActions[this.drawCount].startY,
            this.sensitivity
          );
        this.dragBL =
          this.checkCloseEnough(
            this.mouseX,
            this.drawActions[this.drawCount].startX,
            this.sensitivity
          ) &&
          this.checkCloseEnough(
            this.mouseY,
            this.drawActions[this.drawCount].startY +
              this.drawActions[this.drawCount].h,
              this.sensitivity
          );
        this.dragBR =
          this.checkCloseEnough(
            this.mouseX,
            this.drawActions[this.drawCount].startX +
              this.drawActions[this.drawCount].w,
              this.sensitivity
          ) &&
          this.checkCloseEnough(
            this.mouseY,
            this.drawActions[this.drawCount].startY +
              this.drawActions[this.drawCount].h,
              this.sensitivity
          );
         
      }
      this.drawLineWithMouse();
    },
    drawLineWithMouse () {
      this.mouseX = Math.round(this.mouseX);
      this.mouseY = Math.round(this.mouseY);
      if (this.showSelectedDrawing()) return
      if (this.isPreviewLineActive && this.selectedTool === "colPerLine") {
        const lineActions = {
          column: () => this.drawLinePerCol(),
          row: () => this.drawLinePerRow()
        };
        lineActions[this.previewLineType]();
      } else if (this.isPreviewLineActive && this.selectedTool === "resizableRectangle") {
        const lineActions = {
          column: () => this.drawingAllColumn(this.drawActions, this.drawCount, this.ctx, this.mouseX, this.mouseY, this.pageWidth, this.pageHeight),
          row: () => this.drawingAllRow(this.drawActions, this.drawCount, this.ctx, this.mouseX, this.mouseY, this.pageWidth, this.pageHeight )
        };
        lineActions[this.previewLineType]();
      }
    },
    deleteDrawing() {
      /// TODO: refactor
      this.drawActions.map((drawing, index) => {
        const isMouseOnLine = this.isMouseOnLine(this.mouseX, this.mouseY, drawing);
        const isMouseOnRect = this.isMouseOnRect(this.mouseX, this.mouseY, drawing);
        if (isMouseOnLine || isMouseOnRect) {
          this.addToHistory(drawing);
          this.setDeletedLineIndex(index);
          this.setDeletedCount(this.deletedCount + 1);
          this.drawActions.splice(index, 1);
          this.setDrawCount(this.drawCount - 1);
        }
      });
    },
    handleDelete () {
      this.drawActions.map((drawing, index) => {
        const isMouseOnLine = this.isMouseOnLine(this.selectedLineInfo.x1, this.selectedLineInfo?.y1, drawing);
        if (isMouseOnLine) {
          this.showDeleteIcon = false;
          this.addToHistory(drawing);
          this.setDeletedLineIndex(index);
          this.setDeletedCount(this.deletedCount + 1);
          this.drawActions.splice(index, 1);
          this.setDrawCount(this.drawCount - 1);
        }
      });
    },
    addToHistory(action) {
      this.historyDrawActions .push({
        bottom: action.bottom,
        drawingType: action.drawingType,
        height: action.height,
        left: action.left,
        lineHeight: action.lineHeight,
        lineWidth: action.lineWidth,
        right: action.right,
        startX: action.startX,
        startY: action.startY,
        top: action.top,
        width: action.width,
        x: action.x,
        y: action.y,
      });
    },
    handleCanvasMouseDown(e) {
      if(this.isGridActive) return
      this.ctx.setLineDash([]);
      this.resizeRectangle();
      const rect = this.canvas.getBoundingClientRect()
      this.drawActions.push(rect);
      this.mouseX = (e.clientX - rect?.left)  / this.scale;
      this.mouseY = (e.clientY - rect?.top) / this.scale;
      this.showDeleteIcon = false;
      const drawingTypes = {
        resizableRectangle: () => this.drawingRectangle(),
        delete: () => this.deleteDrawing(),
        colPerLine: () => this.drawingRectangle(),
        label: () => this.addLabel(),
      };
      drawingTypes[this.selectedTool]();
    },
    addLabel() {
      let firstColumnInfo = {}
      // TODO: duplicate code
      if (this.checkCloseEnough(this.mouseY, this.cellOfRectangle[0]?.y1, 6)) {
        this.setSelectedRectangles([])
        this.cellOfRectangle.map((cell) => {
          if (this.checkCloseEnough(this.mouseY, cell?.y1, 6) && this.mouseX > cell.x1 && this.mouseX < cell.x2) {
            firstColumnInfo = cell
          }
        })
        this.cellOfRectangle.map((cell) => {
          firstColumnInfo.column.map((colCount) => {
            if (cell.column.includes(colCount) && cell.column.length === firstColumnInfo.column.length ) {
              this.labelXPosition = cell.x2 > 350 ? 350 : cell.x2
              this.labelYPosition = cell.y2
              this.fillCell(cell, 'rgba(234, 241, 247, 0.5)');
              this.setSelectedRectangles([...this.selectedRectangles, cell])
              this.multiSelectedCells.push(cell)
              this.showLabelBox = true
            }
          })
        })
        this.isMultiSelected = true
      } else if (this.checkCloseEnough(this.mouseX, this.getFirstRowCell()?.x1, 6)){
        this.setSelectedRectangles([])
        this.cellOfRectangle.map((cell) => {
          if (this.checkCloseEnough(this.mouseX, cell?.x1, 6) && this.mouseY > cell.y1 && this.mouseY < cell.y2) {
            firstColumnInfo = cell
          }
        })
        this.cellOfRectangle.map((cell) => {
          firstColumnInfo.row.map((rowCount) => {
            if (cell.row.includes(rowCount) && cell.row.length === firstColumnInfo.row.length ) {
              this.labelXPosition = cell.x2 > 350 ? 350 : cell.x2
              this.labelYPosition = cell.y2
              this.fillCell(cell, 'rgba(234, 241, 247, 0.5)');
              this.setSelectedRectangles([...this.selectedRectangles, cell])
              this.multiSelectedCells.push(cell)
              this.showLabelBox = true
            }
          })
        })
        this.isMultiSelected = true
      } else if(this.activeCell.x1) {
        this.labelXPosition = this.activeCell.x2 > 350 ? 350 : this.activeCell.x2
        this.labelYPosition = this.activeCell.y2
        this.setSelectedCell(this.activeCell);
        this.setSelectedRectangles([this.activeCell])
        if (!this.multiSelectedCells.some((cell) => cell.column === this.activeCell.column && cell.row === this.activeCell.row)) {
          this.multiSelectedCells.push(this.activeCell)
        } else {
          this.multiSelectedCells = this.multiSelectedCells.filter((cell) => cell.column !== this.activeCell.column || cell.row !== this.activeCell.row)
        }
        this.showLabelBox = true
      } else {
        this.setSelectedRectangles([])
        this.multiSelectedCells = []
        this.showLabelBox = false
      }
    },
    showSelectedDrawing () {
      let hasSelected = false
      this.drawActions.map((drawing, index) => {
        drawing.isSelected = false;
        const isMouseOnLine = this.isMouseOnLine(this.mouseX, this.mouseY, drawing);
        const isMouseOnRect = this.isMouseOnRect(this.mouseX, this.mouseY, drawing);
        if (isMouseOnLine || isMouseOnRect) {
          drawing.drawingType === "rectangle" ? this.showDeleteIcon = false : this.showDeleteIcon = true
          this.selectedDrawIndex = index;
          drawing.drawingType === 'row' || drawing.drawingType === 'rowPiece' ? this.dragLineVertical = true : this.dragLineHorizontal = true;
          drawing.isSelected = true;
          hasSelected = true;
        }
      })
      return hasSelected
    },
    drawPreviewLine() {
      for (let i = 0; i < this.drawActions.length; i++) {
        if (this.isMouseInRect(this.mouseX, this.mouseY, this.drawActions[i]) && this.selectedTool === 'resizableRectangle' &&
          !this.dragBR && !this.dragBL && !this.dragTR && !this.dragTL) {
          this.ctx.setLineDash([5, 5]);
          this.setIsPreviewLineActive(true);
          const lineActions = {
            column: () => this.drawLine(this.ctx, this.mouseX, this.drawActions[i].startY, this.mouseX, this.drawActions[i].startY + this.drawActions[i]?.h),
            row: () => this.drawLine(this.ctx, this.drawActions[i].startX, this.mouseY, this.drawActions[i].startX + this.drawActions[i]?.w, this.mouseY)
          };
          lineActions[this.previewLineType]();
          i = this.drawActions.length;
        } else if (
          this.isMouseInRect(this.mouseX, this.mouseY, this.drawActions[i]) && this.selectedTool === 'colPerLine' &&
          !this.dragBR && !this.dragBL && !this.dragTR && !this.dragTL
        ) {
          this.ctx.setLineDash([5, 5]);
          this.setIsPreviewLineActive(true);
          this.mouseX = Math.round(this.mouseX);
          this.mouseY = Math.round(this.mouseY);
          const lineActions = {
            column: () => this.drawCellPreviewCol(),
            row: () => this.drawCellPreviewRow()
          };
          lineActions[this.previewLineType]();
          i = this.drawActions.length;
        } else if (this.drawActions[i].drawingType === 'rectangle') {
          this.setIsPreviewLineActive(false);
        }
      }
    },
    drawCellPreviewRow () {
      const XPrevStart = this.backColForPreviewLine(this.mouseX, this.drawActions, this.mouseY)
      const YPrevStart = this.nextColForPreviewLine(this.mouseX, this.drawActions, this.mouseY, this.pageWidth)
      this.drawLine(this.ctx, XPrevStart, this.mouseY, YPrevStart, this.mouseY);
    },
    drawCellPreviewCol() {
      const XPrevStart = this.backRowForPreviewLine(this.mouseY, this.drawActions, this.mouseX)
      const YPrevStart = this.nextRowForPreviewLine(this.mouseY, this.drawActions, this.mouseX, this.pageHeight)
      this.drawLine(this.ctx, this.mouseX, XPrevStart, this.mouseX, YPrevStart);
    },
    drawRectangleWithMouse() {
      this.drawPreviewLine();
      if (this.dragTL) {
        const draggedSpaceX = this.drawActions[this.drawCount].startX - this.mouseX;
        const draggedSpaceY = this.drawActions[this.drawCount].startY - this.mouseY;
        this.setDrawActions(this.resizeRectangleLines(this.drawActions, this.drawCount, draggedSpaceX,  draggedSpaceY))
        this.drawActions[this.drawCount].w += draggedSpaceX;
        this.drawActions[this.drawCount].h += draggedSpaceY;
        this.drawActions[this.drawCount].startX = this.mouseX;
        this.drawActions[this.drawCount].startY = this.mouseY;
        this.drawActions[this.drawCount].drawingType = 'rectangle';
        this.resizeRectLines(this.drawActions, this.drawCount, 'dragTL')
      } else if (this.dragTR) {
        const draggedSpaceX = this.mouseX - (this.drawActions[this.drawCount].startX + this.drawActions[this.drawCount].w)
        const draggedSpaceY = this.drawActions[this.drawCount].startY - this.mouseY
        this.setDrawActions(this.resizeRectangleLines(this.drawActions, this.drawCount, draggedSpaceX,  draggedSpaceY))
        this.drawActions[this.drawCount].w = Math.abs(this.drawActions[this.drawCount].startX - this.mouseX);
        this.drawActions[this.drawCount].h += draggedSpaceY
        this.drawActions[this.drawCount].startY = this.mouseY;
        this.drawActions[this.drawCount].drawingType = 'rectangle';
        this.resizeRectLines(this.drawActions, this.drawCount, 'dragTR')
      } else if (this.dragBL) {
        const draggedSpaceX = this.drawActions[this.drawCount].startX - this.mouseX;
        const draggedSpaceY = this.mouseY - (this.drawActions[this.drawCount].startY + this.drawActions[this.drawCount].h)
        this.setDrawActions(this.resizeRectangleLines(this.drawActions, this.drawCount, draggedSpaceX,  draggedSpaceY))
        this.drawActions[this.drawCount].w += draggedSpaceX;
        this.drawActions[this.drawCount].h = Math.abs(this.drawActions[this.drawCount].startY - this.mouseY);
        this.drawActions[this.drawCount].startX = this.mouseX;
        this.drawActions[this.drawCount].drawingType = 'rectangle';
        this.resizeRectLines(this.drawActions, this.drawCount, 'dragBL')
      } else if (this.dragBR) {
        const draggedSpaceX = this.mouseX - (this.drawActions[this.drawCount].startX + this.drawActions[this.drawCount].w)
        const draggedSpaceY = this.mouseY - (this.drawActions[this.drawCount].startY + this.drawActions[this.drawCount].h)
        this.setDrawActions(this.resizeRectangleLines(this.drawActions, this.drawCount, draggedSpaceX, draggedSpaceY))
        this.drawActions[this.drawCount].w = Math.abs(this.drawActions[this.drawCount].startX - this.mouseX);
        this.drawActions[this.drawCount].h = Math.abs(this.drawActions[this.drawCount].startY - this.mouseY);
        this.drawActions[this.drawCount].drawingType = 'rectangle';
        this.resizeRectLines(this.drawActions, this.drawCount, 'dragBR')
      }
      this.removeOutsideLine()  // causes a bug in draw Count
    },
    dragColWithConnection () {
      this.drawActions.map((action) => {
        if( action.startX + action.lineWidth === this.drawActions[this.selectedDrawIndex].startX && action.lineWidth > 0) {
          action.lineWidth +=   this.mouseX - this.drawActions[this.selectedDrawIndex].startX
        } else if (action.startX === this.drawActions[this.selectedDrawIndex].startX && action.lineWidth > 0) {
          action.lineWidth -= this.mouseX - this.drawActions[this.selectedDrawIndex].startX
          action.startX = this.mouseX;
        }
      })
    },
    dragRowWithConnection () {
      this.drawActions.map((action) => {
        if( action.startY + action.lineHeight === this.drawActions[this.selectedDrawIndex].startY && action.lineHeight > 0) {
          action.lineHeight += this.mouseY - this.drawActions[this.selectedDrawIndex].startY
        } else if (action.startY === this.drawActions[this.selectedDrawIndex].startY && action.lineHeight > 0) {
          action.lineHeight -= this.mouseY - this.drawActions[this.selectedDrawIndex].startY
          action.startY = this.mouseY;
        }
      })
    },
    dragLineWithMouse() {
      this.drawActions.map((action) => {
        if (this.dragLineHorizontal && this.isMouseInRect(this.mouseX, this.mouseY, action)) {
          this.dragColWithConnection()
          this.drawActions[this.selectedDrawIndex].startX = this.mouseX;
          this.selectedLineInfo.x1 = this.mouseX;
        } else if (this.dragLineVertical && this.isMouseInRect(this.mouseX, this.mouseY, action)) {
          this.dragRowWithConnection()
          this.drawActions[this.selectedDrawIndex].startY = this.mouseY;
          this.selectedLineInfo.y1 = this.mouseY;
        }
      })
    },
    handleCanvasMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect?.left) / this.scale // TODO: fix this
      this.mouseY = (e.clientY - rect?.top) / this.scale;
      this.ctx.setLineDash([]);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
      if (this.selectedTool === "resizableRectangle" || this.selectedTool === "colPerLine") {
        this.drawRectangleWithMouse();
        if (this.dragTL || this.dragTR || this.dragBL || this.dragBR) return
        this.dragLineWithMouse();
      } else if (this.selectedTool === "label") {
        this.activeCell = this.isMouseInCell(this.mouseX, this.mouseY, this.cellOfRectangle);
        this.ctx.strokeRect(this.activeCell?.x1, this.activeCell?.y1, this.activeCell?.x2 - this.activeCell?.x1, this.activeCell?.y2 - this.activeCell?.y1);
      }
    },
    drawRectangleWithMouseUp() {
      this.dragTL =
        this.dragTR =
        this.dragBL =
        this.dragBR =
        this.dragLineHorizontal =
        this.dragLineVertical =
          false;
      this.ctx.setLineDash([]);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.setDrawActions(this.drawActions.filter((item) => item.drawingType && (item.w || item.lineWidth || item.lineHeight)))
      const newCount = this.drawActions.length
      this.setDrawCount(newCount)
      this.draw();
      if (this.drawCount === 1 && this.drawActions[0].drawingType === 'rectangle') {
        this.setRectPosition({ left: this.drawActions[0].startX, top: this.drawActions[0].startY, width: this.drawActions[0].w, height: this.drawActions[0].h })
      }
      this.removeSecondRectangle()
    },
    removeSecondRectangle () {
      if (this.drawCount > 1 && this.drawActions[this.drawCount - 1].drawingType === 'rectangle') {
        this.drawActions.splice(this.drawCount - 1, 1)
        this.setDrawCount(this.drawCount - 1)
      }
    },
    handleCanvasMouseUp() {
      const drawingTypes = {
        resizableRectangle: () => this.drawRectangleWithMouseUp(),
        delete: () => this.deleteDrawingUp(),
        dragLine: () => this.drawRectangleWithMouseUp(),
        colPerLine: () => this.drawRectangleWithMouseUp(),
        label: () => this.drawRectangleWithMouseUp(),
      };
      drawingTypes[this.selectedTool]();
    },
    deleteDrawingUp() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
    },
    getFirstRowCell () {
      let firstRowCell = {}
      this.cellOfRectangle.map((cell) => {
        if (cell.column.includes(1) && cell.row.includes(1)) {
          firstRowCell = cell
        }
      })
      return firstRowCell
    },
    shortcutHandler(e) {
      if (e.key === "Escape") {
        this.changeTableMode();
      } else if (e.key === "Enter") {
        this.setDrawActions([]);
      } else if (e.code === 'KeyZ' && e.shiftKey) {
        this.takeForward();
      } else if (e.code === 'KeyZ' && !e.shiftKey) {
        this.takeBack();
      } else if (e.key === "w" || e.key === "W") {
        this.changeLineSize()
      } else if (e.key === "s" || e.key === "S") {
        this.changeLineAngle()
      }
      this.ctx.setLineDash([]);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
    },
    drawLinePerCol () {
      this.drawActions.map((drawing) => {
        if (this.isMouseInRect(this.mouseX, this.mouseY, drawing)) {
          const XPrevStart = this.backRowForPreviewLine(this.mouseY, this.drawActions, this.mouseX)
          this.targetRowPos = this.nextRowForPreviewLine(this.mouseY, this.drawActions, this.mouseX, this.pageHeight)
          if (this.targetRowPos === 0) return;
          this.saveAndDrawLine(
            this.drawActions,
            this.mouseX,
            XPrevStart,
            0,
            this.targetRowPos - XPrevStart,
            "columnPiece",
            this.pageHeight,
            this.pageWidth
          );
          this.automaticLineCorrection(this.mouseX, XPrevStart, this.targetRowPos - XPrevStart,)
          this.targetRowPos = 0;
          this.setDrawCount(this.drawCount + 1);
        }
      })
    },
    automaticLineCorrection (startX, startY) {
      this.drawActions.map((drawing, index) => {
        if (drawing.drawingType === "columnPiece" && drawing.startX !== startX && drawing.startY !== startY && this.checkCloseEnough(drawing.startX, startX, 6)) {
          this.drawActions[index].startX = startX;
        }
      })
    },
    drawLinePerRow() {
      this.drawActions.map((drawing) => {
        if (this.isMouseInRect(this.mouseX, this.mouseY, drawing)) {
          const XPrevStart = this.backColForPreviewLine(this.mouseX, this.drawActions, this.mouseY)
          this.targetLinePos = this.nextColForPreviewLine(this.mouseX, this.drawActions, this.mouseY, this.pageWidth)
          if (this.targetLinePos === 0) return;
          this.saveAndDrawLine(
            this.drawActions,
            XPrevStart,
            this.mouseY,
            this.targetLinePos - XPrevStart,
            0,
            "rowPiece",
            this.pageHeight,
            this.pageWidth
          );
          this.targetLinePos = 0;
          this.setDrawCount(this.drawCount + 1);
        }
      });
    },
    takeBack() {
      if (this.deletedPieceCount > 0 && !(this.selectedTool === 'label')) {
        const forwardDrawing = this.drawActions[this.deletedLineIndex]
        this.drawActions.splice(this.deletedLineIndex, 1);
        this.drawActions.splice(this.deletedLineIndex, 0, this.historyDrawActions[(this.deletedPieceCount + this.deletedCount) - 1]);
        this.historyDrawActions.splice((this.deletedPieceCount + this.deletedCount) - 1, 1);
        this.historyDrawActions.push(forwardDrawing)
        this.setDeletedPieceCount(this.deletedPieceCount - 1);
        this.historyPieceCount++
      } else if (this.deletedCount > 0 && !(this.selectedTool === 'label')) {
        this.drawActions.splice(this.deletedLineIndex, 0, this.historyDrawActions[(this.deletedPieceCount + this.deletedCount) - 1]);
        this.setDrawCount(this.drawCount + 1);
        this.setDeletedCount(this.deletedCount - 1);
      } else if (this.drawCount > 1 && !(this.selectedTool === 'label')) {
        this.historyDrawActions.push(this.drawActions[this.drawCount - 1]);
        this.drawActions.splice(this.drawCount - 1, 1);
        this.setDrawCount(this.drawCount - 1);
      }
      this.setIsPreviewLineActive(false);
    },
    takeForward () {
      if (this.historyDrawActions.length > 0 && !(this.selectedTool === 'label')) {
        if (this.historyPieceCount > 0 && this.drawActions[this.deletedLineIndex + 1]) {
          this.drawActions.splice(this.deletedLineIndex, 1);
        }
        this.drawActions.push(this.historyDrawActions[this.historyDrawActions.length - 1]);
        this.historyDrawActions.splice(this.historyDrawActions.length - 1, 1);
        this.setDrawCount(this.drawCount + 1);
        this.setIsPreviewLineActive(false);
      }
      const uniqueDrawActions = this.drawActions.filter((drawing, index, self) =>
        index === self.findIndex((t) => (
          t.drawingType === drawing.drawingType && t.startX === drawing.startX && t.startY === drawing.startY
        ))
      )
      this.setDrawActions(uniqueDrawActions);
    },
    changeCursor(mouseX, mouseY) {
      // find the which row and col property equals 1 in cellOfRectangle
      let isMouseInRect = []
      this.drawActions.map((drawing) => {
        if (!(drawing.drawingType === 'rectangle')) return
        const isMouseOnRect = this.isMouseOnRect(mouseX, mouseY, drawing);
        isMouseInRect.push(this.isMouseInRect(mouseX, mouseY, drawing))
        if (isMouseOnRect && !(this.selectedTool === "label")) {
          this.rectangleCursor = 'all-scroll'
        } else if (isMouseInRect.includes(true) && !(this.selectedTool === "label")) {
          this.rectangleCursor = 'crosshair';
        } else if(this.checkCloseEnough(this.mouseY, this.cellOfRectangle[0]?.y1, 6)) {
          this.rectangleCursor = 's-resize';
        } else if (this.checkCloseEnough(this.mouseX, this.getFirstRowCell()?.x1, 6)) {
          this.rectangleCursor = 'e-resize';
        } else {
          this.rectangleCursor = 'default';
        }
      });
    },
  },
  mounted() {
    this.setSelectedLineInfo({});
    // this.drawActions[0].drawingMode ? this.setSelectedTool(this.drawActions[0].drawingMode) : this.setSelectedTool('resizableRectangle')
    this.setSelectedTool("resizableRectangle");
    this.setIsGridActive(false);
    this.setTableRowCount(0);
    window.addEventListener("keydown", this.shortcutHandler);
    this.draw()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.shortcutHandler)
  },
  watch: {
    activePage () {
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.setFilledCells([])
      this.cellOfRectangle.map((item) => {
        if (item.labelName.length) {
          this.setFilledCells([...this.filledCells, item])
        } 
      });
    },
    rotateDegree(val) {
      this.drawActions.map((drawing) => {
        if (drawing.drawingType === "rectangle") {
          drawing.rotateDegree = val;
        }
      });
    },
    isGridActive() {
      const canvas = document.getElementById("canvas2");
      const ctx = canvas.getContext('2d');  
      const w = canvas.width 
      const h = canvas.height
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(!this.isGridActive) return
      for (let x=0;x<=w;x+=20) {
        for (let y=0;y<=h;y+=20) {
          ctx.strokeStyle = 'rgba(192,192,192,0.3)'
          ctx.setLineDash([2,2]);
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }
    },
    drawActions(val) {
      if (val.length === 0) {
        this.setDrawActions([
        {
          bottom:951,
          height:810,
          left:1075,
          right:1715,
          top:51,
          width:1000,
          x:1075,
          y:51
        }
        ]);
      }
      val.map((drawing) => {
        if (drawing.drawingType === "rectangle") {
          drawing.rotateDegree = this.rotateDegree;
        }
        if (drawing.isSelected) {
          this.setSelectedLineInfo({ x1: drawing.startX, y1: drawing.startY, drawing: drawing.drawingType})
        }
      });
    },
    mouseX: {
      immediate: true,
      deep: true,
      handler(val) {
        this.changeCursor(val, this.mouseY);
      },
    },
    mouseY: {
      immediate: true,
      deep: true,
      handler(val) {
        this.changeCursor(this.mouseX, val);
      },
    }
  },
};
</script>
<style>
.canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
