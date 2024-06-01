import { Telnet } from 'telnet-client';

const NUMBER_OF_LEDS = 30;
const FPS = 30;
const UPDATE_FREQUENCY = 1000 / FPS;
let state: Array<number> = [];
const HUE_DIFF = 1 / NUMBER_OF_LEDS;
const SPEED = 0.3; // Arbitrary value, higher means faster change

function hslToRgb(h: number, s: number, l: number) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p: number, q: number, t: number) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function createStateString(state: Array<number>) {
    return state.reduce((string, h, i) => {

        const rgb = hslToRgb(h, 1, 0.5);
        return `${string}${i + 1}-${rgb.join()};`;
    }, 'setcolor:');
};

function createInitialState() {
    for (let i = 0; i < NUMBER_OF_LEDS; i++) {
        const h = i * HUE_DIFF;
        state.push(h);
    }
}

function updateState() {
    state = state.map(h => {
        const newHue = h + 0.01 * SPEED;
        return newHue > 1 ? newHue - 1 : newHue;
    });
}

export function start(connection: Telnet): ReturnType<typeof setInterval> {
    createInitialState();
    return setInterval(() => {
        updateState();
        const stateString = createStateString(state);
        connection.send(stateString);
    }, UPDATE_FREQUENCY);
}
