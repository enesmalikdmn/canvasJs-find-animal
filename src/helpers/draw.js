import store from "@/store";

export const saveAndDrawLine = (
  drawActions,
  startX,
  startY,
  lineWidth,
  lineHeight,
  drawingType,
  pageHeight,
  pageWidth
) => {
  drawActions.push({
    startX: startX,
    startY: startY,
    lineWidth: lineWidth,
    lineHeight: lineHeight,
    drawingType: drawingType,
    bottom: pageHeight,
    height: pageHeight,
    left: 902,
    right: 1542,
    top: 0,
    width: pageWidth,
    x: 902,
    y: 0,
    h: 0,
    w: 0,
  });
};

export const drawLine = (ctx, moveTo1, moveTo2, lineTo1, lineTo2) => {
  ctx.beginPath();
  ctx.moveTo(moveTo1, moveTo2);
  ctx.lineTo(lineTo1, lineTo2);
  ctx.stroke();
};

export const drawColAndRow = (line, ctx, lineColor, selectedLineColor) => {
  if (line.drawingType === "columnPiece") {
    drawLine(
      ctx,
      line.startX,
      line.startY,
      line.startX,
      line.startY + line.lineHeight
    );
  } else if (line.drawingType === "rowPiece") {
    drawLine(
      ctx,
      line.startX,
      line.startY,
      line.startX + line.lineWidth,
      line.startY
    );
  } else if (line.drawingType === "column") {
    ctx.strokeStyle = line.isSelected ? selectedLineColor : lineColor;
    drawLine(
      ctx,
      line.startX,
      line.startY,
      line.startX,
      line.startY + line.lineHeight
    );
    ctx.strokeStyle = lineColor;
  } else if (line.drawingType === "row") {
    ctx.strokeStyle = line.isSelected ? selectedLineColor : lineColor;
    drawLine(
      ctx,
      line.startX,
      line.startY,
      line.startX + line.lineWidth,
      line.startY
    );
    ctx.strokeStyle = lineColor;
  } else if (line.drawingType === "rectangle") {
    ctx.strokeRect(line.startX, line.startY, line.w, line.h);
  }
};
export const drawingAllColumn = (
  drawActions,
  drawCount,
  ctx,
  mouseX,
  mouseY,
  pageWidth,
  pageHeight
) => {
  drawActions.map((drawing) => {
    if (isMouseInRect(mouseX, mouseY, drawing)) {
      saveAndDrawLine(
        drawActions,
        mouseX,
        drawing.startY,
        0,
        drawing?.h,
        "column",
        pageHeight,
        pageWidth
      );
      store.dispatch("viewer/setDrawCount", drawCount + 1);
    }
  });
};
export const drawingAllRow = (
  drawActions,
  drawCount,
  ctx,
  mouseX,
  mouseY,
  pageWidth,
  pageHeight
) => {
  drawActions.map((drawing) => {
    if (isMouseInRect(mouseX, mouseY, drawing)) {
      saveAndDrawLine(
        drawActions,
        drawing.startX,
        mouseY,
        drawing?.w,
        0,
        "row",
        pageHeight,
        pageWidth
      );
      store.dispatch("viewer/setDrawCount", drawCount + 1);
      const drawingAutoRow = store.getters['viewer/drawingAutoRow']
      drawActions.map((item) => {
        if (drawingAutoRow && item.drawingType === 'row' && mouseY > item.startY && getRowCount(drawActions) == 2 && item.startX === drawing.startX && item.startY !== mouseY) {
          let startY = mouseY + (mouseY - item.startY);
          while (startY < getRectangleHeight(drawActions) && !(checkCloseEnough(startY, getRectangleHeight(drawActions), (mouseY - item.startY)))) {
            saveAndDrawLine(
              drawActions,
              drawing.startX,
              startY,
              drawing?.w,
              0,
              "row",
              pageHeight,
              pageWidth
            );
            startY += (mouseY - item.startY)
          }
        }
      });
    }
  });
};
export const getRectangleHeight = (drawActions) => {
  let height = 0;
  drawActions.map((action) => {
    if (action.drawingType === "rectangle" ) {
      height = action.startY + action.h;
    }
  });
  return height;
};
export const  getRowCount = (drawActions) => {
  let count = 0;
  drawActions.map((action) => {
    if ( action.drawingType === "row"){
      count++;
    }
  });
  return count;
}

