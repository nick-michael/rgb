import { Telnet } from 'telnet-client';

const connection = new Telnet();
const params = {
    host: '127.0.0.1',
    port: 3636,
    negotiationMandatory: false,
    timeout: 1500
};

export async function init() {
    await connection.connect(params);
    await connection.send('lock');
    return connection;
};

export enum Animation {
    RgbCycle = 'RgbCycle',
};
