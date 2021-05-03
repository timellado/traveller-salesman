import { graphConstants, nodeStyle } from './constants.js';

// const nodeArray = [8, 12, "1 2 10", "1 3 5", "3 5 2", "4 2 8", "2 7 15", "1 8 15", "6 2 12", "2 5 2", "8 4 6", "3 7 10", "5 6 2", "6 8 8"];

// const response = "136245, 50";


const delay = ms => new Promise(res => setTimeout(res, ms));

export const setupCanvas = (nodeArray) => {
  // Get the canvas
  graphConstants.container = document.getElementById('canvas-container');
  graphConstants.canvas = document.getElementById('canv');
  graphConstants.context = graphConstants.canvas.getContext('2d');

  // Set the size of the canvas given the ammount of nodes
  graphConstants.size = (nodeArray[0]) * 50;
  graphConstants.circleRadius = (graphConstants.size - 50) / 2;
  graphConstants.circleCenter = [graphConstants.size / 2, graphConstants.size / 2];

  graphConstants.container.style.width = graphConstants.size + "px";
  graphConstants.container.style.height = graphConstants.size + "px";
  graphConstants.canvas.width = graphConstants.size;
  graphConstants.canvas.height = graphConstants.size;
}


/* Draw a node given an x and y */
const drawNode = (x, y, n) => {
  graphConstants.context.beginPath();
  graphConstants.context.fillStyle = nodeStyle.fill;
  graphConstants.context.arc(x, y, nodeStyle.radius, 0, Math.PI * 2, true);
  graphConstants.context.strokeStyle = nodeStyle.stroke;
  graphConstants.context.stroke();
  graphConstants.context.fill();
  graphConstants.context.font = "14px Arial";
  graphConstants.context.fillStyle = "black";
  graphConstants.context.fillText(n, x - 3, y + 3);
}


const drawConnection = (n1, n2, weight, color) => {
  if (weight) {
    graphConstants.context.font = "14px Arial";
    graphConstants.context.fillStyle = "black";
    graphConstants.context.fillText(weight, (n1[0] + n2[0]) / 2, (n1[1] + n2[1]) / 2);
  }
  graphConstants.context.beginPath();
  graphConstants.context.strokeStyle = color || nodeStyle.stroke;
  graphConstants.context.lineWidth = color ? 4 : 2
  graphConstants.context.moveTo(n1[0], n1[1]);
  graphConstants.context.lineTo(n2[0], n2[1]);
  graphConstants.context.stroke();
}


export const getPositions = (nnodes) => {
  const positions = {}

  for (let i = 0; i < nnodes; i++) {
    const x = graphConstants.circleCenter[0] + graphConstants.circleRadius * Math.cos(2 * Math.PI * i / nnodes);
    const y = graphConstants.circleCenter[1] + graphConstants.circleRadius * Math.sin(2 * Math.PI * i / nnodes);
    positions[i + 1] = [x, y]
  }

  return positions;
}


export const drawGraph = (nnodes, positions, edges) => {
  graphConstants.context.globalCompositeOperation = 'source-over';

  // clear the canvas
  graphConstants.context.clearRect(0, 0, graphConstants.canvas.width, graphConstants.canvas.height);

  // draw the circles
  for (let i = 0; i < nnodes; i++) {
    drawNode(positions[i + 1][0], positions[i + 1][1], i + 1);
  }

  graphConstants.context.globalCompositeOperation = 'destination-over';
  // draw the edges
  for (let i = 2; i < edges.length; i++) {
    const edge = edges[i].split(" ");
    drawConnection([positions[edge[0]][0], positions[edge[0]][1]], [positions[edge[1]][0], positions[edge[1]][1]], edge[2])
  }
}


export const animateAnswer = async (nnodes, positions, answer) => {
  graphConstants.context.globalCompositeOperation = 'source-over';

  // clear the canvas
  graphConstants.context.clearRect(0, 0, graphConstants.canvas.width, graphConstants.canvas.height);

  // draw the circles
  for (let i = 0; i < nnodes; i++) {
    drawNode(positions[i + 1][0], positions[i + 1][1], i + 1);
  }

  // draw the edges
  const nanswer = answer.split(",");
  const nedges = nanswer[0].length - 1;

  graphConstants.context.globalCompositeOperation = 'destination-over';
  for (let i = 0; i < nedges; i++) {
    await delay(500);
    const color = d3.interpolateViridis(i / nedges);
    const origin = nanswer[0][i];
    const destination = nanswer[0][i + 1];
    drawConnection([positions[origin][0], positions[origin][1]], [positions[destination][0], positions[destination][1]], false, color);
  }
}


// const positions = getPositions(nodeArray[0])
// drawGraph(nodeArray[0], positions, nodeArray)
// animateAnswer(nodeArray[0], positions, response);