export const resizeRectLines = (drawActions, drawCount, resizePoint) => {
  drawActions.map((action) => {
    if (
      action.drawingType === "column" &&
      action.startY > drawActions[drawCount].startY - 60 &&
      action.startY <
        drawActions[drawCount].startY + drawActions[drawCount].h &&
      action.startX <
        drawActions[drawCount].startX + drawActions[drawCount].w &&
      action.startX > drawActions[drawCount].startX
    ) {
      action.startY = drawActions[drawCount].startY;
    } else if (
      action.drawingType === "row" &&
      action.startX > drawActions[drawCount].startX - 60 &&
      action.startX <
        drawActions[drawCount].startX + drawActions[drawCount].w &&
      action.startY <
        drawActions[drawCount].startY + drawActions[drawCount].h &&
      action.startY > drawActions[drawCount].startY
    ) {
      action.startX = drawActions[drawCount].startX;
    } else if (
      action.drawingType === "columnPiece" &&
      drawActions[drawCount].startY > action.startY + action.lineHeight
    ) {
      action = {};
    } else if (
      action.drawingType === "rowPiece" &&
      drawActions[drawCount].startX > action.startX + action.lineWidth
    ) {
      action = {};
    } else if (
      action.drawingType === "columnPiece" &&
      action.startY > drawActions[drawCount].startY - 60 &&
      action.startY <
        drawActions[drawCount].startY + drawActions[drawCount].h &&
      action.startX <
        drawActions[drawCount].startX + drawActions[drawCount].w &&
      action.startX > drawActions[drawCount].startX
    ) {
      if (
        (resizePoint === "dragBL" || resizePoint === "dragBR") &&
        checkCloseEnough(
          drawActions[drawCount].startY + drawActions[drawCount].h,
          action.startY + action.lineHeight,
          10
        )
      ) {
        action.lineHeight =
          drawActions[drawCount].h -
          (action.startY - drawActions[drawCount].startY);
      } else if (
        checkCloseEnough(action.startY, drawActions[drawCount].startY, 10)
      ) {
        action.lineHeight += action.startY - drawActions[drawCount].startY;
        action.startY = drawActions[drawCount].startY;
      }
    } else if (
      action.drawingType === "rowPiece" &&
      action.startX > drawActions[drawCount].startX - 60 &&
      action.startX <
        drawActions[drawCount].startX + drawActions[drawCount].w &&
      action.startY <
        drawActions[drawCount].startY + drawActions[drawCount].h &&
      action.startY > drawActions[drawCount].startY
    ) {
      if (
        (resizePoint === "dragTR" || resizePoint === "dragBR") &&
        checkCloseEnough(
          drawActions[drawCount].startX + drawActions[drawCount].w,
          action.startX + action.lineWidth,
          10
        )
      ) {
        action.lineWidth =
          drawActions[drawCount].w -
          (action.startX - drawActions[drawCount].startX);
      } else if (
        checkCloseEnough(action.startX, drawActions[drawCount].startX, 10)
      ) {
        action.lineWidth += action.startX - drawActions[drawCount].startX;
        action.startX = drawActions[drawCount].startX;
      }
    }
  });
  // 60 resize da aniden yapılacak değişiklik için pay
};
export const checkCloseEnough = (p1, p2, resizingSensitivity) => {
  return Math.abs(p1 - p2) < resizingSensitivity;
};
export const findToNextCol = (
  referenceLine,
  drawActions,
  pageWidth,
  mouseY
) => {
  let nextColXPosition = 0;
  for (let i = referenceLine.startX + 1; i < pageWidth; i++) {
    drawActions.map((action) => {
      // findind closest target line to the reference line
      const colLine = action.lineHeight + action.startY;
      if (
        action.startX === i &&
        action.lineHeight &&
        colLine > mouseY &&
        mouseY > action.startY
      ) {
        i = pageWidth;
        nextColXPosition = action.startX;
      } else if (
        action.startX + action.w === i &&
        action.startY < mouseY &&
        mouseY < action.startY + action.h
      ) {
        i = pageWidth;
        nextColXPosition = action.startX + action.w;
      }
    });
  }
  return nextColXPosition;
};
export const backColForPreviewLine = (referenceX, drawActions, mouseY) => {
  let nextColXPosition = 0;
  for (let i = referenceX - 1; i > 0; i--) {
    drawActions.map((action) => {
      action.startX = Math.round(action.startX);
      action.w = Math.round(action.w);
      if (
        action.startX === i &&
        (action.lineHeight || action.h) &&
        mouseY >= action.startY &&
        (mouseY <= action.startY + action.h ||
          mouseY <= Math.round(action.startY + action.lineHeight))
      ) {
        i = 0;
        nextColXPosition = action.startX;
      }
    });
  }
  return nextColXPosition;
};
export const backRowForPreviewLine = (referenceY, drawActions, mouseX) => {
  let nextColXPosition = 0;
  for (let i = referenceY - 1; i > 0; i--) {
    drawActions.map((action) => {
      action.startX = Math.round(action.startX);
      action.w = Math.round(action.w);
      if (
        action.startY === i &&
        (action.lineWidth || action.w) &&
        mouseX >= action.startX &&
        (mouseX <= action.startX + action.w ||
          mouseX <= Math.round(action.startX + action.lineWidth))
      ) {
        i = 0;
        nextColXPosition = action.startY;
      }
    });
  }
  return nextColXPosition;
};
export const nextColForPreviewLine = (
  referenceX,
  drawActions,
  mouseY,
  pageWidth
) => {
  let nextColXPosition = 0;
  referenceX = Math.round(referenceX);
  mouseY = Math.round(mouseY);
  for (let i = referenceX + 1; i < pageWidth; i++) {
    drawActions.map((action) => {
      action.startX = Math.round(action.startX);
      action.w = Math.round(action.w);
      if (
        (action.startX === i || i === action.startX + action.w) &&
        (action.lineHeight || action.h) &&
        mouseY >= Math.round(action.startY) &&
        (mouseY <= action.startY + action.h ||
          mouseY <= action.startY + action.lineHeight)
      ) {
        i = pageWidth;
        nextColXPosition = action.startX;
        if (action.w) {
          nextColXPosition += action.w;
        }
      }
    });
  }
  return nextColXPosition;
};
export const nextRowForPreviewLine = (
  referenceY,
  drawActions,
  mouseX,
  pageHeight
) => {
  let nextColXPosition = 0;
  referenceY = Math.round(referenceY);
  mouseX = Math.round(mouseX);
  for (let i = referenceY + 1; i < pageHeight; i++) {
    drawActions.map((action) => {
      action.startY = Math.round(action.startY);
      action.h = Math.round(action.h);
      if (
        (action.startY === i || i === action.startY + action.h) &&
        (action.lineWidth || action.w) &&
        mouseX >= action.startX &&
        (mouseX <= action.startX + action.w ||
          mouseX <= Math.round(action.startX + action.lineWidth))
      ) {
        i = pageHeight;
        nextColXPosition = action.startY;
        if (action.w) {
          nextColXPosition += action.h;
        }
      }
    });
  }
  return nextColXPosition;
};
export const findToNextRow = (
  referenceLine,
  drawActions,
  pageHeight,
  mouseX
) => {
  let nextRowYPosition = 0;
  for (let i = referenceLine.startY + 1; i < pageHeight; i++) {
    drawActions.map((action) => {
      // findind closest target line to the reference line
      const rowLine = action.lineWidth + action.startX;
      if (
        action.startY === i &&
        action.lineWidth &&
        rowLine > mouseX &&
        mouseX > action.startX
      ) {
        i = pageHeight;
        nextRowYPosition = action.startY;
      } else if (
        action.startY + action.h === i &&
        action.startX < mouseX &&
        mouseX < action.startX + action.w
      ) {
        i = pageHeight;
        nextRowYPosition = action.startY + action.h;
      }
    });
  }
  return nextRowYPosition;
};

