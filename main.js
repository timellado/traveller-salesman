import { setupCanvas, getPositions, drawGraph, animateAnswer } from './graph.js';

function genAlphabet() {
    var a = [], i = 'A'.charCodeAt(0), j = 'Z'.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}

function sendData() {
    var input = document.getElementById("input").value.toUpperCase();
    var input2 = input;

    // Validate input
    try {
        var format = /^[A-Z]([ X])[A-Z]\1\d+$/;
        input.split(", ").forEach(val => {
            if (!val.match(format)) throw "Mensaje no valido"
        });

        const nodes = genAlphabet();
        var count = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (input.includes(nodes[i])) {
                count += 1;
                input = input.replaceAll(nodes[i], (i).toString())
                input2 = input2.replaceAll(nodes[i], (i + 1).toString())
            }
        }

        var list = input.split(", ");
        list = [count, list.length].concat(list)
        var list2 = input2.split(", ");
        list2 = [count, list2.length].concat(list2)
        console.log(list.join(','));
        console.log(list2.join(','));

        var t0 = performance.now()
        var js_wrapped = Module.cwrap("calculate_cost", "string", ["string"]);
        var response = js_wrapped(list.join(','));
        var t1 = performance.now()
        
        document.getElementById("result-time").textContent = (t1 - t0);

        // draw graph
        setupCanvas(list2);
        const positions = getPositions(list2[0]);
        document.getElementById("result-length").textContent = response.split(",")[1];
        drawGraph(list2[0], positions, list2);

        animateAnswer(list2[0], positions, response);

        

    } catch (e) {
        document.getElementById("input").value = "Los valores ingresados no estan correctos";
        console.log(e);
    }
}

// "7,10,A B 10,A D 8,A E 7,B D 7,B C 12,C D 6,C F 7,C G 5,D E 9,D F 4,E G 11,F G 3"

// A B 10, A D 8, A E 7, B D 7, B C 12, C D 6, C F 7, C G 5, D E 9, D F 4, E G 11, F G 3

const submit = document.getElementById("submit-input");
submit.onclick = sendData;