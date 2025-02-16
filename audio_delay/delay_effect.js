import init, { CircularBuffer } from "./delay_effect/pkg/delay_effect.js";

class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.wasmInstance = null;
        this.delay_processor = null;        
        this.port.onmessage = (event) => this.onmessage(event.data);
    }

    async onmessage(data) {
        if (data.type === "test") {
            this.port.postMessage("test response");
        }
        if (data.type === "update_offset") {
            this.delay_processor.update_offset(data.offset);
        }
        if (data.type === "wasm_module") {
            const wasmModule = await WebAssembly.compile(data.wasmBytes);
            const wasmInstance = await init({ module_or_path: wasmModule });
            this.wasmInstance = wasmInstance;
            // Init the effect processor (length, offset)
            this.delay_processor = new CircularBuffer(128 * 512, 128 * 16);
            // Inform about a successful init
            this.port.postMessage({ type: 'wasm-module-loaded' });
        }
    }

    process(inputs, outputs) {
        const input = inputs[0];
        const output = outputs[0];
        // Skip processing if WASM isn't loaded
        if (!this.wasmInstance) return true;
        for (let channel = 0; channel < output.length; channel++) {
            const inputChannel = input[channel];
            const outputChannel = output[channel];
            if (!inputChannel) continue;
            outputChannel.set(this.delay_processor.process(inputChannel));
        }
        return true;
    }
}

registerProcessor('delay_effect', AudioProcessor);