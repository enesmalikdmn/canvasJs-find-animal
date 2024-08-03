const state = {
  selectedTool: '',
  pdfWidth: 0,
  pdfHeight: 0,
  drawActions: [{
    drawingMode: 'resizableRectangle',
    bottom:951,
    height:810,
    left:1075,
    right:1715,
    top:51,
    width:1000,
    x:1075,
    y:51
  }],
  drawCount: 0,
  lineColor: "rgba(0, 144, 226, 0.5)",
  selectedLineColor: "rgba(0, 144, 226, 1)",
  previewLineType: 'column',
  sensitivity: 4,
  deletedCount: 0,
  deletedPieceCount: 0,
  deletedLineIndex: 0,
  scale: 1,
  isDraggable: false,
  rotateDegree: 0,
  isGridActive: false,
  cellOfRectangle: [{
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
  }],
  selectedCell: {},
  selectedLineInfo: {},
  imgDrawingList: [],
  imgLabelList: [],
  columnLabels: [],
  isPreviewLineActive: false,
  tableData: {},
  columnHeaders: [],
  selectedRectangles: [],
  filledCells: [],
  drawingAutoRow: false,
  rectPosition: {},
  tableRowCount: 0,
};

const getters = {
  selectedTool: (state) => state.selectedTool,
  pdfWidth: (state) => state.pdfWidth,
  pdfHeight: (state) => state.pdfHeight,
  drawActions: (state) => state.drawActions,
  drawCount: (state) => state.drawCount,
  lineColor: (state) => state.lineColor,
  selectedLineColor: (state) => state.selectedLineColor,
  previewLineType: (state) => state.previewLineType,
  sensitivity: (state) => state.sensitivity,
  deletedCount: (state) => state.deletedCount,
  deletedPieceCount: (state) => state.deletedPieceCount,
  deletedLineIndex: (state) => state.deletedLineIndex,
  scale: (state) => state.scale,
  isDraggable: (state) => state.isDraggable,
  rotateDegree: (state) => state.rotateDegree,
  isGridActive: (state) => state.isGridActive,
  cellOfRectangle: (state) => state.cellOfRectangle,
  selectedCell: (state) => state.selectedCell,
  selectedLineInfo: (state) => state.selectedLineInfo,
  imgDrawingList: (state) => state.imgDrawingList,
  imgLabelList: (state) => state.imgLabelList,
  columnLabels: (state) => state.columnLabels,
  isPreviewLineActive: (state) => state.isPreviewLineActive,
  tableData: (state) => state.tableData,
  columnHeaders: (state) => state.columnHeaders,
  selectedRectangles: (state) => state.selectedRectangles,
  filledCells: (state) => state.filledCells,
  drawingAutoRow: (state) => state.drawingAutoRow,
  rectPosition: (state) => state.rectPosition,
  tableRowCount: (state) => state.tableRowCount,
};

const mutations = {
  SET_SELECTED_TOOL(state, selectedTool) {
    state.selectedTool = selectedTool;
  },
  SET_PDF_WIDTH(state, pdfWidth) {
    state.pdfWidth = pdfWidth;
  },
  SET_PDF_HEIGHT(state, pdfHeight) {
    state.pdfHeight = pdfHeight;
  },
  SET_DRAW_ACTIONS(state, drawActions) {
    state.drawActions = drawActions;
  },
  SET_DRAW_COUNT(state, drawCount) {
    state.drawCount = drawCount;
  },
  SET_PREVIEW_LINE_TYPE(state, previewLineType) {
    state.previewLineType = previewLineType;
  },
  SET_DELETED_COUNT(state, deletedCount) {
    state.deletedCount = deletedCount;
  },
  SET_DELETED_PIECE_COUNT(state, deletedPieceCount) {
    state.deletedPieceCount = deletedPieceCount;
  },
  SET_DELETED_LINE_INDEX(state, deletedLineIndex) {
    state.deletedLineIndex = deletedLineIndex;
  },
  SET_SCALE(state, scale) {
    state.scale = scale;
  },
  SET_IS_DRAGABLE(state, isDraggable) {
    state.isDraggable = isDraggable;
  },
  SET_ROTATE_DEGREE(state, rotateDegree) {
    state.rotateDegree = rotateDegree;
  },
  SET_IS_GRID_ACTIVE(state, isGridActive) {
    state.isGridActive = isGridActive;
  },
  SET_CELL_OF_RECTANGLE(state, cellOfRectangle) {
    state.cellOfRectangle = cellOfRectangle;
  },
  SET_SELECTED_CELL(state, selectedCell) {
    state.selectedCell = selectedCell;
  },
  SET_SELECTED_LINE_INFO(state, selectedLineInfo) {
    state.selectedLineInfo = selectedLineInfo;
  },
  SET_IMG_DRAWING_LIST(state, imgDrawingList) {
    state.imgDrawingList.push(imgDrawingList);
  },
  SET_IMG_LABEL_LIST(state, imgLabelList) {
    state.imgLabelList.push(imgLabelList);
  },
  SET_COLUMN_LABELS(state, columnLabels) {
    state.columnLabels = columnLabels;
  },
  SET_IS_PREVIEW_LINE_ACTIVE(state, isPreviewLineActive) {
    state.isPreviewLineActive = isPreviewLineActive;
  },
  SET_TABLE_DATA(state, tableData) {
    state.tableData = tableData;
  },
  SET_COLUMN_HEADERS(state, columnHeaders) {
    state.columnHeaders = columnHeaders;
  },
  SET_SELECTED_RECTANGLES(state, selectedRectangles) {
    state.selectedRectangles = selectedRectangles;
  },
  SET_FILLED_RECTANGLES(state, filledCells) {
    state.filledCells = filledCells;
  },
  SET_DRAWING_AUTO_ROW(state, drawingAutoRow) {
    state.drawingAutoRow = drawingAutoRow;
  },
  SET_RECT_POSITION(state, rectPosition) {
    state.rectPosition = rectPosition
  },
  SET_TABLE_ROW_COUNT(state, tableRowCount) {
    state.tableRowCount = tableRowCount
  }
};