export const isDuplicate = (drawing, drawActions, index) => {
  drawActions.map((action, i) => {
    if (
      action.startX === drawing.startX &&
      action.startY === drawing.startY &&
      i !== index &&
      drawing.lineWidth > action.lineWidth &&
      drawing.drawingType === action.drawingType
    ) {
      drawActions.splice(index, 1);
    }
  });
  return drawActions;
};

export const isMouseOnLine = (mouseX, mouseY, drawing) => {
  let isOnLine = false;
  if (
    (checkCloseEnough(mouseX, drawing.startX, 10) &&
      mouseY >= drawing.startY &&
      mouseY <= drawing.startY + drawing?.lineHeight) ||
    (checkCloseEnough(mouseY, drawing.startY, 10) &&
      mouseX >= drawing.startX &&
      mouseX <= drawing.startX + drawing?.lineWidth)
  ) {
    isOnLine = true;
  }
  return isOnLine;
};

export const isMouseOnRect = (mouseX, mouseY, drawing) => {
  let isOnRect = false;
  if (
    (mouseX >= drawing.startX &&
      mouseX <= drawing.startX + drawing.w &&
      (checkCloseEnough(mouseY, drawing.startY, 10) ||
        checkCloseEnough(mouseY, drawing.startY + drawing.h, 10))) ||
    ((checkCloseEnough(mouseX, drawing.startX, 10) ||
      checkCloseEnough(mouseX, drawing.startX + drawing.w, 10)) &&
      mouseY >= drawing.startY &&
      mouseY <= drawing.startY + drawing.h)
  ) {
    isOnRect = true;
  }
  return isOnRect;
};

