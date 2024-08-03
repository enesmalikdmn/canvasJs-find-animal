<template>
  <div>
    <el-dialog
        title="Choose an animal"
        :modal="false"
        :visible.sync="isDialogVisible"
        width="30%"
        :before-close="() => $emit('close')">
        <div class="flex flex-wrap"
          :style="{ gap: '0.4rem', padding: '0.6px' }"
          >
            <div
            class="flex justify-start"
            v-for="(item, index) in getLabelBoxItems" :key="index"
            >
              <div class="flex w-20 gap-1">
                <input
                type="checkbox"
                :id="item.label"
                :checked="isChecked(item)"
                @input="handleLabelChange"
                />
                <label class="flex justify-center items-center" >{{ item.label }}</label>
              </div>
            </div>
          </div>
      </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { labelBoxItems } from "./LabelBoxSchema.js";

export default {
  name: "LabelBox",
  data() {
    return {
      isDialogVisible: false,
    };
  },
  props: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    showLabelBox: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters("viewer", ["selectedCell", "cellOfRectangle", "selectedRectangles"]),
    getLabelBoxItems () {
      return labelBoxItems;
    },
    labelBoxStyle() {
      return {
        position: "absolute",
        left: `${this.x + 5}px`,
        top: `${this.y + 5}px`,
        width: `${this.width}px`,
        height: `${this.height}px`,
        border: "1px solid black",
        backgroundColor: "white",
        color: "black",
        fontSize: "12px",
        borderRadius: "0.5rem",
      };
    }
  },
  methods: {
    ...mapActions("viewer", ["setSelectedCell", "setCellOfRectangle"]),
    isChecked(item) {
      return this.selectedRectangles?.some((cell) => cell?.labelName?.includes(item.label)) 
    },
    handleLabelChange(e) {
      this.selectedRectangles?.map((cell) => {
        this.cellOfRectangle.map((item) => {
          if (item.x1 === cell.x1 && item.y1 === cell.y1 && item.x2 === cell.x2 && item.y2 === cell.y2) {
            if (e.target.checked) {
              item.labelName = [...item.labelName, e.target.id];
              this.$emit("fillCell", item);
            } else {
              item.labelName = item.labelName.filter(
                (item) => item !== e.target.id
              );
              this.$emit("clearCell", item);
            }
          }
        });
        this.setCellOfRectangle(this.cellOfRectangle)
      });
      this.$emit("fillColumnLabels");
      }
  },
  watch: {
    selectedCell() {
      this.cellOfRectangle.map((cell) => {
        if (cell.x1 === this.selectedCell.x1 && cell.y1 === this.selectedCell.y1 && cell.x2 === this.selectedCell.x2 && cell.y2 === this.selectedCell.y2) {
          cell.labelName = this.selectedCell.labelName;
        }
      });
    },
    showLabelBox() {
      this.isDialogVisible = this.showLabelBox;
    }
  },
};
</script>
<style scoped>
.dp-icon-x {
  background-color: #184171;
  border-radius: 0.4rem 0.4rem 0 0;
}
</style>