const actions = {
  setSelectedTool({ commit }, selectedTool) {
    commit('SET_SELECTED_TOOL', selectedTool);
  },
  setPdfWidth({ commit }, pdfWidth) {
    commit('SET_PDF_WIDTH', pdfWidth);
  },
  setPdfHeight({ commit }, pdfHeight) {
    commit('SET_PDF_HEIGHT', pdfHeight);
  },
  setDrawActions({ commit }, drawActions) {
    commit('SET_DRAW_ACTIONS', drawActions);
  },
  setDrawCount({ commit }, drawCount) {
    commit('SET_DRAW_COUNT', drawCount);
  },
  setPreviewLineType({ commit }, previewLineType) {
    commit('SET_PREVIEW_LINE_TYPE', previewLineType);
  },
  setDeletedCount({ commit }, deletedCount) {
    commit('SET_DELETED_COUNT', deletedCount);
  },
  setDeletedPieceCount({ commit }, deletedPieceCount) {
    commit('SET_DELETED_PIECE_COUNT', deletedPieceCount);
  },
  setDeletedLineIndex({ commit }, deletedLineIndex) {
    commit('SET_DELETED_LINE_INDEX', deletedLineIndex);
  },
  setScale({ commit }, scale) {
    commit('SET_SCALE', scale);
  },
  setIsDraggable({ commit }, isDraggable) {
    commit('SET_IS_DRAGABLE', isDraggable);
  },
  setRotateDegree({ commit }, rotateDegree) {
    commit('SET_ROTATE_DEGREE', rotateDegree);
  },
  setIsGridActive({ commit }, isGridActive) {
    commit('SET_IS_GRID_ACTIVE', isGridActive);
  },
  setCellOfRectangle({ commit }, cellOfRectangle) {
    commit('SET_CELL_OF_RECTANGLE', cellOfRectangle);
  },
  setSelectedCell({ commit }, selectedCell) {
    commit('SET_SELECTED_CELL', selectedCell);
  },
  setSelectedLineInfo({ commit }, selectedLineInfo) {
    commit('SET_SELECTED_LINE_INFO', selectedLineInfo);
  },
  setImgDrawingList({ commit }, imgDrawingList) {
    commit('SET_IMG_DRAWING_LIST', imgDrawingList);
  },
  setImgLabelList({ commit }, imgLabelList) {
    commit('SET_IMG_LABEL_LIST', imgLabelList);
  },
  setColumnLabels({ commit }, columnLabels) {
    commit('SET_COLUMN_LABELS', columnLabels);
  },
  setIsPreviewLineActive({ commit }, isPreviewLineActive) {
    commit('SET_IS_PREVIEW_LINE_ACTIVE', isPreviewLineActive);
  },
  setTableData({ commit }, tableData) {
    commit('SET_TABLE_DATA', tableData);
  },
  setColumnHeaders({ commit }, columnHeaders) {
    commit('SET_COLUMN_HEADERS', columnHeaders);
  },
  setSelectedRectangles({ commit }, selectedRectangles) {
    commit('SET_SELECTED_RECTANGLES', selectedRectangles);
  },
  setFilledCells({ commit }, filledCells) {
    commit('SET_FILLED_RECTANGLES', filledCells);
  },
  setDrawingAutoRow({ commit }, drawingAutoRow) {
    commit('SET_DRAWING_AUTO_ROW', drawingAutoRow);
  },
  setRectPosition({commit}, rectPosition) {
    commit('SET_RECT_POSITION', rectPosition)
  },
  setTableRowCount({commit}, tableRowCount) {
    commit('SET_TABLE_ROW_COUNT', tableRowCount)
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};