export const isMouseInCell = (mouseX, mouseY, cellOfRectangle) => {
  let rectangle = {};
  cellOfRectangle.map((cell) => {
    if (
      mouseX > cell.x1 &&
      mouseX < cell.x2 &&
      mouseY > cell.y1 &&
      mouseY < cell.y2
    ) {
      rectangle = cell;
    }
  });
  return rectangle;
};
export const isMouseInRect = (mouseX, mouseY, drawing) => {
  let isInRect = false;
  if (
    drawing.drawingType === "rectangle" &&
    mouseX > drawing?.startX &&
    mouseX < drawing?.startX + drawing?.w &&
    mouseY > drawing?.startY &&
    mouseY < drawing?.startY + drawing?.h
  ) {
    isInRect = true;
  }
  return isInRect;
};

export const resizeRectangleLines = (
  drawActions,
  drawCount,
  resizedXPos,
  resizedYPos
) => {
  drawActions.map((action) => {
    if (
      action.drawingType === "row" &&
      !isNaN(resizedXPos) &&
      action.startX >= drawActions[drawCount].startX &&
      action.startX <=
        drawActions[drawCount].startX + drawActions[drawCount].w &&
      action.startY >= drawActions[drawCount].startY &&
      action.startY <= drawActions[drawCount].startY + drawActions[drawCount].h
    ) {
      action.lineWidth += resizedXPos;
    } else if (
      action.drawingType === "column" &&
      !isNaN(resizedYPos) &&
      action.startX > drawActions[drawCount].startX &&
      action.startX <=
        drawActions[drawCount].startX + drawActions[drawCount].w &&
      action.startY >= drawActions[drawCount].startY &&
      action.startY <= drawActions[drawCount].startY + drawActions[drawCount].h
    ) {
      action.lineHeight += resizedYPos;
    }
  });
  return drawActions;
};

