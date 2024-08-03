import { mapActions, mapGetters } from 'vuex';
import { drawColAndRow } from '../../helpers/draw.js';
import { getCell } from '../../helpers/draw.js';
export default {
    data () {
        return {
            canvas: null,
            ctx: null,
            cellFillColor: "rgba(84, 255, 159, 0.1)",
            isMultiSelected: false,
            dragTL: false,
            dragTR: false,
            dragBL: false,
            dragBR: false,
            selectedColumnLabels: [],
            showDeleteIcon: false,
            showLabelBox: false,
        }
    },
    computed: {
      ...mapGetters('viewer', ["tableRowCount", "cellOfRectangle", "drawActions", "lineColor", "selectedLineColor", "selectedRectangles", "columnLabels", "filledCells", "previewLineType", "selectedTool" ] ),
    },
    methods: {
      getCell,
      ...mapActions('viewer', ["setSelectedRectangles", "setTableRowCount", "setDrawActions", "setDrawCount", "setPreviewLineType", "setSelectedTool", "setCellOfRectangle", "setFilledCells","setColumnLabels"]),
        clearRect () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        draw() {
            this.drawActions.map((drawing) => {
              this.ctx.strokeStyle = drawing.isSelected ? this.selectedLineColor : this.lineColor;
              drawColAndRow(drawing, this.ctx, this.lineColor, this.selectedLineColor);
            });
            this.selectedRectangles.map((drawing) => {
              const selectedRectColor = 'rgba(234, 241, 247, 0.5)'
              this.fillCell(drawing, selectedRectColor)
            })
            this.filledCells.map((drawing) => {
              this.fillCell(drawing)
            })
           this.fillColumnLabels()
        },
        fillCell(value, color = this.cellFillColor) {
            this.ctx.fillStyle = color
            this.ctx.clearRect(value.x1 + 1, value?.y1 + 1, (value.x2 - value.x1) - 2, (value.y2 - value?.y1) - 2)
            this.ctx.fillRect(value.x1 + 1, value?.y1 + 1, (value.x2 - value.x1) - 2, (value.y2 - value?.y1) - 2)
        },
        removeOutsideLine() {
          this.drawActions.map((action) => {
            if (action.drawingType === 'rectangle' && action.w && action.h) {
              this.drawActions.map((item, index) => {
                if (!(this.dragBR) && (item.drawingType === "row" || item.drawingType === "column" || item.drawingType === "rowPiece" || item.drawingType === "columnPiece") && !(this.isMouseInRect(item?.startX + 1, item?.startY + 1, action))) {
                  this.drawActions.splice(index, 1)
                  this.setDrawActions(this.drawActions)
                }
              });
            }
          })
        },
        clearAllDrawing() {
          const drawingIndex = this.imgDrawingList.findIndex(
            (item) =>
            item[0].page === this.activePage &&
            item[0].guid === this.activePackage.guid
            )
          const labelIndex = this.imgLabelList.findIndex(
            (item) =>
            item[0].page === this.activePage &&
            item[0].guid === this.activePackage.guid
          )
          if (drawingIndex !== -1 && labelIndex !== -1) {
            // Delete with splice the array that matches the page and guid of the 0th index of the drawAction from the imgDrawingList array
            this.imgDrawingList.splice(drawingIndex, 1);
            // Delete with splice the array that matches the page and guid of the 0th index of the cellOfRectangle from the imgLabelList array
            this.imgLabelList.splice(labelIndex, 1);
          }
          this.setDrawActions([{
            drawingMode: 'resizableRectangle',
            bottom:951,
            height:710,
            left:1075,
            right:1715,
            top:51,
            width:876,
            x:1075,
            y:51
          }]);
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
          this.setColumnLabels([]);
          this.setFilledCells([])
          this.setSelectedRectangles([]);
          this.clearRect()
          this.setTableRowCount(0);
          this.setSelectedTool('resizableRectangle');
          this.setIsPreviewLineActive(false);
          this.setDrawCount(0);
        },
        changeLineAngle() {
          const lineActions = {
            column: () => this.setPreviewLineType('row'),
            row: () => this.setPreviewLineType('column'),
          };
          lineActions[this.previewLineType]();
        },
        changeLineSize () {
          if (this.selectedTool === "label") return
          this.selectedTool === "resizableRectangle" ? this.setSelectedTool("colPerLine") : this.setSelectedTool("resizableRectangle");
        },
        changeTableMode () {
          this.showDeleteIcon = false
          this.showLabelBox = false
          this.setSelectedRectangles([])
          this.selectedTool !== "label" ? this.setSelectedTool("label") : this.setSelectedTool("resizableRectangle")
          this.setCellOfRectangle(this.getCell(this.drawActions, this.pageHeight, this.pageWidth));
          this.setFilledCells([]);
          this.selectedTool === 'label' ? this.setColumnLabels(this.cellOfRectangle.filter((item) => item.row.includes(1))) :  this.setColumnLabels([])
        },
        fillColumnLabels() {
          // this.columnLabels.map((column) => {
          //   const isColumnEmpty = this.cellOfRectangle.filter((item) => this.arrayEquals(column.column, item.column)).every((item) => item.labelName.length === 0)
          //   this.cellOfRectangle.map((item) => {
          //     let maxLabelCount = this.cellOfRectangle.reduce((prev, current) => (prev.labelName.length > current.labelName.length) ? prev : current).labelName.length
          //     if (this.arrayEquals(column.column, item.column)  && (item.labelName.length > 0 || column.labelName.length > 0)) {
          //       const concatArr = column.labelName.concat(item.labelName)
          //       this.selectedColumnLabels = concatArr.filter((item, idx) => concatArr.indexOf(item) === idx)
          //       this.setTableRowCount(this.tableRowCount > this.selectedColumnLabels.length ? this.tableRowCount : this.selectedColumnLabels.length)
          //       this.ctx.clearRect(column?.x1 - 2, column?.y1 - 202, (column?.x2 - column?.x1) + 2, 200);
          //       // this.ctx.strokeRect(column?.x1, column?.y1 - ((20 * this.tableRowCount) + 10), column?.x2 - column?.x1, (20 * this.tableRowCount))
          //       this.ctx.fillStyle = "#FFFFFF";
          //       this.ctx.fillRect(column?.x1 + 1, column?.y1 - (20 * this.tableRowCount) - 9, (column?.x2 - column?.x1) - 2, (20 * this.tableRowCount) - 2)
          //       this.selectedColumnLabels.map((label, index) => {
          //         // this.ctx.font = "12px Arial";
          //         this.ctx.fillStyle = 'rgba(0, 144, 226, 0.5)';
          //         const maxLabelLength = ((column.x2 - column.x1) < 80) ? Math.floor(((column.x2 - column.x1) - 10 ) / 5) : label.length
          //         /// label stringinin maxLabelLength indexinden sonra nokta koy ve sadece oraya kadar yazdır
          //         this.ctx.fillText(label ? label.substring(0, maxLabelLength) + '.' : column?.column[0], column?.x1 + 10, column?.y1 - (18 * (index + 1)));
          //       })
          //     } else if (this.arrayEquals(column.column, item.column) && isColumnEmpty ) {
          //       maxLabelCount = maxLabelCount > 0 ? maxLabelCount : 1
          //       this.ctx.clearRect(column?.x1 - 2, column?.y1 - 202, (column?.x2 - column?.x1) + 2, 200);
          //       this.ctx.strokeRect(column?.x1, column?.y1 - ((20 * maxLabelCount) + 10), column?.x2 - column?.x1, (20 * maxLabelCount))
          //       this.ctx.fillStyle = "#FFFFFF";
          //       this.ctx.fillRect(column?.x1 + 1, column?.y1 - (20 * maxLabelCount) - 9, (column?.x2 - column?.x1) - 2, (20 * maxLabelCount) - 2)
          //       this.ctx.fillStyle = 'rgba(0, 144, 226, 0.5)';
          //       this.ctx.fillText(column?.labelName[0] ? column?.labelName[0] : column?.column[0], column?.x1 + 10, column?.y1 - 17);
          //     }
          //   })
          // })
        },
        arrayEquals(a, b) {
          return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
        },
    },
    mounted() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.rect = this.canvas.getBoundingClientRect()
      },
      watch: {
        selectedColumnLabels (val) {
          // TODO: fix this
          val.length > this.tableRowCount ? this.setTableRowCount(val.length) : this.setTableRowCount(this.tableRowCount)
          this.columnLabels.map((column) => {
            // this.ctx.clearRect(column?.x1, (column?.y1 - ((20 * (this.tableRowCount - 1)) + 10)) + 2, (column?.x2 - column?.x1) + 2, 2);
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillRect(column?.x1, (column?.y1 - ((20 * (this.tableRowCount - 1)) + 10)) - 1, (column?.x2 - column?.x1) + 2, 2)
            this.ctx.fillStyle = 'rgba(0, 144, 226, 0.5)';
            this.ctx.strokeRect(column?.x1, column?.y1 - ((20 * this.tableRowCount) + 10), column?.x2 - column?.x1, (20 * this.tableRowCount))
          })
        }
    }
}