export const getCell = (drawActions, pageHeight) => {
  let rectangleCells = [];
  drawActions.map((drawing) => {
    if (
      drawing.drawingType === "column" ||
      (drawing.drawingType === "columnPiece" && drawing.lineHeight)
    ) {
      for (
        let j = drawing.startY;
        j <= drawing.startY + drawing.lineHeight;
        j++
      ) {
        const y2PositionOfRow = nextRowForPreviewLine(
          j,
          drawActions,
          drawing.startX - 1,
          pageHeight
        );
        const x1PositionOfRow = backColForPreviewLine(
          drawing.startX,
          drawActions,
          y2PositionOfRow - 1
        );
        const y1PositionOfRow = backRowForPreviewLine(
          y2PositionOfRow,
          drawActions,
          drawing.startX - 1
        );
        rectangleCells.push({
          x1: x1PositionOfRow,
          y1: y1PositionOfRow,
          x2: drawing.startX,
          y2: y2PositionOfRow,
          rotateDegree: drawing.rotateDegree,
          labelName: [],
          column: [],
          row: [],
        });
        if (y2PositionOfRow === 0) return;
        j = y2PositionOfRow + 1;
      }
    } else if (drawing.drawingType === "rectangle" && drawing.w && drawing.h) {
      for (let j = drawing.startY; j <= drawing.startY + drawing.h; j++) {
        const y2PositionOfRow = nextRowForPreviewLine(
          j,
          drawActions,
          drawing.startX + drawing.w - 1,
          pageHeight
        );
        const x1PositionOfRow = backColForPreviewLine(
          Math.round(drawing.startX + drawing.w),
          drawActions,
          y2PositionOfRow - 1
        );
        const y1PositionOfRow = backRowForPreviewLine(
          y2PositionOfRow,
          drawActions,
          drawing.startX + drawing.w - 1
        );
        rectangleCells.push({
          x1: x1PositionOfRow,
          y1: y1PositionOfRow,
          x2: drawing.startX + drawing.w,
          y2: y2PositionOfRow,
          rotateDegree: drawing.rotateDegree,
          labelName: [],
          column: [],
          row: [],
        });
        if (y2PositionOfRow === 0) return;
        j = y2PositionOfRow + 1;
      }
    }
  });
  let rowsOfRectangle = [];
  rectangleCells.map((cell) => {
    let cellArray2 = [];
    rectangleCells.map((cell2) => {
      if (cell.y1 === cell2.y1 && cell.y2 === cell2.y2) {
        cellArray2.push(cell2);
      }
    });
    rowsOfRectangle.push(cellArray2);
  });
  let columnSelector = [];
  rowsOfRectangle.map((cell) => {
    if (cell.length > columnSelector.length) {
      columnSelector = cell;
    }
  });
  columnSelector
    .sort((a, b) => a.x1 - b.x1)
    .map((selectorCell, index) => {
      rectangleCells.map((otherCell) => {
        if (
          (otherCell.x1 === selectorCell.x1 &&
            otherCell.y1 === selectorCell.y1 &&
            otherCell.x2 === selectorCell.x2 &&
            otherCell.y2 === selectorCell.y2) ||
          (!columnSelector.includes(otherCell) &&
            ((selectorCell.x1 >= otherCell.x1 && selectorCell.x1 < otherCell.x2) ||
              (selectorCell.x1 <= otherCell.x1 &&
                selectorCell.x2 > otherCell.x1 &&
                selectorCell.x2 <= otherCell.x2)))
        ) {
          otherCell.column.push(index + 1);
        }
      });
    });

  let columnOfRectangle = [];
  rectangleCells.map((cell) => {
    let cellArray2 = [];
    rectangleCells.map((cell2) => {
      if (cell.x1 === cell2.x1 && cell.x2 === cell2.x2) {
        cellArray2.push(cell2);
      }
    });
    columnOfRectangle.push(cellArray2);
  });
  let rowSelector = [];
  columnOfRectangle.map((cell) => {
    if (cell.length > rowSelector.length) {
      rowSelector = cell;
    }
  });
  rowSelector
    .sort((a, b) => a.y1 - b.y1)
    .map((selectorCell, index) => {
      rectangleCells.map((otherCell) => {
        if (
          (otherCell.x1 === selectorCell.x1 &&
            otherCell.y1 === selectorCell.y1 &&
            otherCell.x2 === selectorCell.x2 &&
            otherCell.y2 === selectorCell.y2) ||
          (!rowSelector.includes(otherCell) &&
            ((selectorCell.y1 >= otherCell.y1 && selectorCell.y1 < otherCell.y2) ||
              (selectorCell.y1 <= otherCell.y1 &&
                selectorCell.y2 > otherCell.y1 &&
                selectorCell.y2 <= otherCell.y2)))
        ) {
          otherCell.row.push(index + 1);
        }
      });
    });
  return rectangleCells;
};

// write reverse function of getCell function
export const getDrawAction = (cells, drawActionsRectangle) => {
  let drawActions = [];
  drawActions.push(drawActionsRectangle);
  cells.map((cell) => {
    if (cell.x2 !== drawActionsRectangle.startX + drawActionsRectangle.w) {
      drawActions.push({
        bottom:710,
        drawingType: "column",
        h:0,
        height:710,
        isSelected:false,
        left:902,
        lineHeight: cell.y2 - cell.y1,
        lineWidth: 0,
        right:1542,
        startX: cell.x2,
        startY: cell.y1,
        top:0,
        w:0,
        width:876,
        x:902,
        y:0,
      });
    }
    if (cell.y2 !== drawActionsRectangle.startY + drawActionsRectangle.h) {
      drawActions.push({
        bottom:710,
        drawingType: "row",
        h:0,
        height:710,
        isSelected:false,
        left:902,
        lineHeight: 0,
        lineWidth: cell.x2 - cell.x1,
        right:1542,
        startX: cell.x1,
        startY: cell.y2,
        top:0,
        w:0,
        width:876,
        x:902,
        y:0,
      });
    }
  });
  // drawActions.map((drawAction, i) => {
  //   drawActions.map((drawAction2, index) => {
  //     if (drawAction.drawingType === "row" && drawAction2.drawingType === "row" && drawAction.startX !== drawAction2.startX && drawAction.startX + drawAction.lineWidth === drawAction2.startX) {
  //       // birleşmesi gereken rowlar
  //       // delete drawAction and drawAction2 in drawActions
  //       drawActions.splice(index, 1);
  //       const test = {
  //         bottom:710,
  //         drawingType: "row",
  //         h:0,
  //         height:710,
  //         isSelected:false,
  //         left:902,
  //         lineHeight: 0,
  //         lineWidth: drawAction.lineWidth + drawAction2.lineWidth,
  //         right:1542,
  //         startX: drawAction.startX,
  //         startY: drawAction.startY,
  //         top:0,
  //         w:0,
  //         width:876,
  //         x:902,
  //         y:4,
  //       }
  //       // replace test instead of drawAction
  //       drawActions.splice(i, 1, test);
  //     } else {
  //       // devamı yoksa row piece
  //     }
  //     // if (drawAction.drawingType === "column" && drawAction2.drawingType === "column" && drawAction.startY !== drawAction2.startY && drawAction.startY + drawAction.lineHeight === drawAction2.startY) {
  //     //   // birleşmesi gereken columnlar
  //     //   // delete drawAction and drawAction2 in drawActions
  //     //   console.log(drawAction.startY + drawAction.lineHeight, drawAction2.startY);
  //     //   drawActions.splice(index, 1);
  //     //   drawActions.splice(i, 1);
  //     //   drawActions.push({
  //     //     bottom:710,
  //     //     drawingType: "column",
  //     //     h:0,
  //     //     height:710,
  //     //     isSelected:false,
  //     //     left:902,
  //     //     lineHeight: drawAction.lineHeight + drawAction2.lineHeight,
  //     //     lineWidth: 0,
  //     //     right:1542,
  //     //     startX: drawAction.startX,
  //     //     startY: drawAction.startY,
  //     //     top:0,
  //     //     w:0,
  //     //     width:876,
  //     //     x:902,
  //     //     y:0,
  //     //   })
  //     // }
  //   });
  // });
  return drawActions;
};
