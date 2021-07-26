(self["webpackChunkwebserial"] = self["webpackChunkwebserial"] || []).push([[381],{

/***/ 381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ bootstrap)
});

// EXTERNAL MODULE: ../../.yarn/cache/svelte-npm-3.38.3-5ce000896b-17fa7bfb06.zip/node_modules/svelte/internal/index.mjs
var internal = __webpack_require__(946);
// EXTERNAL MODULE: ../../.yarn/cache/svelte-npm-3.38.3-5ce000896b-17fa7bfb06.zip/node_modules/svelte/index.mjs
var svelte = __webpack_require__(720);
// EXTERNAL MODULE: ../../.yarn/cache/svelte-npm-3.38.3-5ce000896b-17fa7bfb06.zip/node_modules/svelte/store/index.mjs
var store = __webpack_require__(769);
// EXTERNAL MODULE: ../../.yarn/cache/rxjs-npm-7.2.0-be16b41b18-45b46a5adc.zip/node_modules/rxjs/dist/esm5/internal/Subject.js + 1 modules
var Subject = __webpack_require__(110);
// EXTERNAL MODULE: ../../.yarn/cache/rxjs-npm-7.2.0-be16b41b18-45b46a5adc.zip/node_modules/rxjs/dist/esm5/internal/observable/interval.js + 10 modules
var interval = __webpack_require__(217);
// EXTERNAL MODULE: ../../.yarn/cache/rxjs-npm-7.2.0-be16b41b18-45b46a5adc.zip/node_modules/rxjs/dist/esm5/internal/observable/from.js + 16 modules
var from = __webpack_require__(341);
// EXTERNAL MODULE: ../../.yarn/cache/rxjs-npm-7.2.0-be16b41b18-45b46a5adc.zip/node_modules/rxjs/dist/esm5/internal/operators/concatMap.js + 2 modules
var concatMap = __webpack_require__(215);
// EXTERNAL MODULE: ../../.yarn/cache/rxjs-npm-7.2.0-be16b41b18-45b46a5adc.zip/node_modules/rxjs/dist/esm5/internal/operators/map.js
var map = __webpack_require__(617);
// EXTERNAL MODULE: ../../.yarn/cache/rxjs-npm-7.2.0-be16b41b18-45b46a5adc.zip/node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js
var takeUntil = __webpack_require__(278);
;// CONCATENATED MODULE: ./src/Services/WebSerialRxjs.js



class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk; // For each line breaks in chunks, send the parsed lines out.

    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach(line => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }

}

class WebSerialRxjs {
  constructor() {
    console.log('constructor');
    this.port = null;
    this.reader = null;
    this.readableStreamClosed = null;
    this.writer = null;
    this.writableStreamClosed = null;
    this.isConnected = false;
  }

  connect = async () => {
    // ESP32 vendorId and productId
    // const filter = { usbVendorId: 0x10c4, usbProductId: 0xea60 };
    this.port = await navigator.serial.requestPort({// filters: [filter],
    });
    const baudRate = 11500; // ESP32 Baud Rate

    const flowControl = "hardware";
    await this.port.open({
      baudRate,
      flowControl
    });
  };
  disconnect = async () => {
    this.reader.cancel();
    await this.readableStreamClosed.catch(() => {
      /* Ignore the error */
    });
    this.writer.close();
    await this.writableStreamClosed;
    await this.port.close();
  };
  getReaderStream = () => {
    const textDecoder = new TextDecoderStream();
    this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer())).getReader();
    return {
      reader: this.reader,
      readableStreamClosed: this.readableStreamClosed
    };
  };
  getWriterStream = () => {
    const textEncoder = new TextEncoderStream();
    this.writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
    this.writer = textEncoder.writable.getWriter();
    return {
      writer: this.writer,
      writableStreamClosed: this.writableStreamClosed
    };
  };
  monitor = () => {
    const destroy = new Subject/* Subject */.x();
    return (0,interval/* interval */.F)(1).pipe((0,concatMap/* concatMap */.b)(() => (0,from/* from */.Dp)(this.reader.read()).pipe((0,map/* map */.U)(({
      value,
      done
    }) => {
      if (done) {
        destroy.next();
        destroy.complete();
        this.reader.releaseLock();
        return null;
      }

      return value;
    }))), (0,takeUntil/* takeUntil */.R)(destroy.asObservable()));
  };
  connectHandler = async () => {
    if (this.isConnected === false) {
      await this.connect();
      this.isConnected = true;
      this.getReaderStream();
      this.getWriterStream();
    }
  };
  stream = async () => {
    if (this.isConnected) {
      console.info('is connected');
      return this.monitor();
    }

    await this.connect();
    this.isConnected = true;
    this.getReaderStream();
    this.getWriterStream();
    return this.monitor();
  };
  disconnectHandler = async () => {
    if (!this.isConnected) {
      return;
    }

    await this.disconnect();
    this.isConnected = false; // portLogsElement.innerHTML = "";
  };
  writeHandler = async msg => {
    if (!this.isConnected) {
      return;
    }

    await this.writer.write(msg + "\n");
  };
}

/* harmony default export */ const Services_WebSerialRxjs = (WebSerialRxjs); // const serialrxjs = new WebSerialRxjs();
// serialrxjs.connect();
// serialrxjs.disconnect();
// serialrxjs.getReaderStream();
// serialrxjs.getWriterStream();
// serialrxjs.monitor();
// serialrxjs.connectHandler();
// serialrxjs.disconnectHandler();
// serialrxjs.writeHandler();
// const serialrxjs = new WebSerialRxjs();
// connectButton.addEventListener("click", async () => serialrxjs.connectHandler());
// disconnectButton.addEventListener("click", async () => serialrxjs.disconnectHandler());
// writeButton.addEventListener("click", async () => serialrxjs.disconnectHandler('GetMap'));
// loggerButton.addEventListener("click", async () => {
//     const stream = await serialrxjs.stream()
//     stream
//         .pipe(filter(message => message.includes("TMAP")))
//         .subscribe({
//             next: (message) => {
//                 console.log(message,'message')
//             },
//             complete: () => {
//                 console.log("[readLoop] DONE");
//             },
//         })
//
// });
;// CONCATENATED MODULE: ./src/Services/Filters/pedalCalibrationFilter.js
const pedalCalibrationFilter = cleanString => {
  const regex = /(TCALI:([\d\-\\n]+),BCALI:([\d\-\\n]+),CCALI:([\d\-\\n]+))/gm;
  const matchFoundPedalCalibration = cleanString.match(regex);

  if (matchFoundPedalCalibration) {
    console.log(cleanString, 'cleanString');
    const splitPedalCalibration = cleanString.split(",");
    const throttleCalibration = splitPedalCalibration[0].replaceAll("TCALI:", "").split("-").map(function (item) {
      return parseInt(item, 10);
    });
    const brakeCalibration = splitPedalCalibration[1].replaceAll("BCALI:", "").split("-").map(function (item) {
      return parseInt(item, 10);
    });
    const clutchCalibration = splitPedalCalibration[2].replaceAll("CCALI:", "").split("-").map(function (item) {
      return parseInt(item, 10);
    });
    return {
      throttleCalibration: throttleCalibration,
      brakeCalibration: brakeCalibration,
      clutchCalibration: clutchCalibration
    };
  }
};

/* harmony default export */ const Filters_pedalCalibrationFilter = (pedalCalibrationFilter);
;// CONCATENATED MODULE: ./src/Services/Filters/pedalInvertedFilter.js
const pedalInvertedFilter = cleanString => {
  const regex = /(INVER:([\d\-\\n]+))/gm;
  const matchFoundPedalInverted = cleanString.match(regex);

  if (matchFoundPedalInverted) {
    console.log(cleanString, 'cleanString');
    const splitPedalInverted = cleanString.replaceAll("INVER:", "").split("-");
    const throttleInverted = splitPedalInverted[0];
    const brakeInverted = splitPedalInverted[1];
    const clutchInverted = splitPedalInverted[2];
    return {
      throttleInverted: throttleInverted,
      brakeInverted: brakeInverted,
      clutchInverted: clutchInverted
    };
  }
};

/* harmony default export */ const Filters_pedalInvertedFilter = (pedalInvertedFilter);
;// CONCATENATED MODULE: ./src/Services/Filters/pedalBitsFilter.js
const pedalBitsFilter = cleanString => {
  const regex = /(BITS:([\d\-\\n]+))/gm;
  const matchFoundPedalBits = cleanString.match(regex);

  if (matchFoundPedalBits) {
    console.log(cleanString, 'cleanString');
    const splitPedalBits = cleanString.replaceAll("BITS:", "").split("-");
    const throttleBitRaw = splitPedalBits[0];
    const throttleBitHid = splitPedalBits[1];
    const brakeBitRaw = splitPedalBits[2];
    const brakeBitHid = splitPedalBits[3];
    const clutchBitRaw = splitPedalBits[4];
    const clutchBitHid = splitPedalBits[5];
    const throttleBits = [throttleBitRaw, throttleBitHid];
    const brakeBits = [brakeBitRaw, brakeBitHid];
    const clutchBits = [clutchBitRaw, clutchBitHid];
    return {
      throttleBits: throttleBits,
      brakeBits: brakeBits,
      clutchBits: clutchBits
    };
  }
};

/* harmony default export */ const Filters_pedalBitsFilter = (pedalBitsFilter);
;// CONCATENATED MODULE: ./src/Services/Filters/pedalSmoothFilter.js
const pedalSmoothFilter = cleanString => {
  const regex = /(SMOOTH:([\d\-\\n]+))/gm;
  const matchFoundPedalSmooth = cleanString.match(regex);

  if (matchFoundPedalSmooth) {
    console.log(cleanString, 'cleanString');
    const splitPedalSmooth = cleanString.replaceAll("SMOOTH:", "").split("-");
    const throttleSmooth = splitPedalSmooth[0];
    const brakeSmooth = splitPedalSmooth[1];
    const clutchSmooth = splitPedalSmooth[2];
    return {
      throttleSmooth: throttleSmooth,
      brakeSmooth: brakeSmooth,
      clutchSmooth: clutchSmooth
    };
  }
};

/* harmony default export */ const Filters_pedalSmoothFilter = (pedalSmoothFilter);
;// CONCATENATED MODULE: ./src/Services/Filters/cleanString.js
const cleanString = line => {
  return line.replaceAll("\r", "").replaceAll("\n", "");
};

/* harmony default export */ const Filters_cleanString = (cleanString);
;// CONCATENATED MODULE: ./src/Services/Filters/pedalMapFilter.js
const pedalMapFilter = cleanString => {
  const regex = /(TMAP:([\d\-\n]+),BMAP:([\d\-\n]+),CMAP:([\d\-\n]+))/gm;
  const matchFoundPedalMap = cleanString.match(regex);

  if (matchFoundPedalMap) {
    console.log(cleanString, 'cleanString');
    const splitPedalMap = cleanString.split(",");
    const throttleMap = splitPedalMap[0].replaceAll("TMAP:", "").split("-").map(function (item) {
      return parseInt(item, 10);
    });
    const brakeMap = splitPedalMap[1].replaceAll("BMAP:", "").split("-").map(function (item) {
      return parseInt(item, 10);
    });
    const clutchMap = splitPedalMap[2].replaceAll("CMAP:", "").split("-").map(function (item) {
      return parseInt(item, 10);
    });
    return {
      throttleMap: throttleMap,
      brakeMap: brakeMap,
      clutchMap: clutchMap
    };
  }
};

/* harmony default export */ const Filters_pedalMapFilter = (pedalMapFilter);
;// CONCATENATED MODULE: ./src/Services/Filters/generalFilter.js
const splitPedalInputToMap = (items, toReplace) => {
  const map = {};
  const splitItems = items.replaceAll(toReplace, "").split(";");
  map.after = parseInt(splitItems[0]);
  map.before = parseInt(splitItems[1]);
  map.raw = parseInt(splitItems[2]);
  map.hid = parseInt(splitItems[3]);
  return map;
};

const generalFilter = cleanString => {
  const splitPedalInput = cleanString.split(",");

  if (splitPedalInput.length > 2) {
    const throttleValues = splitPedalInputToMap(splitPedalInput[0], "T:");
    const brakeValues = splitPedalInputToMap(splitPedalInput[1], "B:");
    const clutchValues = splitPedalInputToMap(splitPedalInput[2], "C:");
    return {
      throttle: {
        after: throttleValues.after || 0,
        before: throttleValues.before || 0,
        raw: throttleValues.raw || 0,
        hid: throttleValues.hid || 0
      },
      brake: {
        after: brakeValues.after || 0,
        before: brakeValues.before || 0,
        raw: brakeValues.raw || 0,
        hid: brakeValues.hid || 0
      },
      clutch: {
        after: clutchValues.after || 0,
        before: clutchValues.before || 0,
        raw: clutchValues.raw || 0,
        hid: clutchValues.hid || 0
      }
    };
  }
};

/* harmony default export */ const Filters_generalFilter = (generalFilter);
// EXTERNAL MODULE: ../../.yarn/cache/rxjs-npm-7.2.0-be16b41b18-45b46a5adc.zip/node_modules/rxjs/dist/esm5/internal/operators/sample.js
var sample = __webpack_require__(664);
;// CONCATENATED MODULE: ./src/Services/WebSerialContext.svelte
/* src\Services\WebSerialContext.svelte generated by Svelte v3.38.3 */















function create_fragment(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

	return {
		c() {
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], !current ? -1 : dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function throttle(callback, wait, immediate = false) {
	let timeout = null;
	let initialCall = true;

	return function () {
		const callNow = immediate && initialCall;

		const next = () => {
			callback.apply(this, arguments);
			timeout = null;
		};

		if (callNow) {
			initialCall = false;
			next();
		}

		if (!timeout) {
			timeout = setTimeout(next, wait);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $connected;
	let { $$slots: slots = {}, $$scope } = $$props;
	const serialrxjs = new Services_WebSerialRxjs();
	let connected = (0,store/* writable */.fZ)(false);
	(0,internal/* component_subscribe */.FI)($$self, connected, value => $$invalidate(4, $connected = value));
	let pedalMap = (0,store/* writable */.fZ)({});
	let pedalMapSerial = (0,store/* writable */.fZ)("");
	let calibrationMap = (0,store/* writable */.fZ)({});
	let calibrationMapSerial = (0,store/* writable */.fZ)("");
	let invertedMap = (0,store/* writable */.fZ)({});
	let invertedMapSerial = (0,store/* writable */.fZ)("");
	let smoothMap = (0,store/* writable */.fZ)({});
	let smoothMapSerial = (0,store/* writable */.fZ)("");
	let bitsMap = (0,store/* writable */.fZ)({});
	let bitsMapSerial = (0,store/* writable */.fZ)("");
	let message = new Subject/* Subject */.x();
	let getStream = null;

	var findMatch = cleanString => {
		const regex = /(T:((\d+\.\\d+|\d+)+[;,])+)(B:((\d+\.\d+|\d+)+[;,])+)(C:((\d+\.\d+|\d+)+[;,])+)/gm;
		return !!cleanString.match(regex);
	};

	(0,svelte/* afterUpdate */.gx)(async () => {
		if ($connected) {
			serialrxjs.writeHandler("GetMap");
			serialrxjs.writeHandler("GetCali");
			serialrxjs.writeHandler("GetInverted");
			serialrxjs.writeHandler("GetSmooth");
			serialrxjs.writeHandler("GetBits");
			getStream = await serialrxjs.stream();

			getStream.// .pipe(sample(300))
			pipe((0,map/* map */.U)(value => Filters_cleanString(value))).subscribe({
				next: msg => {
					//dont match normal input
					if (findMatch(msg)) {
						message.next(Filters_generalFilter(msg));
						return;
					}

					if (!findMatch(msg)) {
						console.log(msg);
						const pedal_map = Filters_pedalMapFilter(msg);

						if (pedal_map) {
							pedalMap.set(pedal_map);
						}

						const cali_map = Filters_pedalCalibrationFilter(msg);

						if (cali_map) {
							calibrationMap.set(cali_map);
						}

						const inver_map = Filters_pedalInvertedFilter(msg);

						if (inver_map) {
							invertedMap.set(inver_map);
						}

						const smooth_map = Filters_pedalSmoothFilter(msg);

						if (smooth_map) {
							smoothMap.set(smooth_map);
						}

						const bits_map = Filters_pedalBitsFilter(msg);

						if (bits_map) {
							bitsMap.set(bits_map);
						}
					}
				},
				complete: () => {
					console.log("[readLoop] DONE");
				}
			});
		}
	}); // if (!$connected && getStream) {
	//     getStream.unsubscribe();
	//     console.log(getStream)
	// }

	(0,svelte/* setContext */.v)("WSC-actions", {
		connect: async () => {
			console.log("connect");
			await serialrxjs.connectHandler();
			connected.set(true);
		},
		disconnect: async () => {
			await serialrxjs.disconnectHandler();
			connected.set(false);
		},
		write: async msg => await serialrxjs.writeHandler(msg)
	});

	pedalMap.subscribe(value => {
		//TMAP:0-20-40-60-80-100,BMAP:0-60-75-80-85-100,CMAP:0-52-75-89-96-100
		if (value && value.throttleMap && value.brakeMap && value.clutchMap) {
			pedalMapSerial.set("TMAP:" + value.throttleMap.join("-") + "," + "BMAP:" + value.brakeMap.join("-") + "," + "CMAP:" + value.clutchMap.join("-"));
		}
	});

	calibrationMap.subscribe(value => {
		//TCALI:73-466-75-1023,BCALI:73-391-75-1023,CCALI:74-474-75-1023
		if (value && value.throttleCalibration && value.brakeCalibration && value.clutchCalibration) {
			calibrationMapSerial.set("TCALI:" + value.throttleCalibration.join("-") + "," + "BCALI:" + value.brakeCalibration.join("-") + "," + "CCALI:" + value.clutchCalibration.join("-"));
		}
	});

	invertedMap.subscribe(value => {
		//INVER:0-0-0
		if (value && value.throttleInverted && value.brakeInverted && value.clutchInverted) {
			invertedMapSerial.set("INVER:" + value.throttleInverted + "-" + value.brakeInverted + "-" + value.clutchInverted);
		}
	});

	smoothMap.subscribe(value => {
		//SMOOTH:0-0-0
		if (value && value.throttleSmooth && value.brakeSmooth && value.clutchSmooth) {
			smoothMapSerial.set("SMOOTH:" + value.throttleSmooth + "-" + value.brakeSmooth + "-" + value.clutchSmooth);
		}
	});

	bitsMap.subscribe(value => {
		//BITS:1023-1023-1023-1023-1023-1023
		if (value && value.throttleBits && value.brakeBits && value.clutchBits) {
			bitsMapSerial.set("BITS:" + value.throttleBits.join("-") + "-" + value.brakeBits.join("-") + "-" + value.clutchBits.join("-"));
		}
	});

	(0,svelte/* setContext */.v)("WSC-connected", connected);
	(0,svelte/* setContext */.v)("WSC-pedalMap", pedalMap);
	(0,svelte/* setContext */.v)("WSC-pedalMapSerial", pedalMapSerial);
	(0,svelte/* setContext */.v)("WSC-calibrationMap", calibrationMap);
	(0,svelte/* setContext */.v)("WSC-calibrationMapSerial", calibrationMapSerial);
	(0,svelte/* setContext */.v)("WSC-invertedMap", invertedMap);
	(0,svelte/* setContext */.v)("WSC-invertedMapSerial", invertedMapSerial);
	(0,svelte/* setContext */.v)("WSC-smoothMap", smoothMap);
	(0,svelte/* setContext */.v)("WSC-smoothMapSerial", smoothMapSerial);
	(0,svelte/* setContext */.v)("WSC-bitsMap", bitsMap);
	(0,svelte/* setContext */.v)("WSC-bitsMapSerial", bitsMapSerial);
	(0,svelte/* setContext */.v)("WSC-message", message.pipe((0,sample/* sample */.U)((0,interval/* interval */.F)(30))));

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	return [connected, $$scope, slots];
}

class WebSerialContext extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, instance, create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const WebSerialContext_svelte = (WebSerialContext);
;// CONCATENATED MODULE: ./src/Buttons/Buttons.svelte
/* src\Buttons\Buttons.svelte generated by Svelte v3.38.3 */




function Buttons_svelte_create_fragment(ctx) {
	let div;
	let button0;
	let t0;
	let t1;
	let button1;
	let t2;
	let button1_disabled_value;
	let mounted;
	let dispose;

	return {
		c() {
			div = (0,internal/* element */.bG)("div");
			button0 = (0,internal/* element */.bG)("button");
			t0 = (0,internal/* text */.fL)("connect");
			t1 = (0,internal/* space */.Dh)();
			button1 = (0,internal/* element */.bG)("button");
			t2 = (0,internal/* text */.fL)("disconnect");
			button0.disabled = /*$connected*/ ctx[0];
			button1.disabled = button1_disabled_value = !/*$connected*/ ctx[0];
			(0,internal/* set_style */.cz)(div, "padding", "10px");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, button0);
			(0,internal/* append */.R3)(button0, t0);
			(0,internal/* append */.R3)(div, t1);
			(0,internal/* append */.R3)(div, button1);
			(0,internal/* append */.R3)(button1, t2);

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(button0, "click", /*handleConnect*/ ctx[2]),
					(0,internal/* listen */.oL)(button1, "click", /*handleDisconnect*/ ctx[3])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*$connected*/ 1) {
				button0.disabled = /*$connected*/ ctx[0];
			}

			if (dirty & /*$connected*/ 1 && button1_disabled_value !== (button1_disabled_value = !/*$connected*/ ctx[0])) {
				button1.disabled = button1_disabled_value;
			}
		},
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Buttons_svelte_instance($$self, $$props, $$invalidate) {
	let $connected;
	let connected = (0,svelte/* getContext */.fw)("WSC-connected");
	(0,internal/* component_subscribe */.FI)($$self, connected, value => $$invalidate(0, $connected = value));
	let { connect, disconnect, write } = (0,svelte/* getContext */.fw)("WSC-actions");

	const handleConnect = () => {
		connect();
	};

	const handleDisconnect = () => {
		disconnect();
	};

	return [$connected, connected, handleConnect, handleDisconnect];
}

class Buttons extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Buttons_svelte_instance, Buttons_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Buttons_svelte = (Buttons);
;// CONCATENATED MODULE: ./src/Tabs/Tabs.svelte
/* src\Tabs\Tabs.svelte generated by Svelte v3.38.3 */





function Tabs_svelte_create_fragment(ctx) {
	let div;
	let current;
	const default_slot_template = /*#slots*/ ctx[1].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

	return {
		c() {
			div = (0,internal/* element */.bG)("div");
			if (default_slot) default_slot.c();
			(0,internal/* attr */.Lj)(div, "class", "tabs");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], !current ? -1 : dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

const TABS = {};

function Tabs_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	const tabs = [];
	const panels = [];
	const selectedTab = (0,store/* writable */.fZ)(null);
	const selectedPanel = (0,store/* writable */.fZ)(null);

	(0,svelte/* setContext */.v)(TABS, {
		registerTab: tab => {
			tabs.push(tab);
			selectedTab.update(current => current || tab);

			(0,svelte/* onDestroy */.ev)(() => {
				const i = tabs.indexOf(tab);
				tabs.splice(i, 1);

				selectedTab.update(current => current === tab
				? tabs[i] || tabs[tabs.length - 1]
				: current);
			});
		},
		registerPanel: panel => {
			panels.push(panel);
			selectedPanel.update(current => current || panel);

			(0,svelte/* onDestroy */.ev)(() => {
				const i = panels.indexOf(panel);
				panels.splice(i, 1);

				selectedPanel.update(current => current === panel
				? panels[i] || panels[panels.length - 1]
				: current);
			});
		},
		selectTab: tab => {
			const i = tabs.indexOf(tab);
			selectedTab.set(tab);
			selectedPanel.set(panels[i]);
		},
		selectedTab,
		selectedPanel
	});

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
	};

	return [$$scope, slots];
}

class Tabs extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Tabs_svelte_instance, Tabs_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Tabs_svelte = (Tabs);

;// CONCATENATED MODULE: ./src/Tabs/TabList.svelte
/* src\Tabs\TabList.svelte generated by Svelte v3.38.3 */


function add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-v5teao-style";
	style.textContent = ".tab-list.svelte-v5teao{border-bottom:1px solid teal}";
	(0,internal/* append */.R3)(document.head, style);
}

function TabList_svelte_create_fragment(ctx) {
	let div;
	let current;
	const default_slot_template = /*#slots*/ ctx[1].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

	return {
		c() {
			div = (0,internal/* element */.bG)("div");
			if (default_slot) default_slot.c();
			(0,internal/* attr */.Lj)(div, "class", "tab-list svelte-v5teao");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], !current ? -1 : dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function TabList_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
	};

	return [$$scope, slots];
}

class TabList extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-v5teao-style")) add_css();
		(0,internal/* init */.S1)(this, options, TabList_svelte_instance, TabList_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const TabList_svelte = (TabList);
;// CONCATENATED MODULE: ./src/Tabs/TabPanel.svelte
/* src\Tabs\TabPanel.svelte generated by Svelte v3.38.3 */





function create_if_block(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	return {
		c() {
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], !current ? -1 : dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function TabPanel_svelte_create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1] && create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = (0,internal/* empty */.cS)();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.$T)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$selectedPanel*/ 1) {
						(0,internal/* transition_in */.Ui)(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					(0,internal/* transition_in */.Ui)(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.dv)();

				(0,internal/* transition_out */.et)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.gb)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) (0,internal/* detach */.og)(if_block_anchor);
		}
	};
}

function TabPanel_svelte_instance($$self, $$props, $$invalidate) {
	let $selectedPanel;
	let { $$slots: slots = {}, $$scope } = $$props;
	const panel = {};
	const { registerPanel, selectedPanel } = (0,svelte/* getContext */.fw)(TABS);
	(0,internal/* component_subscribe */.FI)($$self, selectedPanel, value => $$invalidate(0, $selectedPanel = value));
	registerPanel(panel);

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [$selectedPanel, panel, selectedPanel, $$scope, slots];
}

class TabPanel extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, TabPanel_svelte_instance, TabPanel_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const TabPanel_svelte = (TabPanel);
;// CONCATENATED MODULE: ./src/Tabs/Tab.svelte
/* src\Tabs\Tab.svelte generated by Svelte v3.38.3 */





function Tab_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-o2wbpy-style";
	style.textContent = "button.svelte-o2wbpy{background:none;border:none;border-bottom:2px solid white;border-radius:0;margin:0;color:#ccc}.selected.svelte-o2wbpy{border-bottom:2px solid teal;color:#333}";
	(0,internal/* append */.R3)(document.head, style);
}

function Tab_svelte_create_fragment(ctx) {
	let button;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

	return {
		c() {
			button = (0,internal/* element */.bG)("button");
			if (default_slot) default_slot.c();
			(0,internal/* set_style */.cz)(button, "padding", "10px");
			(0,internal/* attr */.Lj)(button, "class", "svelte-o2wbpy");
			(0,internal/* toggle_class */.VH)(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, button, anchor);

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.oL)(button, "click", /*click_handler*/ ctx[6]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], !current ? -1 : dirty, null, null);
				}
			}

			if (dirty & /*$selectedTab, tab*/ 3) {
				(0,internal/* toggle_class */.VH)(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(button);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function Tab_svelte_instance($$self, $$props, $$invalidate) {
	let $selectedTab;
	let { $$slots: slots = {}, $$scope } = $$props;
	const tab = {};
	const { registerTab, selectTab, selectedTab } = (0,svelte/* getContext */.fw)(TABS);
	(0,internal/* component_subscribe */.FI)($$self, selectedTab, value => $$invalidate(0, $selectedTab = value));
	registerTab(tab);
	const click_handler = () => selectTab(tab);

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
	};

	return [$selectedTab, tab, selectTab, selectedTab, $$scope, slots, click_handler];
}

class Tab extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-o2wbpy-style")) Tab_svelte_add_css();
		(0,internal/* init */.S1)(this, options, Tab_svelte_instance, Tab_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Tab_svelte = (Tab);
;// CONCATENATED MODULE: ./src/Tabs/tabs.js




;// CONCATENATED MODULE: ./src/Overlay/Overlay.svelte
/* src\Overlay\Overlay.svelte generated by Svelte v3.38.3 */




function Overlay_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-vv1x9t-style";
	style.textContent = ".overlay{position:absolute;top:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%;background:rgba(0, 0, 0, 0.5);z-index:999}.overlay--content--container.svelte-vv1x9t{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;pointer-events:none}.overlay--content--box.svelte-vv1x9t{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;max-width:100%;max-height:100%;pointer-events:auto;overflow-y:auto;background:#fff;min-width:400px}";
	(0,internal/* append */.R3)(document.head, style);
}

// (44:0) {#if !$connected}
function Overlay_svelte_create_if_block(ctx) {
	let div2;
	let div1;
	let div0;
	let current;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	return {
		c() {
			div2 = (0,internal/* element */.bG)("div");
			div1 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			if (default_slot) default_slot.c();
			(0,internal/* attr */.Lj)(div0, "class", "overlay--content--box svelte-vv1x9t");
			(0,internal/* set_style */.cz)(div0, "justify-content", "space-around");
			(0,internal/* attr */.Lj)(div1, "class", "overlay--content--container svelte-vv1x9t");
			(0,internal/* attr */.Lj)(div2, "class", "overlay");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div2, anchor);
			(0,internal/* append */.R3)(div2, div1);
			(0,internal/* append */.R3)(div1, div0);

			if (default_slot) {
				default_slot.m(div0, null);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], !current ? -1 : dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div2);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function Overlay_svelte_create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = !/*$connected*/ ctx[0] && Overlay_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = (0,internal/* empty */.cS)();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.$T)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (!/*$connected*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$connected*/ 1) {
						(0,internal/* transition_in */.Ui)(if_block, 1);
					}
				} else {
					if_block = Overlay_svelte_create_if_block(ctx);
					if_block.c();
					(0,internal/* transition_in */.Ui)(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.dv)();

				(0,internal/* transition_out */.et)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.gb)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) (0,internal/* detach */.og)(if_block_anchor);
		}
	};
}

function Overlay_svelte_instance($$self, $$props, $$invalidate) {
	let $connected;
	let { $$slots: slots = {}, $$scope } = $$props;
	let connected = (0,svelte/* getContext */.fw)("WSC-connected");
	(0,internal/* component_subscribe */.FI)($$self, connected, value => $$invalidate(0, $connected = value));

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [$connected, connected, $$scope, slots];
}

class Overlay extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-vv1x9t-style")) Overlay_svelte_add_css();
		(0,internal/* init */.S1)(this, options, Overlay_svelte_instance, Overlay_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Overlay_svelte = (Overlay);
;// CONCATENATED MODULE: ./src/Pedals/Components/VerticalProgress/VerticalProgress.svelte
/* src\Pedals\Components\VerticalProgress\VerticalProgress.svelte generated by Svelte v3.38.3 */


function VerticalProgress_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-1ayzqt2-style";
	style.textContent = ".progress-bar.svelte-1ayzqt2{--height:300px;background-color:#f5f5f5;border-radius:3px;box-shadow:none;position:relative;width:20px;display:inline-block;margin-right:10px;margin-bottom:30px;height:calc(var(--height) - 40px)}.bar.svelte-1ayzqt2{--progress:0%;width:100%;position:absolute;bottom:0;background-color:#2196f3;box-shadow:none;height:var(--progress)}.sr-only.svelte-1ayzqt2{display:none}";
	(0,internal/* append */.R3)(document.head, style);
}

function VerticalProgress_svelte_create_fragment(ctx) {
	let div1;
	let div0;
	let span;
	let t_value = `${/*progress*/ ctx[0]}%` + "";
	let t;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			span = (0,internal/* element */.bG)("span");
			t = (0,internal/* text */.fL)(t_value);
			(0,internal/* attr */.Lj)(span, "class", "sr-only svelte-1ayzqt2");
			(0,internal/* attr */.Lj)(div0, "class", "bar svelte-1ayzqt2");
			(0,internal/* set_style */.cz)(div0, "--progress", /*progress*/ ctx[0] + "%");
			(0,internal/* attr */.Lj)(div1, "class", "progress-bar svelte-1ayzqt2");
			(0,internal/* set_style */.cz)(div1, "--height", /*height*/ ctx[1] + "px");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
			(0,internal/* append */.R3)(div1, div0);
			(0,internal/* append */.R3)(div0, span);
			(0,internal/* append */.R3)(span, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*progress*/ 1 && t_value !== (t_value = `${/*progress*/ ctx[0]}%` + "")) (0,internal/* set_data */.rT)(t, t_value);

			if (dirty & /*progress*/ 1) {
				(0,internal/* set_style */.cz)(div0, "--progress", /*progress*/ ctx[0] + "%");
			}

			if (dirty & /*height*/ 2) {
				(0,internal/* set_style */.cz)(div1, "--height", /*height*/ ctx[1] + "px");
			}
		},
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

function VerticalProgress_svelte_instance($$self, $$props, $$invalidate) {
	let { progress = 0 } = $$props;
	let { height = 0 } = $$props;

	$$self.$$set = $$props => {
		if ("progress" in $$props) $$invalidate(0, progress = $$props.progress);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
	};

	return [progress, height];
}

class VerticalProgress extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1ayzqt2-style")) VerticalProgress_svelte_add_css();
		(0,internal/* init */.S1)(this, options, VerticalProgress_svelte_instance, VerticalProgress_svelte_create_fragment, internal/* safe_not_equal */.N8, { progress: 0, height: 1 });
	}
}

/* harmony default export */ const VerticalProgress_svelte = (VerticalProgress);
// EXTERNAL MODULE: ../../.yarn/cache/d3-npm-7.0.0-89214aa7c4-f811b526d2.zip/node_modules/d3/src/index.js + 147 modules
var src = __webpack_require__(647);
;// CONCATENATED MODULE: ./src/Pedals/Components/D3PedalMap/D3PedalMap_clutch.svelte
/* src\Pedals\Components\D3PedalMap\D3PedalMap_clutch.svelte generated by Svelte v3.38.3 */





function D3PedalMap_clutch_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-xp8anw-style";
	style.textContent = ".svelte-xp8anw .line{stroke-width:2;fill:none}.svelte-xp8anw .axis path{stroke:black}.svelte-xp8anw .text{font-size:12px}.svelte-xp8anw .title-text{font-size:12px}.svelte-xp8anw .grid line{stroke:lightgrey;stroke-opacity:0.7;shape-rendering:crispEdges}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3PedalMap_clutch_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="clutchChart" class="svelte-xp8anw"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-xp8anw");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

var width = 230;
var height = 230;
var margin = 25;
var lineOpacity = "0.25";
var circleOpacity = "0.85";
var circleRadius = 3;

function D3PedalMap_clutch_svelte_instance($$self) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let pedalMap = (0,svelte/* getContext */.fw)("WSC-pedalMap");
	let pedalMapNumbers = [0, 20, 40, 60, 80, 100];
	var svg;

	var data = [
		{
			name: "default",
			values: [
				{ increment: 0, position: 0 },
				{ increment: 20, position: 20 },
				{ increment: 40, position: 40 },
				{ increment: 60, position: 60 },
				{ increment: 80, position: 80 },
				{ increment: 100, position: 100 }
			]
		},
		{
			name: "curve",
			values: [
				{ increment: 0, position: 0 },
				{ increment: 20, position: 20 },
				{ increment: 40, position: 40 },
				{ increment: 60, position: 60 },
				{ increment: 80, position: 80 },
				{ increment: 100, position: 100 }
			]
		},
		{
			name: "input",
			values: [{ increment: 0, position: 0 }]
		}
	];

	/* Scale */
	var xScale = src/* scaleLinear */.BYU().domain([0, 100]).range([0, width - margin]);

	var yScale = src/* scaleLinear */.BYU().domain([100, 0]).range([0, height - margin]);

	const update = msg => {
		var select = src/* select */.Ys("#clutchChart");
		const cx_circle_s0 = (width - margin) / 100 * msg.clutch.after;
		const cy_circle_s0 = width - margin - (height - margin) / 100 * msg.clutch.before;
		select.selectAll(".input .circle.s0 circle").attr("cx", cx_circle_s0).attr("cy", cy_circle_s0);
	};

	/* Add SVG */
	(0,svelte/* onMount */.H3)(() => {
		var color = src/* scaleOrdinal */.PKp(src/* schemeCategory10 */.Cn1);
		svg = src/* select */.Ys("#clutchChart").append("svg").attr("class", "container").attr("width", width + margin + "px").attr("height", height + margin + "px").append("g").attr("transform", `translate(${margin}, ${margin})`);

		////////begin draw grid ///////
		var gridlinesx = src/* axisTop */.F5q().tickFormat("").ticks(5).tickSize(-(width - margin)).scale(xScale);

		var gridlinesy = src/* axisTop */.F5q().tickFormat("").ticks(5).tickSize(height - margin).scale(yScale);
		svg.append("g").attr("class", "grid").call(gridlinesx);
		svg.append("g").attr("class", "grid").attr("transform", "rotate(90)").call(gridlinesy);

		////////end draw grid ///////
		/* Add line into SVG */
		var line = src/* line */.jvg().x(d => xScale(d.increment)).y(d => yScale(d.position));

		let lines = svg.append("g").attr("class", "lines");

		lines.selectAll(".line-group").data(data).enter().append("g").attr("class", function (d, i) {
			return "line-group" + " " + d.name;
		}).append("path").attr("class", "line").attr("d", d => line(d.values)).style("stroke", (d, i) => color(i)).style("opacity", lineOpacity);

		/* Add circles in the line */
		lines.selectAll("circle-group").data(data).enter().append("g").style("fill", (d, i) => {
			return color(i);
		}).attr("class", function (d, i) {
			return d.name;
		}).selectAll("circle").data(d => d.values).enter().append("g").attr("class", function (d, i) {
			return "circle s" + i;
		}).append("circle").attr("cx", d => xScale(d.increment)).attr("cy", d => yScale(d.position)).attr("r", circleRadius).style("opacity", circleOpacity);

		/* Add Axis into SVG */
		var xAxis = src/* axisBottom */.LLu(xScale).ticks(5);

		var yAxis = src/* axisLeft */.y4O(yScale).ticks(5);
		svg.append("g").attr("class", "x axis").attr("transform", `translate(0, ${height - margin})`).call(xAxis);
		svg.append("g").attr("class", "y axis").call(yAxis);
		updateGraph();
	});

	const updateGraph = () => {
		var select = src/* select */.Ys("#clutchChart");
		const cx_circle_s0 = (width - margin) / 100 * 0;
		const cy_circle_s0 = width - margin - (height - margin) / 100 * pedalMapNumbers[0];
		const cx_circle_s1 = (width - margin) / 100 * 20;
		const cy_circle_s1 = width - margin - (height - margin) / 100 * pedalMapNumbers[1];
		const cx_circle_s2 = (width - margin) / 100 * 40;
		const cy_circle_s2 = width - margin - (height - margin) / 100 * pedalMapNumbers[2];
		const cx_circle_s3 = (width - margin) / 100 * 60;
		const cy_circle_s3 = width - margin - (height - margin) / 100 * pedalMapNumbers[3];
		const cx_circle_s4 = (width - margin) / 100 * 80;
		const cy_circle_s4 = width - margin - (height - margin) / 100 * pedalMapNumbers[4];
		const cx_circle_s5 = (width - margin) / 100 * 100;
		const cy_circle_s5 = width - margin - (height - margin) / 100 * pedalMapNumbers[5];
		const line = "M" + cx_circle_s0 + "," + cy_circle_s0 + "L" + cx_circle_s1 + "," + cy_circle_s1 + "L" + cx_circle_s2 + "," + cy_circle_s2 + "L" + cx_circle_s3 + "," + cy_circle_s3 + "L" + cx_circle_s4 + "," + cy_circle_s4 + "L" + cx_circle_s5 + "," + cy_circle_s5;
		select.selectAll(".line-group.curve .line").attr("d", line);
		select.selectAll(".curve .circle.s0 circle").attr("cx", cx_circle_s0).attr("cy", cy_circle_s0);
		select.selectAll(".curve .circle.s1 circle").attr("cx", cx_circle_s1).attr("cy", cy_circle_s1);
		select.selectAll(".curve .circle.s2 circle").attr("cx", cx_circle_s2).attr("cy", cy_circle_s2);
		select.selectAll(".curve .circle.s3 circle").attr("cx", cx_circle_s3).attr("cy", cy_circle_s3);
		select.selectAll(".curve .circle.s4 circle").attr("cx", cx_circle_s4).attr("cy", cy_circle_s4);
		select.selectAll(".curve .circle.s5 circle").attr("cx", cx_circle_s5).attr("cy", cy_circle_s5);
	};

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	pedalMap.subscribe(value => {
		if (JSON.stringify(value) !== "{}") {
			const { clutchMap } = value;
			pedalMapNumbers = clutchMap;
			updateGraph();
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	return [];
}

class D3PedalMap_clutch extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-xp8anw-style")) D3PedalMap_clutch_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3PedalMap_clutch_svelte_instance, D3PedalMap_clutch_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3PedalMap_clutch_svelte = (D3PedalMap_clutch);
;// CONCATENATED MODULE: ./src/Pedals/Components/Pedalmap/Pedalmap_clutch.svelte
/* src\Pedals\Components\Pedalmap\Pedalmap_clutch.svelte generated by Svelte v3.38.3 */






function Pedalmap_clutch_svelte_create_fragment(ctx) {
	let div12;
	let div10;
	let div0;
	let t1;
	let div9;
	let div1;
	let label0;
	let t3;
	let input0;
	let input0_value_value;
	let t4;
	let div2;
	let label1;
	let t6;
	let input1;
	let input1_value_value;
	let t7;
	let div3;
	let label2;
	let t9;
	let input2;
	let input2_value_value;
	let t10;
	let div4;
	let label3;
	let t12;
	let input3;
	let input3_value_value;
	let t13;
	let div5;
	let label4;
	let t15;
	let input4;
	let input4_value_value;
	let t16;
	let div6;
	let label5;
	let t18;
	let input5;
	let input5_value_value;
	let t19;
	let div7;
	let label6;
	let t20;
	let select;
	let option0;
	let option1;
	let option2;
	let option3;
	let option4;
	let option5;
	let option6;
	let option7;
	let t29;
	let div8;
	let label7;
	let input6;
	let t30;
	let t31;
	let label8;
	let input7;
	let t32;
	let t33;
	let d3pedalmap_clutch;
	let t34;
	let div11;
	let verticalprogress;
	let current;
	let mounted;
	let dispose;
	d3pedalmap_clutch = new D3PedalMap_clutch_svelte({});

	verticalprogress = new VerticalProgress_svelte({
			props: {
				progress: /*progress*/ ctx[0],
				height: "470"
			}
		});

	return {
		c() {
			div12 = (0,internal/* element */.bG)("div");
			div10 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			div0.innerHTML = `<strong>clutch</strong>`;
			t1 = (0,internal/* space */.Dh)();
			div9 = (0,internal/* element */.bG)("div");
			div1 = (0,internal/* element */.bG)("div");
			label0 = (0,internal/* element */.bG)("label");
			label0.textContent = "0%";
			t3 = (0,internal/* space */.Dh)();
			input0 = (0,internal/* element */.bG)("input");
			t4 = (0,internal/* space */.Dh)();
			div2 = (0,internal/* element */.bG)("div");
			label1 = (0,internal/* element */.bG)("label");
			label1.textContent = "20%";
			t6 = (0,internal/* space */.Dh)();
			input1 = (0,internal/* element */.bG)("input");
			t7 = (0,internal/* space */.Dh)();
			div3 = (0,internal/* element */.bG)("div");
			label2 = (0,internal/* element */.bG)("label");
			label2.textContent = "40%";
			t9 = (0,internal/* space */.Dh)();
			input2 = (0,internal/* element */.bG)("input");
			t10 = (0,internal/* space */.Dh)();
			div4 = (0,internal/* element */.bG)("div");
			label3 = (0,internal/* element */.bG)("label");
			label3.textContent = "60%";
			t12 = (0,internal/* space */.Dh)();
			input3 = (0,internal/* element */.bG)("input");
			t13 = (0,internal/* space */.Dh)();
			div5 = (0,internal/* element */.bG)("div");
			label4 = (0,internal/* element */.bG)("label");
			label4.textContent = "80%";
			t15 = (0,internal/* space */.Dh)();
			input4 = (0,internal/* element */.bG)("input");
			t16 = (0,internal/* space */.Dh)();
			div6 = (0,internal/* element */.bG)("div");
			label5 = (0,internal/* element */.bG)("label");
			label5.textContent = "100%";
			t18 = (0,internal/* space */.Dh)();
			input5 = (0,internal/* element */.bG)("input");
			t19 = (0,internal/* space */.Dh)();
			div7 = (0,internal/* element */.bG)("div");
			label6 = (0,internal/* element */.bG)("label");
			t20 = (0,internal/* space */.Dh)();
			select = (0,internal/* element */.bG)("select");
			option0 = (0,internal/* element */.bG)("option");
			option0.textContent = "custom curve";
			option1 = (0,internal/* element */.bG)("option");
			option1.textContent = "linear";
			option2 = (0,internal/* element */.bG)("option");
			option2.textContent = "slow curve";
			option3 = (0,internal/* element */.bG)("option");
			option3.textContent = "very slow curve";
			option4 = (0,internal/* element */.bG)("option");
			option4.textContent = "fast curve";
			option5 = (0,internal/* element */.bG)("option");
			option5.textContent = "very fast curve";
			option6 = (0,internal/* element */.bG)("option");
			option6.textContent = "s curve fast slow";
			option7 = (0,internal/* element */.bG)("option");
			option7.textContent = "s curve slow fast";
			t29 = (0,internal/* space */.Dh)();
			div8 = (0,internal/* element */.bG)("div");
			label7 = (0,internal/* element */.bG)("label");
			input6 = (0,internal/* element */.bG)("input");
			t30 = (0,internal/* text */.fL)("smooth");
			t31 = (0,internal/* space */.Dh)();
			label8 = (0,internal/* element */.bG)("label");
			input7 = (0,internal/* element */.bG)("input");
			t32 = (0,internal/* text */.fL)("inverted");
			t33 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(d3pedalmap_clutch.$$.fragment);
			t34 = (0,internal/* space */.Dh)();
			div11 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(verticalprogress.$$.fragment);
			(0,internal/* set_style */.cz)(label0, "width", "50px");
			(0,internal/* set_style */.cz)(label0, "display", "inline-block");
			(0,internal/* attr */.Lj)(input0, "min", "0");
			(0,internal/* attr */.Lj)(input0, "max", "100");
			(0,internal/* attr */.Lj)(input0, "type", "number");
			(0,internal/* attr */.Lj)(input0, "name", "0");
			input0.value = input0_value_value = /*pedalMapNumbers*/ ctx[1][0];
			(0,internal/* set_style */.cz)(label1, "width", "50px");
			(0,internal/* set_style */.cz)(label1, "display", "inline-block");
			(0,internal/* attr */.Lj)(input1, "min", "0");
			(0,internal/* attr */.Lj)(input1, "max", "100");
			(0,internal/* attr */.Lj)(input1, "type", "number");
			(0,internal/* attr */.Lj)(input1, "name", "1");
			input1.value = input1_value_value = /*pedalMapNumbers*/ ctx[1][1];
			(0,internal/* set_style */.cz)(label2, "width", "50px");
			(0,internal/* set_style */.cz)(label2, "display", "inline-block");
			(0,internal/* attr */.Lj)(input2, "min", "0");
			(0,internal/* attr */.Lj)(input2, "max", "100");
			(0,internal/* attr */.Lj)(input2, "type", "number");
			(0,internal/* attr */.Lj)(input2, "name", "2");
			input2.value = input2_value_value = /*pedalMapNumbers*/ ctx[1][2];
			(0,internal/* set_style */.cz)(label3, "width", "50px");
			(0,internal/* set_style */.cz)(label3, "display", "inline-block");
			(0,internal/* attr */.Lj)(input3, "min", "0");
			(0,internal/* attr */.Lj)(input3, "max", "100");
			(0,internal/* attr */.Lj)(input3, "type", "number");
			(0,internal/* attr */.Lj)(input3, "name", "3");
			input3.value = input3_value_value = /*pedalMapNumbers*/ ctx[1][3];
			(0,internal/* set_style */.cz)(label4, "width", "50px");
			(0,internal/* set_style */.cz)(label4, "display", "inline-block");
			(0,internal/* attr */.Lj)(input4, "min", "0");
			(0,internal/* attr */.Lj)(input4, "max", "100");
			(0,internal/* attr */.Lj)(input4, "type", "number");
			(0,internal/* attr */.Lj)(input4, "name", "4");
			input4.value = input4_value_value = /*pedalMapNumbers*/ ctx[1][4];
			(0,internal/* set_style */.cz)(label5, "width", "50px");
			(0,internal/* set_style */.cz)(label5, "display", "inline-block");
			(0,internal/* attr */.Lj)(input5, "min", "0");
			(0,internal/* attr */.Lj)(input5, "max", "100");
			(0,internal/* attr */.Lj)(input5, "type", "number");
			(0,internal/* attr */.Lj)(input5, "name", "5");
			input5.value = input5_value_value = /*pedalMapNumbers*/ ctx[1][5];
			(0,internal/* set_style */.cz)(label6, "width", "50px");
			(0,internal/* set_style */.cz)(label6, "display", "inline-block");
			option0.__value = "";
			option0.value = option0.__value;
			option1.__value = "linearMap";
			option1.value = option1.__value;
			option2.__value = "slowCurveMap";
			option2.value = option2.__value;
			option3.__value = "verySlowCurveMap";
			option3.value = option3.__value;
			option4.__value = "fastCurveMap";
			option4.value = option4.__value;
			option5.__value = "veryFastCurveMap";
			option5.value = option5.__value;
			option6.__value = "sCurveFastSlowMap";
			option6.value = option6.__value;
			option7.__value = "sCurveSlowFastMap";
			option7.value = option7.__value;
			(0,internal/* attr */.Lj)(select, "name", "curves");
			(0,internal/* attr */.Lj)(input6, "type", "checkbox");
			input6.checked = /*smooth*/ ctx[2];
			(0,internal/* attr */.Lj)(input7, "type", "checkbox");
			input7.checked = /*inverted*/ ctx[3];
			(0,internal/* set_style */.cz)(div9, "display", "inline-block");
			(0,internal/* set_style */.cz)(div10, "display", "inline-block");
			(0,internal/* set_style */.cz)(div10, "vertical-align", "top");
			(0,internal/* set_style */.cz)(div11, "display", "inline-block");
			(0,internal/* set_style */.cz)(div11, "vertical-align", "top");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div12, anchor);
			(0,internal/* append */.R3)(div12, div10);
			(0,internal/* append */.R3)(div10, div0);
			(0,internal/* append */.R3)(div10, t1);
			(0,internal/* append */.R3)(div10, div9);
			(0,internal/* append */.R3)(div9, div1);
			(0,internal/* append */.R3)(div1, label0);
			(0,internal/* append */.R3)(div1, t3);
			(0,internal/* append */.R3)(div1, input0);
			(0,internal/* append */.R3)(div9, t4);
			(0,internal/* append */.R3)(div9, div2);
			(0,internal/* append */.R3)(div2, label1);
			(0,internal/* append */.R3)(div2, t6);
			(0,internal/* append */.R3)(div2, input1);
			(0,internal/* append */.R3)(div9, t7);
			(0,internal/* append */.R3)(div9, div3);
			(0,internal/* append */.R3)(div3, label2);
			(0,internal/* append */.R3)(div3, t9);
			(0,internal/* append */.R3)(div3, input2);
			(0,internal/* append */.R3)(div9, t10);
			(0,internal/* append */.R3)(div9, div4);
			(0,internal/* append */.R3)(div4, label3);
			(0,internal/* append */.R3)(div4, t12);
			(0,internal/* append */.R3)(div4, input3);
			(0,internal/* append */.R3)(div9, t13);
			(0,internal/* append */.R3)(div9, div5);
			(0,internal/* append */.R3)(div5, label4);
			(0,internal/* append */.R3)(div5, t15);
			(0,internal/* append */.R3)(div5, input4);
			(0,internal/* append */.R3)(div9, t16);
			(0,internal/* append */.R3)(div9, div6);
			(0,internal/* append */.R3)(div6, label5);
			(0,internal/* append */.R3)(div6, t18);
			(0,internal/* append */.R3)(div6, input5);
			(0,internal/* append */.R3)(div9, t19);
			(0,internal/* append */.R3)(div9, div7);
			(0,internal/* append */.R3)(div7, label6);
			(0,internal/* append */.R3)(div7, t20);
			(0,internal/* append */.R3)(div7, select);
			(0,internal/* append */.R3)(select, option0);
			(0,internal/* append */.R3)(select, option1);
			(0,internal/* append */.R3)(select, option2);
			(0,internal/* append */.R3)(select, option3);
			(0,internal/* append */.R3)(select, option4);
			(0,internal/* append */.R3)(select, option5);
			(0,internal/* append */.R3)(select, option6);
			(0,internal/* append */.R3)(select, option7);
			(0,internal/* select_option */.oW)(select, /*curves*/ ctx[4]);
			(0,internal/* append */.R3)(div9, t29);
			(0,internal/* append */.R3)(div9, div8);
			(0,internal/* append */.R3)(div8, label7);
			(0,internal/* append */.R3)(label7, input6);
			(0,internal/* append */.R3)(label7, t30);
			(0,internal/* append */.R3)(div8, t31);
			(0,internal/* append */.R3)(div8, label8);
			(0,internal/* append */.R3)(label8, input7);
			(0,internal/* append */.R3)(label8, t32);
			(0,internal/* append */.R3)(div10, t33);
			(0,internal/* mount_component */.ye)(d3pedalmap_clutch, div10, null);
			(0,internal/* append */.R3)(div12, t34);
			(0,internal/* append */.R3)(div12, div11);
			(0,internal/* mount_component */.ye)(verticalprogress, div11, null);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(input0, "input", /*input_handler*/ ctx[9]),
					(0,internal/* listen */.oL)(input1, "input", /*input_handler_1*/ ctx[10]),
					(0,internal/* listen */.oL)(input2, "input", /*input_handler_2*/ ctx[11]),
					(0,internal/* listen */.oL)(input3, "input", /*input_handler_3*/ ctx[12]),
					(0,internal/* listen */.oL)(input4, "input", /*input_handler_4*/ ctx[13]),
					(0,internal/* listen */.oL)(input5, "input", /*input_handler_5*/ ctx[14]),
					(0,internal/* listen */.oL)(select, "input", /*input_handler_6*/ ctx[15]),
					(0,internal/* listen */.oL)(input6, "input", /*input_handler_7*/ ctx[16]),
					(0,internal/* listen */.oL)(input7, "input", /*input_handler_8*/ ctx[17])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input0_value_value !== (input0_value_value = /*pedalMapNumbers*/ ctx[1][0])) {
				input0.value = input0_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input1_value_value !== (input1_value_value = /*pedalMapNumbers*/ ctx[1][1])) {
				input1.value = input1_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input2_value_value !== (input2_value_value = /*pedalMapNumbers*/ ctx[1][2])) {
				input2.value = input2_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input3_value_value !== (input3_value_value = /*pedalMapNumbers*/ ctx[1][3])) {
				input3.value = input3_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input4_value_value !== (input4_value_value = /*pedalMapNumbers*/ ctx[1][4])) {
				input4.value = input4_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input5_value_value !== (input5_value_value = /*pedalMapNumbers*/ ctx[1][5])) {
				input5.value = input5_value_value;
			}

			if (!current || dirty[0] & /*curves*/ 16) {
				(0,internal/* select_option */.oW)(select, /*curves*/ ctx[4]);
			}

			if (!current || dirty[0] & /*smooth*/ 4) {
				input6.checked = /*smooth*/ ctx[2];
			}

			if (!current || dirty[0] & /*inverted*/ 8) {
				input7.checked = /*inverted*/ ctx[3];
			}

			const verticalprogress_changes = {};
			if (dirty[0] & /*progress*/ 1) verticalprogress_changes.progress = /*progress*/ ctx[0];
			verticalprogress.$set(verticalprogress_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(d3pedalmap_clutch.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(verticalprogress.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(d3pedalmap_clutch.$$.fragment, local);
			(0,internal/* transition_out */.et)(verticalprogress.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div12);
			(0,internal/* destroy_component */.vp)(d3pedalmap_clutch);
			(0,internal/* destroy_component */.vp)(verticalprogress);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Pedalmap_clutch_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let pedalMap = (0,svelte/* getContext */.fw)("WSC-pedalMap");
	let invertedMap = (0,svelte/* getContext */.fw)("WSC-invertedMap");
	let smoothMap = (0,svelte/* getContext */.fw)("WSC-smoothMap");
	let progress = 0;
	let pedalMapNumbers = [0, 20, 40, 60, 80, 100];
	let smooth = false;
	let inverted = false;

	const updateContext = e => {
		$$invalidate(1, pedalMapNumbers[e.target.name] = parseInt(e.target.value), pedalMapNumbers);

		pedalMap.update(existing => {
			return {
				...existing,
				...{ clutchMap: pedalMapNumbers }
			};
		});
	};

	const checkIfMatchCurveList = clutchMap => {
		const curve = JSON.stringify(clutchMap);

		if (curve === JSON.stringify(linearMap)) {
			return "linearMap";
		}

		if (curve === JSON.stringify(slowCurveMap)) {
			return "slowCurveMap";
		}

		if (curve === JSON.stringify(verySlowCurveMap)) {
			return "verySlowCurveMap";
		}

		if (curve === JSON.stringify(fastCurveMap)) {
			return "fastCurveMap";
		}

		if (curve === JSON.stringify(veryFastCurveMap)) {
			return "veryFastCurveMap";
		}

		if (curve === JSON.stringify(sCurveFastSlowMap)) {
			return "sCurveFastSlowMap";
		}

		if (curve === JSON.stringify(sCurveSlowFastMap)) {
			return "sCurveSlowFastMap";
		}

		return "";
	};

	const updateSmooth = e => {
		smoothMap.update(existing => {
			return {
				...existing,
				...{
					clutchSmooth: e.target.checked ? "1" : "0"
				}
			};
		});
	};

	const updateInverted = e => {
		invertedMap.update(existing => {
			return {
				...existing,
				...{
					clutchInverted: e.target.checked ? "1" : "0"
				}
			};
		});
	};

	const updateMapNumbers = e => {
		const selectedCurve = getMatchingCurve(e.target.value);

		pedalMap.update(existing => {
			return {
				...existing,
				...{ clutchMap: selectedCurve }
			};
		});
	};

	const getMatchingCurve = selectedValue => {
		if (selectedValue === "linearMap") {
			return linearMap.concat();
		}

		if (selectedValue === "slowCurveMap") {
			return slowCurveMap.concat();
		}

		if (selectedValue === "verySlowCurveMap") {
			return verySlowCurveMap.concat();
		}

		if (selectedValue === "fastCurveMap") {
			return fastCurveMap.concat();
		}

		if (selectedValue === "veryFastCurveMap") {
			return veryFastCurveMap.concat();
		}

		if (selectedValue === "sCurveFastSlowMap") {
			return sCurveFastSlowMap.concat();
		}

		if (selectedValue === "sCurveSlowFastMap") {
			return sCurveSlowFastMap.concat();
		}
	};

	let curves = "linearMap";
	const linearMap = [0, 20, 40, 60, 80, 100];
	const slowCurveMap = [0, 9, 21, 39, 63, 100];
	const verySlowCurveMap = [0, 4, 11, 25, 48, 100];
	const fastCurveMap = [0, 37, 61, 79, 91, 100];
	const veryFastCurveMap = [0, 52, 75, 89, 96, 100];
	const sCurveFastSlowMap = [0, 60, 75, 80, 85, 100];
	const sCurveSlowFastMap = [0, 31, 46, 54, 69, 100];

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			$$invalidate(0, progress = msg.clutch.after || 0);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	smoothMap.subscribe(value => {
		if (value) {
			$$invalidate(2, smooth = value.clutchSmooth === "1");
		}
	});

	invertedMap.subscribe(value => {
		if (value) {
			$$invalidate(3, inverted = value.clutchInverted === "1");
		}
	});

	pedalMap.subscribe(value => {
		if (JSON.stringify(value) !== "{}") {
			const { clutchMap } = value;
			$$invalidate(1, pedalMapNumbers = clutchMap);
			$$invalidate(4, curves = checkIfMatchCurveList(clutchMap));
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	const input_handler = e => updateContext(e);
	const input_handler_1 = e => updateContext(e);
	const input_handler_2 = e => updateContext(e);
	const input_handler_3 = e => updateContext(e);
	const input_handler_4 = e => updateContext(e);
	const input_handler_5 = e => updateContext(e);
	const input_handler_6 = e => updateMapNumbers(e);
	const input_handler_7 = e => updateSmooth(e);
	const input_handler_8 = e => updateInverted(e);

	return [
		progress,
		pedalMapNumbers,
		smooth,
		inverted,
		curves,
		updateContext,
		updateSmooth,
		updateInverted,
		updateMapNumbers,
		input_handler,
		input_handler_1,
		input_handler_2,
		input_handler_3,
		input_handler_4,
		input_handler_5,
		input_handler_6,
		input_handler_7,
		input_handler_8
	];
}

class Pedalmap_clutch extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Pedalmap_clutch_svelte_instance, Pedalmap_clutch_svelte_create_fragment, internal/* safe_not_equal */.N8, {}, [-1, -1]);
	}
}

/* harmony default export */ const Pedalmap_clutch_svelte = (Pedalmap_clutch);
;// CONCATENATED MODULE: ./src/Pedals/Components/D3PedalMap/D3PedalMap_brake.svelte
/* src\Pedals\Components\D3PedalMap\D3PedalMap_brake.svelte generated by Svelte v3.38.3 */





function D3PedalMap_brake_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-xp8anw-style";
	style.textContent = ".svelte-xp8anw .line{stroke-width:2;fill:none}.svelte-xp8anw .axis path{stroke:black}.svelte-xp8anw .text{font-size:12px}.svelte-xp8anw .title-text{font-size:12px}.svelte-xp8anw .grid line{stroke:lightgrey;stroke-opacity:0.7;shape-rendering:crispEdges}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3PedalMap_brake_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="brakeChart" class="svelte-xp8anw"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-xp8anw");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

var D3PedalMap_brake_svelte_width = 230;
var D3PedalMap_brake_svelte_height = 230;
var D3PedalMap_brake_svelte_margin = 25;
var D3PedalMap_brake_svelte_lineOpacity = "0.25";
var D3PedalMap_brake_svelte_circleOpacity = "0.85";
var D3PedalMap_brake_svelte_circleRadius = 3;

function D3PedalMap_brake_svelte_instance($$self) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let pedalMap = (0,svelte/* getContext */.fw)("WSC-pedalMap");
	let pedalMapNumbers = [0, 20, 40, 60, 80, 100];
	var svg;

	var data = [
		{
			name: "default",
			values: [
				{ increment: 0, position: 0 },
				{ increment: 20, position: 20 },
				{ increment: 40, position: 40 },
				{ increment: 60, position: 60 },
				{ increment: 80, position: 80 },
				{ increment: 100, position: 100 }
			]
		},
		{
			name: "curve",
			values: [
				{ increment: 0, position: 0 },
				{ increment: 20, position: 20 },
				{ increment: 40, position: 40 },
				{ increment: 60, position: 60 },
				{ increment: 80, position: 80 },
				{ increment: 100, position: 100 }
			]
		},
		{
			name: "input",
			values: [{ increment: 0, position: 0 }]
		}
	];

	/* Scale */
	var xScale = src/* scaleLinear */.BYU().domain([0, 100]).range([0, D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin]);

	var yScale = src/* scaleLinear */.BYU().domain([100, 0]).range([0, D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin]);

	const update = msg => {
		var select = src/* select */.Ys("#brakeChart");
		const cx_circle_s0 = (D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin) / 100 * msg.brake.after;
		const cy_circle_s0 = D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin - (D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin) / 100 * msg.brake.before;
		select.selectAll(".input .circle.s0 circle").attr("cx", cx_circle_s0).attr("cy", cy_circle_s0);
	};

	/* Add SVG */
	(0,svelte/* onMount */.H3)(() => {
		var color = src/* scaleOrdinal */.PKp(src/* schemeCategory10 */.Cn1);
		svg = src/* select */.Ys("#brakeChart").append("svg").attr("class", "container").attr("width", D3PedalMap_brake_svelte_width + D3PedalMap_brake_svelte_margin + "px").attr("height", D3PedalMap_brake_svelte_height + D3PedalMap_brake_svelte_margin + "px").append("g").attr("transform", `translate(${D3PedalMap_brake_svelte_margin}, ${D3PedalMap_brake_svelte_margin})`);

		////////begin draw grid ///////
		var gridlinesx = src/* axisTop */.F5q().tickFormat("").ticks(5).tickSize(-(D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin)).scale(xScale);

		var gridlinesy = src/* axisTop */.F5q().tickFormat("").ticks(5).tickSize(D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin).scale(yScale);
		svg.append("g").attr("class", "grid").call(gridlinesx);
		svg.append("g").attr("class", "grid").attr("transform", "rotate(90)").call(gridlinesy);

		////////end draw grid ///////
		/* Add line into SVG */
		var line = src/* line */.jvg().x(d => xScale(d.increment)).y(d => yScale(d.position));

		let lines = svg.append("g").attr("class", "lines");

		lines.selectAll(".line-group").data(data).enter().append("g").attr("class", function (d, i) {
			return "line-group" + " " + d.name;
		}).append("path").attr("class", "line").attr("d", d => line(d.values)).style("stroke", (d, i) => color(i)).style("opacity", D3PedalMap_brake_svelte_lineOpacity);

		/* Add circles in the line */
		lines.selectAll("circle-group").data(data).enter().append("g").style("fill", (d, i) => {
			return color(i);
		}).attr("class", function (d, i) {
			return d.name;
		}).selectAll("circle").data(d => d.values).enter().append("g").attr("class", function (d, i) {
			return "circle s" + i;
		}).append("circle").attr("cx", d => xScale(d.increment)).attr("cy", d => yScale(d.position)).attr("r", D3PedalMap_brake_svelte_circleRadius).style("opacity", D3PedalMap_brake_svelte_circleOpacity);

		/* Add Axis into SVG */
		var xAxis = src/* axisBottom */.LLu(xScale).ticks(5);

		var yAxis = src/* axisLeft */.y4O(yScale).ticks(5);
		svg.append("g").attr("class", "x axis").attr("transform", `translate(0, ${D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin})`).call(xAxis);
		svg.append("g").attr("class", "y axis").call(yAxis);
		updateGraph();
	});

	const updateGraph = () => {
		var select = src/* select */.Ys("#brakeChart");
		const cx_circle_s0 = (D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin) / 100 * 0;
		const cy_circle_s0 = D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin - (D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin) / 100 * pedalMapNumbers[0];
		const cx_circle_s1 = (D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin) / 100 * 20;
		const cy_circle_s1 = D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin - (D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin) / 100 * pedalMapNumbers[1];
		const cx_circle_s2 = (D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin) / 100 * 40;
		const cy_circle_s2 = D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin - (D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin) / 100 * pedalMapNumbers[2];
		const cx_circle_s3 = (D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin) / 100 * 60;
		const cy_circle_s3 = D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin - (D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin) / 100 * pedalMapNumbers[3];
		const cx_circle_s4 = (D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin) / 100 * 80;
		const cy_circle_s4 = D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin - (D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin) / 100 * pedalMapNumbers[4];
		const cx_circle_s5 = (D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin) / 100 * 100;
		const cy_circle_s5 = D3PedalMap_brake_svelte_width - D3PedalMap_brake_svelte_margin - (D3PedalMap_brake_svelte_height - D3PedalMap_brake_svelte_margin) / 100 * pedalMapNumbers[5];
		const line = "M" + cx_circle_s0 + "," + cy_circle_s0 + "L" + cx_circle_s1 + "," + cy_circle_s1 + "L" + cx_circle_s2 + "," + cy_circle_s2 + "L" + cx_circle_s3 + "," + cy_circle_s3 + "L" + cx_circle_s4 + "," + cy_circle_s4 + "L" + cx_circle_s5 + "," + cy_circle_s5;
		select.selectAll(".line-group.curve .line").attr("d", line);
		select.selectAll(".curve .circle.s0 circle").attr("cx", cx_circle_s0).attr("cy", cy_circle_s0);
		select.selectAll(".curve .circle.s1 circle").attr("cx", cx_circle_s1).attr("cy", cy_circle_s1);
		select.selectAll(".curve .circle.s2 circle").attr("cx", cx_circle_s2).attr("cy", cy_circle_s2);
		select.selectAll(".curve .circle.s3 circle").attr("cx", cx_circle_s3).attr("cy", cy_circle_s3);
		select.selectAll(".curve .circle.s4 circle").attr("cx", cx_circle_s4).attr("cy", cy_circle_s4);
		select.selectAll(".curve .circle.s5 circle").attr("cx", cx_circle_s5).attr("cy", cy_circle_s5);
	};

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	pedalMap.subscribe(value => {
		if (JSON.stringify(value) !== "{}") {
			const { brakeMap } = value;
			pedalMapNumbers = brakeMap;
			updateGraph();
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	return [];
}

class D3PedalMap_brake extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-xp8anw-style")) D3PedalMap_brake_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3PedalMap_brake_svelte_instance, D3PedalMap_brake_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3PedalMap_brake_svelte = (D3PedalMap_brake);
;// CONCATENATED MODULE: ./src/Pedals/Components/Pedalmap/Pedalmap_brake.svelte
/* src\Pedals\Components\Pedalmap\Pedalmap_brake.svelte generated by Svelte v3.38.3 */






function Pedalmap_brake_svelte_create_fragment(ctx) {
	let div12;
	let div10;
	let div0;
	let t1;
	let div9;
	let div1;
	let label0;
	let t3;
	let input0;
	let input0_value_value;
	let t4;
	let div2;
	let label1;
	let t6;
	let input1;
	let input1_value_value;
	let t7;
	let div3;
	let label2;
	let t9;
	let input2;
	let input2_value_value;
	let t10;
	let div4;
	let label3;
	let t12;
	let input3;
	let input3_value_value;
	let t13;
	let div5;
	let label4;
	let t15;
	let input4;
	let input4_value_value;
	let t16;
	let div6;
	let label5;
	let t18;
	let input5;
	let input5_value_value;
	let t19;
	let div7;
	let label6;
	let t20;
	let select;
	let option0;
	let option1;
	let option2;
	let option3;
	let option4;
	let option5;
	let option6;
	let option7;
	let t29;
	let div8;
	let label7;
	let input6;
	let t30;
	let t31;
	let label8;
	let input7;
	let t32;
	let t33;
	let d3pedalmap_brake;
	let t34;
	let div11;
	let verticalprogress;
	let current;
	let mounted;
	let dispose;
	d3pedalmap_brake = new D3PedalMap_brake_svelte({});

	verticalprogress = new VerticalProgress_svelte({
			props: {
				progress: /*progress*/ ctx[0],
				height: "470"
			}
		});

	return {
		c() {
			div12 = (0,internal/* element */.bG)("div");
			div10 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			div0.innerHTML = `<strong>brake</strong>`;
			t1 = (0,internal/* space */.Dh)();
			div9 = (0,internal/* element */.bG)("div");
			div1 = (0,internal/* element */.bG)("div");
			label0 = (0,internal/* element */.bG)("label");
			label0.textContent = "0%";
			t3 = (0,internal/* space */.Dh)();
			input0 = (0,internal/* element */.bG)("input");
			t4 = (0,internal/* space */.Dh)();
			div2 = (0,internal/* element */.bG)("div");
			label1 = (0,internal/* element */.bG)("label");
			label1.textContent = "20%";
			t6 = (0,internal/* space */.Dh)();
			input1 = (0,internal/* element */.bG)("input");
			t7 = (0,internal/* space */.Dh)();
			div3 = (0,internal/* element */.bG)("div");
			label2 = (0,internal/* element */.bG)("label");
			label2.textContent = "40%";
			t9 = (0,internal/* space */.Dh)();
			input2 = (0,internal/* element */.bG)("input");
			t10 = (0,internal/* space */.Dh)();
			div4 = (0,internal/* element */.bG)("div");
			label3 = (0,internal/* element */.bG)("label");
			label3.textContent = "60%";
			t12 = (0,internal/* space */.Dh)();
			input3 = (0,internal/* element */.bG)("input");
			t13 = (0,internal/* space */.Dh)();
			div5 = (0,internal/* element */.bG)("div");
			label4 = (0,internal/* element */.bG)("label");
			label4.textContent = "80%";
			t15 = (0,internal/* space */.Dh)();
			input4 = (0,internal/* element */.bG)("input");
			t16 = (0,internal/* space */.Dh)();
			div6 = (0,internal/* element */.bG)("div");
			label5 = (0,internal/* element */.bG)("label");
			label5.textContent = "100%";
			t18 = (0,internal/* space */.Dh)();
			input5 = (0,internal/* element */.bG)("input");
			t19 = (0,internal/* space */.Dh)();
			div7 = (0,internal/* element */.bG)("div");
			label6 = (0,internal/* element */.bG)("label");
			t20 = (0,internal/* space */.Dh)();
			select = (0,internal/* element */.bG)("select");
			option0 = (0,internal/* element */.bG)("option");
			option0.textContent = "custom curve";
			option1 = (0,internal/* element */.bG)("option");
			option1.textContent = "linear";
			option2 = (0,internal/* element */.bG)("option");
			option2.textContent = "slow curve";
			option3 = (0,internal/* element */.bG)("option");
			option3.textContent = "very slow curve";
			option4 = (0,internal/* element */.bG)("option");
			option4.textContent = "fast curve";
			option5 = (0,internal/* element */.bG)("option");
			option5.textContent = "very fast curve";
			option6 = (0,internal/* element */.bG)("option");
			option6.textContent = "s curve fast slow";
			option7 = (0,internal/* element */.bG)("option");
			option7.textContent = "s curve slow fast";
			t29 = (0,internal/* space */.Dh)();
			div8 = (0,internal/* element */.bG)("div");
			label7 = (0,internal/* element */.bG)("label");
			input6 = (0,internal/* element */.bG)("input");
			t30 = (0,internal/* text */.fL)("smooth");
			t31 = (0,internal/* space */.Dh)();
			label8 = (0,internal/* element */.bG)("label");
			input7 = (0,internal/* element */.bG)("input");
			t32 = (0,internal/* text */.fL)("inverted");
			t33 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(d3pedalmap_brake.$$.fragment);
			t34 = (0,internal/* space */.Dh)();
			div11 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(verticalprogress.$$.fragment);
			(0,internal/* set_style */.cz)(label0, "width", "50px");
			(0,internal/* set_style */.cz)(label0, "display", "inline-block");
			(0,internal/* attr */.Lj)(input0, "min", "0");
			(0,internal/* attr */.Lj)(input0, "max", "100");
			(0,internal/* attr */.Lj)(input0, "type", "number");
			(0,internal/* attr */.Lj)(input0, "name", "0");
			input0.value = input0_value_value = /*pedalMapNumbers*/ ctx[1][0];
			(0,internal/* set_style */.cz)(label1, "width", "50px");
			(0,internal/* set_style */.cz)(label1, "display", "inline-block");
			(0,internal/* attr */.Lj)(input1, "min", "0");
			(0,internal/* attr */.Lj)(input1, "max", "100");
			(0,internal/* attr */.Lj)(input1, "type", "number");
			(0,internal/* attr */.Lj)(input1, "name", "1");
			input1.value = input1_value_value = /*pedalMapNumbers*/ ctx[1][1];
			(0,internal/* set_style */.cz)(label2, "width", "50px");
			(0,internal/* set_style */.cz)(label2, "display", "inline-block");
			(0,internal/* attr */.Lj)(input2, "min", "0");
			(0,internal/* attr */.Lj)(input2, "max", "100");
			(0,internal/* attr */.Lj)(input2, "type", "number");
			(0,internal/* attr */.Lj)(input2, "name", "2");
			input2.value = input2_value_value = /*pedalMapNumbers*/ ctx[1][2];
			(0,internal/* set_style */.cz)(label3, "width", "50px");
			(0,internal/* set_style */.cz)(label3, "display", "inline-block");
			(0,internal/* attr */.Lj)(input3, "min", "0");
			(0,internal/* attr */.Lj)(input3, "max", "100");
			(0,internal/* attr */.Lj)(input3, "type", "number");
			(0,internal/* attr */.Lj)(input3, "name", "3");
			input3.value = input3_value_value = /*pedalMapNumbers*/ ctx[1][3];
			(0,internal/* set_style */.cz)(label4, "width", "50px");
			(0,internal/* set_style */.cz)(label4, "display", "inline-block");
			(0,internal/* attr */.Lj)(input4, "min", "0");
			(0,internal/* attr */.Lj)(input4, "max", "100");
			(0,internal/* attr */.Lj)(input4, "type", "number");
			(0,internal/* attr */.Lj)(input4, "name", "4");
			input4.value = input4_value_value = /*pedalMapNumbers*/ ctx[1][4];
			(0,internal/* set_style */.cz)(label5, "width", "50px");
			(0,internal/* set_style */.cz)(label5, "display", "inline-block");
			(0,internal/* attr */.Lj)(input5, "min", "0");
			(0,internal/* attr */.Lj)(input5, "max", "100");
			(0,internal/* attr */.Lj)(input5, "type", "number");
			(0,internal/* attr */.Lj)(input5, "name", "5");
			input5.value = input5_value_value = /*pedalMapNumbers*/ ctx[1][5];
			(0,internal/* set_style */.cz)(label6, "width", "50px");
			(0,internal/* set_style */.cz)(label6, "display", "inline-block");
			option0.__value = "";
			option0.value = option0.__value;
			option1.__value = "linearMap";
			option1.value = option1.__value;
			option2.__value = "slowCurveMap";
			option2.value = option2.__value;
			option3.__value = "verySlowCurveMap";
			option3.value = option3.__value;
			option4.__value = "fastCurveMap";
			option4.value = option4.__value;
			option5.__value = "veryFastCurveMap";
			option5.value = option5.__value;
			option6.__value = "sCurveFastSlowMap";
			option6.value = option6.__value;
			option7.__value = "sCurveSlowFastMap";
			option7.value = option7.__value;
			(0,internal/* attr */.Lj)(select, "name", "curves");
			(0,internal/* attr */.Lj)(input6, "type", "checkbox");
			input6.checked = /*smooth*/ ctx[2];
			(0,internal/* attr */.Lj)(input7, "type", "checkbox");
			input7.checked = /*inverted*/ ctx[3];
			(0,internal/* set_style */.cz)(div9, "display", "inline-block");
			(0,internal/* set_style */.cz)(div10, "display", "inline-block");
			(0,internal/* set_style */.cz)(div10, "vertical-align", "top");
			(0,internal/* set_style */.cz)(div11, "display", "inline-block");
			(0,internal/* set_style */.cz)(div11, "vertical-align", "top");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div12, anchor);
			(0,internal/* append */.R3)(div12, div10);
			(0,internal/* append */.R3)(div10, div0);
			(0,internal/* append */.R3)(div10, t1);
			(0,internal/* append */.R3)(div10, div9);
			(0,internal/* append */.R3)(div9, div1);
			(0,internal/* append */.R3)(div1, label0);
			(0,internal/* append */.R3)(div1, t3);
			(0,internal/* append */.R3)(div1, input0);
			(0,internal/* append */.R3)(div9, t4);
			(0,internal/* append */.R3)(div9, div2);
			(0,internal/* append */.R3)(div2, label1);
			(0,internal/* append */.R3)(div2, t6);
			(0,internal/* append */.R3)(div2, input1);
			(0,internal/* append */.R3)(div9, t7);
			(0,internal/* append */.R3)(div9, div3);
			(0,internal/* append */.R3)(div3, label2);
			(0,internal/* append */.R3)(div3, t9);
			(0,internal/* append */.R3)(div3, input2);
			(0,internal/* append */.R3)(div9, t10);
			(0,internal/* append */.R3)(div9, div4);
			(0,internal/* append */.R3)(div4, label3);
			(0,internal/* append */.R3)(div4, t12);
			(0,internal/* append */.R3)(div4, input3);
			(0,internal/* append */.R3)(div9, t13);
			(0,internal/* append */.R3)(div9, div5);
			(0,internal/* append */.R3)(div5, label4);
			(0,internal/* append */.R3)(div5, t15);
			(0,internal/* append */.R3)(div5, input4);
			(0,internal/* append */.R3)(div9, t16);
			(0,internal/* append */.R3)(div9, div6);
			(0,internal/* append */.R3)(div6, label5);
			(0,internal/* append */.R3)(div6, t18);
			(0,internal/* append */.R3)(div6, input5);
			(0,internal/* append */.R3)(div9, t19);
			(0,internal/* append */.R3)(div9, div7);
			(0,internal/* append */.R3)(div7, label6);
			(0,internal/* append */.R3)(div7, t20);
			(0,internal/* append */.R3)(div7, select);
			(0,internal/* append */.R3)(select, option0);
			(0,internal/* append */.R3)(select, option1);
			(0,internal/* append */.R3)(select, option2);
			(0,internal/* append */.R3)(select, option3);
			(0,internal/* append */.R3)(select, option4);
			(0,internal/* append */.R3)(select, option5);
			(0,internal/* append */.R3)(select, option6);
			(0,internal/* append */.R3)(select, option7);
			(0,internal/* select_option */.oW)(select, /*curves*/ ctx[4]);
			(0,internal/* append */.R3)(div9, t29);
			(0,internal/* append */.R3)(div9, div8);
			(0,internal/* append */.R3)(div8, label7);
			(0,internal/* append */.R3)(label7, input6);
			(0,internal/* append */.R3)(label7, t30);
			(0,internal/* append */.R3)(div8, t31);
			(0,internal/* append */.R3)(div8, label8);
			(0,internal/* append */.R3)(label8, input7);
			(0,internal/* append */.R3)(label8, t32);
			(0,internal/* append */.R3)(div10, t33);
			(0,internal/* mount_component */.ye)(d3pedalmap_brake, div10, null);
			(0,internal/* append */.R3)(div12, t34);
			(0,internal/* append */.R3)(div12, div11);
			(0,internal/* mount_component */.ye)(verticalprogress, div11, null);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(input0, "input", /*input_handler*/ ctx[9]),
					(0,internal/* listen */.oL)(input1, "input", /*input_handler_1*/ ctx[10]),
					(0,internal/* listen */.oL)(input2, "input", /*input_handler_2*/ ctx[11]),
					(0,internal/* listen */.oL)(input3, "input", /*input_handler_3*/ ctx[12]),
					(0,internal/* listen */.oL)(input4, "input", /*input_handler_4*/ ctx[13]),
					(0,internal/* listen */.oL)(input5, "input", /*input_handler_5*/ ctx[14]),
					(0,internal/* listen */.oL)(select, "input", /*input_handler_6*/ ctx[15]),
					(0,internal/* listen */.oL)(input6, "input", /*input_handler_7*/ ctx[16]),
					(0,internal/* listen */.oL)(input7, "input", /*input_handler_8*/ ctx[17])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input0_value_value !== (input0_value_value = /*pedalMapNumbers*/ ctx[1][0])) {
				input0.value = input0_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input1_value_value !== (input1_value_value = /*pedalMapNumbers*/ ctx[1][1])) {
				input1.value = input1_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input2_value_value !== (input2_value_value = /*pedalMapNumbers*/ ctx[1][2])) {
				input2.value = input2_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input3_value_value !== (input3_value_value = /*pedalMapNumbers*/ ctx[1][3])) {
				input3.value = input3_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input4_value_value !== (input4_value_value = /*pedalMapNumbers*/ ctx[1][4])) {
				input4.value = input4_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input5_value_value !== (input5_value_value = /*pedalMapNumbers*/ ctx[1][5])) {
				input5.value = input5_value_value;
			}

			if (!current || dirty[0] & /*curves*/ 16) {
				(0,internal/* select_option */.oW)(select, /*curves*/ ctx[4]);
			}

			if (!current || dirty[0] & /*smooth*/ 4) {
				input6.checked = /*smooth*/ ctx[2];
			}

			if (!current || dirty[0] & /*inverted*/ 8) {
				input7.checked = /*inverted*/ ctx[3];
			}

			const verticalprogress_changes = {};
			if (dirty[0] & /*progress*/ 1) verticalprogress_changes.progress = /*progress*/ ctx[0];
			verticalprogress.$set(verticalprogress_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(d3pedalmap_brake.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(verticalprogress.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(d3pedalmap_brake.$$.fragment, local);
			(0,internal/* transition_out */.et)(verticalprogress.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div12);
			(0,internal/* destroy_component */.vp)(d3pedalmap_brake);
			(0,internal/* destroy_component */.vp)(verticalprogress);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Pedalmap_brake_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let pedalMap = (0,svelte/* getContext */.fw)("WSC-pedalMap");
	let invertedMap = (0,svelte/* getContext */.fw)("WSC-invertedMap");
	let smoothMap = (0,svelte/* getContext */.fw)("WSC-smoothMap");
	let progress = 0;
	let pedalMapNumbers = [0, 20, 40, 60, 80, 100];
	let smooth = false;
	let inverted = false;

	const updateContext = e => {
		$$invalidate(1, pedalMapNumbers[e.target.name] = parseInt(e.target.value), pedalMapNumbers);

		pedalMap.update(existing => {
			return {
				...existing,
				...{ brakeMap: pedalMapNumbers }
			};
		});
	};

	const checkIfMatchCurveList = brakeMap => {
		const curve = JSON.stringify(brakeMap);

		if (curve === JSON.stringify(linearMap)) {
			return "linearMap";
		}

		if (curve === JSON.stringify(slowCurveMap)) {
			return "slowCurveMap";
		}

		if (curve === JSON.stringify(verySlowCurveMap)) {
			return "verySlowCurveMap";
		}

		if (curve === JSON.stringify(fastCurveMap)) {
			return "fastCurveMap";
		}

		if (curve === JSON.stringify(veryFastCurveMap)) {
			return "veryFastCurveMap";
		}

		if (curve === JSON.stringify(sCurveFastSlowMap)) {
			return "sCurveFastSlowMap";
		}

		if (curve === JSON.stringify(sCurveSlowFastMap)) {
			return "sCurveSlowFastMap";
		}

		return "";
	};

	const updateSmooth = e => {
		smoothMap.update(existing => {
			return {
				...existing,
				...{
					brakeSmooth: e.target.checked ? "1" : "0"
				}
			};
		});
	};

	const updateInverted = e => {
		invertedMap.update(existing => {
			return {
				...existing,
				...{
					brakeInverted: e.target.checked ? "1" : "0"
				}
			};
		});
	};

	const updateMapNumbers = e => {
		const selectedCurve = getMatchingCurve(e.target.value);

		pedalMap.update(existing => {
			return {
				...existing,
				...{ brakeMap: selectedCurve }
			};
		});
	};

	const getMatchingCurve = selectedValue => {
		if (selectedValue === "linearMap") {
			return linearMap.concat();
		}

		if (selectedValue === "slowCurveMap") {
			return slowCurveMap.concat();
		}

		if (selectedValue === "verySlowCurveMap") {
			return verySlowCurveMap.concat();
		}

		if (selectedValue === "fastCurveMap") {
			return fastCurveMap.concat();
		}

		if (selectedValue === "veryFastCurveMap") {
			return veryFastCurveMap.concat();
		}

		if (selectedValue === "sCurveFastSlowMap") {
			return sCurveFastSlowMap.concat();
		}

		if (selectedValue === "sCurveSlowFastMap") {
			return sCurveSlowFastMap.concat();
		}
	};

	let curves = "linearMap";
	const linearMap = [0, 20, 40, 60, 80, 100];
	const slowCurveMap = [0, 9, 21, 39, 63, 100];
	const verySlowCurveMap = [0, 4, 11, 25, 48, 100];
	const fastCurveMap = [0, 37, 61, 79, 91, 100];
	const veryFastCurveMap = [0, 52, 75, 89, 96, 100];
	const sCurveFastSlowMap = [0, 60, 75, 80, 85, 100];
	const sCurveSlowFastMap = [0, 31, 46, 54, 69, 100];

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			$$invalidate(0, progress = msg.brake.after || 0);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	smoothMap.subscribe(value => {
		if (value) {
			$$invalidate(2, smooth = value.brakeSmooth === "1");
		}
	});

	invertedMap.subscribe(value => {
		if (value) {
			$$invalidate(3, inverted = value.brakeInverted === "1");
		}
	});

	pedalMap.subscribe(value => {
		if (JSON.stringify(value) !== "{}") {
			const { brakeMap } = value;
			$$invalidate(1, pedalMapNumbers = brakeMap);
			$$invalidate(4, curves = checkIfMatchCurveList(brakeMap));
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	const input_handler = e => updateContext(e);
	const input_handler_1 = e => updateContext(e);
	const input_handler_2 = e => updateContext(e);
	const input_handler_3 = e => updateContext(e);
	const input_handler_4 = e => updateContext(e);
	const input_handler_5 = e => updateContext(e);
	const input_handler_6 = e => updateMapNumbers(e);
	const input_handler_7 = e => updateSmooth(e);
	const input_handler_8 = e => updateInverted(e);

	return [
		progress,
		pedalMapNumbers,
		smooth,
		inverted,
		curves,
		updateContext,
		updateSmooth,
		updateInverted,
		updateMapNumbers,
		input_handler,
		input_handler_1,
		input_handler_2,
		input_handler_3,
		input_handler_4,
		input_handler_5,
		input_handler_6,
		input_handler_7,
		input_handler_8
	];
}

class Pedalmap_brake extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Pedalmap_brake_svelte_instance, Pedalmap_brake_svelte_create_fragment, internal/* safe_not_equal */.N8, {}, [-1, -1]);
	}
}

/* harmony default export */ const Pedalmap_brake_svelte = (Pedalmap_brake);
;// CONCATENATED MODULE: ./src/Pedals/Components/D3PedalMap/D3PedalMap_throttle.svelte
/* src\Pedals\Components\D3PedalMap\D3PedalMap_throttle.svelte generated by Svelte v3.38.3 */





function D3PedalMap_throttle_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-xp8anw-style";
	style.textContent = ".svelte-xp8anw .line{stroke-width:2;fill:none}.svelte-xp8anw .axis path{stroke:black}.svelte-xp8anw .text{font-size:12px}.svelte-xp8anw .title-text{font-size:12px}.svelte-xp8anw .grid line{stroke:lightgrey;stroke-opacity:0.7;shape-rendering:crispEdges}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3PedalMap_throttle_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="throttleChart" class="svelte-xp8anw"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-xp8anw");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

var D3PedalMap_throttle_svelte_width = 230;
var D3PedalMap_throttle_svelte_height = 230;
var D3PedalMap_throttle_svelte_margin = 25;
var D3PedalMap_throttle_svelte_lineOpacity = "0.25";
var D3PedalMap_throttle_svelte_circleOpacity = "0.85";
var D3PedalMap_throttle_svelte_circleRadius = 3;

function D3PedalMap_throttle_svelte_instance($$self) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let pedalMap = (0,svelte/* getContext */.fw)("WSC-pedalMap");
	let pedalMapNumbers = [0, 20, 40, 60, 80, 100];
	var svg;

	var data = [
		{
			name: "default",
			values: [
				{ increment: 0, position: 0 },
				{ increment: 20, position: 20 },
				{ increment: 40, position: 40 },
				{ increment: 60, position: 60 },
				{ increment: 80, position: 80 },
				{ increment: 100, position: 100 }
			]
		},
		{
			name: "curve",
			values: [
				{ increment: 0, position: 0 },
				{ increment: 20, position: 20 },
				{ increment: 40, position: 40 },
				{ increment: 60, position: 60 },
				{ increment: 80, position: 80 },
				{ increment: 100, position: 100 }
			]
		},
		{
			name: "input",
			values: [{ increment: 0, position: 0 }]
		}
	];

	/* Scale */
	var xScale = src/* scaleLinear */.BYU().domain([0, 100]).range([0, D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin]);

	var yScale = src/* scaleLinear */.BYU().domain([100, 0]).range([0, D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin]);

	const update = msg => {
		var select = src/* select */.Ys("#throttleChart");
		const cx_circle_s0 = (D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin) / 100 * msg.throttle.after;
		const cy_circle_s0 = D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin - (D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin) / 100 * msg.throttle.before;
		select.selectAll(".input .circle.s0 circle").attr("cx", cx_circle_s0).attr("cy", cy_circle_s0);
	};

	/* Add SVG */
	(0,svelte/* onMount */.H3)(() => {
		var color = src/* scaleOrdinal */.PKp(src/* schemeCategory10 */.Cn1);
		svg = src/* select */.Ys("#throttleChart").append("svg").attr("class", "container").attr("width", D3PedalMap_throttle_svelte_width + D3PedalMap_throttle_svelte_margin + "px").attr("height", D3PedalMap_throttle_svelte_height + D3PedalMap_throttle_svelte_margin + "px").append("g").attr("transform", `translate(${D3PedalMap_throttle_svelte_margin}, ${D3PedalMap_throttle_svelte_margin})`);

		////////begin draw grid ///////
		var gridlinesx = src/* axisTop */.F5q().tickFormat("").ticks(5).tickSize(-(D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin)).scale(xScale);

		var gridlinesy = src/* axisTop */.F5q().tickFormat("").ticks(5).tickSize(D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin).scale(yScale);
		svg.append("g").attr("class", "grid").call(gridlinesx);
		svg.append("g").attr("class", "grid").attr("transform", "rotate(90)").call(gridlinesy);

		////////end draw grid ///////
		/* Add line into SVG */
		var line = src/* line */.jvg().x(d => xScale(d.increment)).y(d => yScale(d.position));

		let lines = svg.append("g").attr("class", "lines");

		lines.selectAll(".line-group").data(data).enter().append("g").attr("class", function (d, i) {
			return "line-group" + " " + d.name;
		}).append("path").attr("class", "line").attr("d", d => line(d.values)).style("stroke", (d, i) => color(i)).style("opacity", D3PedalMap_throttle_svelte_lineOpacity);

		/* Add circles in the line */
		lines.selectAll("circle-group").data(data).enter().append("g").style("fill", (d, i) => {
			return color(i);
		}).attr("class", function (d, i) {
			return d.name;
		}).selectAll("circle").data(d => d.values).enter().append("g").attr("class", function (d, i) {
			return "circle s" + i;
		}).append("circle").attr("cx", d => xScale(d.increment)).attr("cy", d => yScale(d.position)).attr("r", D3PedalMap_throttle_svelte_circleRadius).style("opacity", D3PedalMap_throttle_svelte_circleOpacity);

		/* Add Axis into SVG */
		var xAxis = src/* axisBottom */.LLu(xScale).ticks(5);

		var yAxis = src/* axisLeft */.y4O(yScale).ticks(5);
		svg.append("g").attr("class", "x axis").attr("transform", `translate(0, ${D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin})`).call(xAxis);
		svg.append("g").attr("class", "y axis").call(yAxis);
		updateGraph();
	});

	const updateGraph = () => {
		var select = src/* select */.Ys("#throttleChart");
		const cx_circle_s0 = (D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin) / 100 * 0;
		const cy_circle_s0 = D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin - (D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin) / 100 * pedalMapNumbers[0];
		const cx_circle_s1 = (D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin) / 100 * 20;
		const cy_circle_s1 = D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin - (D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin) / 100 * pedalMapNumbers[1];
		const cx_circle_s2 = (D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin) / 100 * 40;
		const cy_circle_s2 = D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin - (D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin) / 100 * pedalMapNumbers[2];
		const cx_circle_s3 = (D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin) / 100 * 60;
		const cy_circle_s3 = D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin - (D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin) / 100 * pedalMapNumbers[3];
		const cx_circle_s4 = (D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin) / 100 * 80;
		const cy_circle_s4 = D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin - (D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin) / 100 * pedalMapNumbers[4];
		const cx_circle_s5 = (D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin) / 100 * 100;
		const cy_circle_s5 = D3PedalMap_throttle_svelte_width - D3PedalMap_throttle_svelte_margin - (D3PedalMap_throttle_svelte_height - D3PedalMap_throttle_svelte_margin) / 100 * pedalMapNumbers[5];
		const line = "M" + cx_circle_s0 + "," + cy_circle_s0 + "L" + cx_circle_s1 + "," + cy_circle_s1 + "L" + cx_circle_s2 + "," + cy_circle_s2 + "L" + cx_circle_s3 + "," + cy_circle_s3 + "L" + cx_circle_s4 + "," + cy_circle_s4 + "L" + cx_circle_s5 + "," + cy_circle_s5;
		select.selectAll(".line-group.curve .line").attr("d", line);
		select.selectAll(".curve .circle.s0 circle").attr("cx", cx_circle_s0).attr("cy", cy_circle_s0);
		select.selectAll(".curve .circle.s1 circle").attr("cx", cx_circle_s1).attr("cy", cy_circle_s1);
		select.selectAll(".curve .circle.s2 circle").attr("cx", cx_circle_s2).attr("cy", cy_circle_s2);
		select.selectAll(".curve .circle.s3 circle").attr("cx", cx_circle_s3).attr("cy", cy_circle_s3);
		select.selectAll(".curve .circle.s4 circle").attr("cx", cx_circle_s4).attr("cy", cy_circle_s4);
		select.selectAll(".curve .circle.s5 circle").attr("cx", cx_circle_s5).attr("cy", cy_circle_s5);
	};

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	pedalMap.subscribe(value => {
		if (JSON.stringify(value) !== "{}") {
			const { throttleMap } = value;
			pedalMapNumbers = throttleMap;
			updateGraph();
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	return [];
}

class D3PedalMap_throttle extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-xp8anw-style")) D3PedalMap_throttle_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3PedalMap_throttle_svelte_instance, D3PedalMap_throttle_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3PedalMap_throttle_svelte = (D3PedalMap_throttle);
;// CONCATENATED MODULE: ./src/Pedals/Components/Pedalmap/Pedalmap_throttle.svelte
/* src\Pedals\Components\Pedalmap\Pedalmap_throttle.svelte generated by Svelte v3.38.3 */






function Pedalmap_throttle_svelte_create_fragment(ctx) {
	let div12;
	let div10;
	let div0;
	let t1;
	let div9;
	let div1;
	let label0;
	let t3;
	let input0;
	let input0_value_value;
	let t4;
	let div2;
	let label1;
	let t6;
	let input1;
	let input1_value_value;
	let t7;
	let div3;
	let label2;
	let t9;
	let input2;
	let input2_value_value;
	let t10;
	let div4;
	let label3;
	let t12;
	let input3;
	let input3_value_value;
	let t13;
	let div5;
	let label4;
	let t15;
	let input4;
	let input4_value_value;
	let t16;
	let div6;
	let label5;
	let t18;
	let input5;
	let input5_value_value;
	let t19;
	let div7;
	let label6;
	let t20;
	let select;
	let option0;
	let option1;
	let option2;
	let option3;
	let option4;
	let option5;
	let option6;
	let option7;
	let t29;
	let div8;
	let label7;
	let input6;
	let t30;
	let t31;
	let label8;
	let input7;
	let t32;
	let t33;
	let d3pedalmap_throttle;
	let t34;
	let div11;
	let verticalprogress;
	let current;
	let mounted;
	let dispose;
	d3pedalmap_throttle = new D3PedalMap_throttle_svelte({});

	verticalprogress = new VerticalProgress_svelte({
			props: {
				progress: /*progress*/ ctx[0],
				height: "470"
			}
		});

	return {
		c() {
			div12 = (0,internal/* element */.bG)("div");
			div10 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			div0.innerHTML = `<strong>throttle</strong>`;
			t1 = (0,internal/* space */.Dh)();
			div9 = (0,internal/* element */.bG)("div");
			div1 = (0,internal/* element */.bG)("div");
			label0 = (0,internal/* element */.bG)("label");
			label0.textContent = "0%";
			t3 = (0,internal/* space */.Dh)();
			input0 = (0,internal/* element */.bG)("input");
			t4 = (0,internal/* space */.Dh)();
			div2 = (0,internal/* element */.bG)("div");
			label1 = (0,internal/* element */.bG)("label");
			label1.textContent = "20%";
			t6 = (0,internal/* space */.Dh)();
			input1 = (0,internal/* element */.bG)("input");
			t7 = (0,internal/* space */.Dh)();
			div3 = (0,internal/* element */.bG)("div");
			label2 = (0,internal/* element */.bG)("label");
			label2.textContent = "40%";
			t9 = (0,internal/* space */.Dh)();
			input2 = (0,internal/* element */.bG)("input");
			t10 = (0,internal/* space */.Dh)();
			div4 = (0,internal/* element */.bG)("div");
			label3 = (0,internal/* element */.bG)("label");
			label3.textContent = "60%";
			t12 = (0,internal/* space */.Dh)();
			input3 = (0,internal/* element */.bG)("input");
			t13 = (0,internal/* space */.Dh)();
			div5 = (0,internal/* element */.bG)("div");
			label4 = (0,internal/* element */.bG)("label");
			label4.textContent = "80%";
			t15 = (0,internal/* space */.Dh)();
			input4 = (0,internal/* element */.bG)("input");
			t16 = (0,internal/* space */.Dh)();
			div6 = (0,internal/* element */.bG)("div");
			label5 = (0,internal/* element */.bG)("label");
			label5.textContent = "100%";
			t18 = (0,internal/* space */.Dh)();
			input5 = (0,internal/* element */.bG)("input");
			t19 = (0,internal/* space */.Dh)();
			div7 = (0,internal/* element */.bG)("div");
			label6 = (0,internal/* element */.bG)("label");
			t20 = (0,internal/* space */.Dh)();
			select = (0,internal/* element */.bG)("select");
			option0 = (0,internal/* element */.bG)("option");
			option0.textContent = "custom curve";
			option1 = (0,internal/* element */.bG)("option");
			option1.textContent = "linear";
			option2 = (0,internal/* element */.bG)("option");
			option2.textContent = "slow curve";
			option3 = (0,internal/* element */.bG)("option");
			option3.textContent = "very slow curve";
			option4 = (0,internal/* element */.bG)("option");
			option4.textContent = "fast curve";
			option5 = (0,internal/* element */.bG)("option");
			option5.textContent = "very fast curve";
			option6 = (0,internal/* element */.bG)("option");
			option6.textContent = "s curve fast slow";
			option7 = (0,internal/* element */.bG)("option");
			option7.textContent = "s curve slow fast";
			t29 = (0,internal/* space */.Dh)();
			div8 = (0,internal/* element */.bG)("div");
			label7 = (0,internal/* element */.bG)("label");
			input6 = (0,internal/* element */.bG)("input");
			t30 = (0,internal/* text */.fL)("smooth");
			t31 = (0,internal/* space */.Dh)();
			label8 = (0,internal/* element */.bG)("label");
			input7 = (0,internal/* element */.bG)("input");
			t32 = (0,internal/* text */.fL)("inverted");
			t33 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(d3pedalmap_throttle.$$.fragment);
			t34 = (0,internal/* space */.Dh)();
			div11 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(verticalprogress.$$.fragment);
			(0,internal/* set_style */.cz)(label0, "width", "50px");
			(0,internal/* set_style */.cz)(label0, "display", "inline-block");
			(0,internal/* attr */.Lj)(input0, "min", "0");
			(0,internal/* attr */.Lj)(input0, "max", "100");
			(0,internal/* attr */.Lj)(input0, "type", "number");
			(0,internal/* attr */.Lj)(input0, "name", "0");
			input0.value = input0_value_value = /*pedalMapNumbers*/ ctx[1][0];
			(0,internal/* set_style */.cz)(label1, "width", "50px");
			(0,internal/* set_style */.cz)(label1, "display", "inline-block");
			(0,internal/* attr */.Lj)(input1, "min", "0");
			(0,internal/* attr */.Lj)(input1, "max", "100");
			(0,internal/* attr */.Lj)(input1, "type", "number");
			(0,internal/* attr */.Lj)(input1, "name", "1");
			input1.value = input1_value_value = /*pedalMapNumbers*/ ctx[1][1];
			(0,internal/* set_style */.cz)(label2, "width", "50px");
			(0,internal/* set_style */.cz)(label2, "display", "inline-block");
			(0,internal/* attr */.Lj)(input2, "min", "0");
			(0,internal/* attr */.Lj)(input2, "max", "100");
			(0,internal/* attr */.Lj)(input2, "type", "number");
			(0,internal/* attr */.Lj)(input2, "name", "2");
			input2.value = input2_value_value = /*pedalMapNumbers*/ ctx[1][2];
			(0,internal/* set_style */.cz)(label3, "width", "50px");
			(0,internal/* set_style */.cz)(label3, "display", "inline-block");
			(0,internal/* attr */.Lj)(input3, "min", "0");
			(0,internal/* attr */.Lj)(input3, "max", "100");
			(0,internal/* attr */.Lj)(input3, "type", "number");
			(0,internal/* attr */.Lj)(input3, "name", "3");
			input3.value = input3_value_value = /*pedalMapNumbers*/ ctx[1][3];
			(0,internal/* set_style */.cz)(label4, "width", "50px");
			(0,internal/* set_style */.cz)(label4, "display", "inline-block");
			(0,internal/* attr */.Lj)(input4, "min", "0");
			(0,internal/* attr */.Lj)(input4, "max", "100");
			(0,internal/* attr */.Lj)(input4, "type", "number");
			(0,internal/* attr */.Lj)(input4, "name", "4");
			input4.value = input4_value_value = /*pedalMapNumbers*/ ctx[1][4];
			(0,internal/* set_style */.cz)(label5, "width", "50px");
			(0,internal/* set_style */.cz)(label5, "display", "inline-block");
			(0,internal/* attr */.Lj)(input5, "min", "0");
			(0,internal/* attr */.Lj)(input5, "max", "100");
			(0,internal/* attr */.Lj)(input5, "type", "number");
			(0,internal/* attr */.Lj)(input5, "name", "5");
			input5.value = input5_value_value = /*pedalMapNumbers*/ ctx[1][5];
			(0,internal/* set_style */.cz)(label6, "width", "50px");
			(0,internal/* set_style */.cz)(label6, "display", "inline-block");
			option0.__value = "";
			option0.value = option0.__value;
			option1.__value = "linearMap";
			option1.value = option1.__value;
			option2.__value = "slowCurveMap";
			option2.value = option2.__value;
			option3.__value = "verySlowCurveMap";
			option3.value = option3.__value;
			option4.__value = "fastCurveMap";
			option4.value = option4.__value;
			option5.__value = "veryFastCurveMap";
			option5.value = option5.__value;
			option6.__value = "sCurveFastSlowMap";
			option6.value = option6.__value;
			option7.__value = "sCurveSlowFastMap";
			option7.value = option7.__value;
			(0,internal/* attr */.Lj)(select, "name", "curves");
			(0,internal/* attr */.Lj)(input6, "type", "checkbox");
			input6.checked = /*smooth*/ ctx[2];
			(0,internal/* attr */.Lj)(input7, "type", "checkbox");
			input7.checked = /*inverted*/ ctx[3];
			(0,internal/* set_style */.cz)(div9, "display", "inline-block");
			(0,internal/* set_style */.cz)(div10, "display", "inline-block");
			(0,internal/* set_style */.cz)(div10, "vertical-align", "top");
			(0,internal/* set_style */.cz)(div11, "display", "inline-block");
			(0,internal/* set_style */.cz)(div11, "vertical-align", "top");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div12, anchor);
			(0,internal/* append */.R3)(div12, div10);
			(0,internal/* append */.R3)(div10, div0);
			(0,internal/* append */.R3)(div10, t1);
			(0,internal/* append */.R3)(div10, div9);
			(0,internal/* append */.R3)(div9, div1);
			(0,internal/* append */.R3)(div1, label0);
			(0,internal/* append */.R3)(div1, t3);
			(0,internal/* append */.R3)(div1, input0);
			(0,internal/* append */.R3)(div9, t4);
			(0,internal/* append */.R3)(div9, div2);
			(0,internal/* append */.R3)(div2, label1);
			(0,internal/* append */.R3)(div2, t6);
			(0,internal/* append */.R3)(div2, input1);
			(0,internal/* append */.R3)(div9, t7);
			(0,internal/* append */.R3)(div9, div3);
			(0,internal/* append */.R3)(div3, label2);
			(0,internal/* append */.R3)(div3, t9);
			(0,internal/* append */.R3)(div3, input2);
			(0,internal/* append */.R3)(div9, t10);
			(0,internal/* append */.R3)(div9, div4);
			(0,internal/* append */.R3)(div4, label3);
			(0,internal/* append */.R3)(div4, t12);
			(0,internal/* append */.R3)(div4, input3);
			(0,internal/* append */.R3)(div9, t13);
			(0,internal/* append */.R3)(div9, div5);
			(0,internal/* append */.R3)(div5, label4);
			(0,internal/* append */.R3)(div5, t15);
			(0,internal/* append */.R3)(div5, input4);
			(0,internal/* append */.R3)(div9, t16);
			(0,internal/* append */.R3)(div9, div6);
			(0,internal/* append */.R3)(div6, label5);
			(0,internal/* append */.R3)(div6, t18);
			(0,internal/* append */.R3)(div6, input5);
			(0,internal/* append */.R3)(div9, t19);
			(0,internal/* append */.R3)(div9, div7);
			(0,internal/* append */.R3)(div7, label6);
			(0,internal/* append */.R3)(div7, t20);
			(0,internal/* append */.R3)(div7, select);
			(0,internal/* append */.R3)(select, option0);
			(0,internal/* append */.R3)(select, option1);
			(0,internal/* append */.R3)(select, option2);
			(0,internal/* append */.R3)(select, option3);
			(0,internal/* append */.R3)(select, option4);
			(0,internal/* append */.R3)(select, option5);
			(0,internal/* append */.R3)(select, option6);
			(0,internal/* append */.R3)(select, option7);
			(0,internal/* select_option */.oW)(select, /*curves*/ ctx[4]);
			(0,internal/* append */.R3)(div9, t29);
			(0,internal/* append */.R3)(div9, div8);
			(0,internal/* append */.R3)(div8, label7);
			(0,internal/* append */.R3)(label7, input6);
			(0,internal/* append */.R3)(label7, t30);
			(0,internal/* append */.R3)(div8, t31);
			(0,internal/* append */.R3)(div8, label8);
			(0,internal/* append */.R3)(label8, input7);
			(0,internal/* append */.R3)(label8, t32);
			(0,internal/* append */.R3)(div10, t33);
			(0,internal/* mount_component */.ye)(d3pedalmap_throttle, div10, null);
			(0,internal/* append */.R3)(div12, t34);
			(0,internal/* append */.R3)(div12, div11);
			(0,internal/* mount_component */.ye)(verticalprogress, div11, null);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(input0, "input", /*input_handler*/ ctx[9]),
					(0,internal/* listen */.oL)(input1, "input", /*input_handler_1*/ ctx[10]),
					(0,internal/* listen */.oL)(input2, "input", /*input_handler_2*/ ctx[11]),
					(0,internal/* listen */.oL)(input3, "input", /*input_handler_3*/ ctx[12]),
					(0,internal/* listen */.oL)(input4, "input", /*input_handler_4*/ ctx[13]),
					(0,internal/* listen */.oL)(input5, "input", /*input_handler_5*/ ctx[14]),
					(0,internal/* listen */.oL)(select, "input", /*input_handler_6*/ ctx[15]),
					(0,internal/* listen */.oL)(input6, "input", /*input_handler_7*/ ctx[16]),
					(0,internal/* listen */.oL)(input7, "input", /*input_handler_8*/ ctx[17])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input0_value_value !== (input0_value_value = /*pedalMapNumbers*/ ctx[1][0])) {
				input0.value = input0_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input1_value_value !== (input1_value_value = /*pedalMapNumbers*/ ctx[1][1])) {
				input1.value = input1_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input2_value_value !== (input2_value_value = /*pedalMapNumbers*/ ctx[1][2])) {
				input2.value = input2_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input3_value_value !== (input3_value_value = /*pedalMapNumbers*/ ctx[1][3])) {
				input3.value = input3_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input4_value_value !== (input4_value_value = /*pedalMapNumbers*/ ctx[1][4])) {
				input4.value = input4_value_value;
			}

			if (!current || dirty[0] & /*pedalMapNumbers*/ 2 && input5_value_value !== (input5_value_value = /*pedalMapNumbers*/ ctx[1][5])) {
				input5.value = input5_value_value;
			}

			if (!current || dirty[0] & /*curves*/ 16) {
				(0,internal/* select_option */.oW)(select, /*curves*/ ctx[4]);
			}

			if (!current || dirty[0] & /*smooth*/ 4) {
				input6.checked = /*smooth*/ ctx[2];
			}

			if (!current || dirty[0] & /*inverted*/ 8) {
				input7.checked = /*inverted*/ ctx[3];
			}

			const verticalprogress_changes = {};
			if (dirty[0] & /*progress*/ 1) verticalprogress_changes.progress = /*progress*/ ctx[0];
			verticalprogress.$set(verticalprogress_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(d3pedalmap_throttle.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(verticalprogress.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(d3pedalmap_throttle.$$.fragment, local);
			(0,internal/* transition_out */.et)(verticalprogress.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div12);
			(0,internal/* destroy_component */.vp)(d3pedalmap_throttle);
			(0,internal/* destroy_component */.vp)(verticalprogress);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Pedalmap_throttle_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let pedalMap = (0,svelte/* getContext */.fw)("WSC-pedalMap");
	let invertedMap = (0,svelte/* getContext */.fw)("WSC-invertedMap");
	let smoothMap = (0,svelte/* getContext */.fw)("WSC-smoothMap");
	let progress = 0;
	let pedalMapNumbers = [0, 20, 40, 60, 80, 100];
	let smooth = false;
	let inverted = false;

	const updateContext = e => {
		$$invalidate(1, pedalMapNumbers[e.target.name] = parseInt(e.target.value), pedalMapNumbers);

		pedalMap.update(existing => {
			return {
				...existing,
				...{ throttleMap: pedalMapNumbers }
			};
		});
	};

	const checkIfMatchCurveList = throttleMap => {
		const curve = JSON.stringify(throttleMap);

		if (curve === JSON.stringify(linearMap)) {
			return "linearMap";
		}

		if (curve === JSON.stringify(slowCurveMap)) {
			return "slowCurveMap";
		}

		if (curve === JSON.stringify(verySlowCurveMap)) {
			return "verySlowCurveMap";
		}

		if (curve === JSON.stringify(fastCurveMap)) {
			return "fastCurveMap";
		}

		if (curve === JSON.stringify(veryFastCurveMap)) {
			return "veryFastCurveMap";
		}

		if (curve === JSON.stringify(sCurveFastSlowMap)) {
			return "sCurveFastSlowMap";
		}

		if (curve === JSON.stringify(sCurveSlowFastMap)) {
			return "sCurveSlowFastMap";
		}

		return "";
	};

	const updateSmooth = e => {
		smoothMap.update(existing => {
			return {
				...existing,
				...{
					throttleSmooth: e.target.checked ? "1" : "0"
				}
			};
		});
	};

	const updateInverted = e => {
		invertedMap.update(existing => {
			return {
				...existing,
				...{
					throttleInverted: e.target.checked ? "1" : "0"
				}
			};
		});
	};

	const updateMapNumbers = e => {
		const selectedCurve = getMatchingCurve(e.target.value);

		pedalMap.update(existing => {
			return {
				...existing,
				...{ throttleMap: selectedCurve }
			};
		});
	};

	const getMatchingCurve = selectedValue => {
		if (selectedValue === "linearMap") {
			return linearMap.concat();
		}

		if (selectedValue === "slowCurveMap") {
			return slowCurveMap.concat();
		}

		if (selectedValue === "verySlowCurveMap") {
			return verySlowCurveMap.concat();
		}

		if (selectedValue === "fastCurveMap") {
			return fastCurveMap.concat();
		}

		if (selectedValue === "veryFastCurveMap") {
			return veryFastCurveMap.concat();
		}

		if (selectedValue === "sCurveFastSlowMap") {
			return sCurveFastSlowMap.concat();
		}

		if (selectedValue === "sCurveSlowFastMap") {
			return sCurveSlowFastMap.concat();
		}
	};

	let curves = "linearMap";
	const linearMap = [0, 20, 40, 60, 80, 100];
	const slowCurveMap = [0, 9, 21, 39, 63, 100];
	const verySlowCurveMap = [0, 4, 11, 25, 48, 100];
	const fastCurveMap = [0, 37, 61, 79, 91, 100];
	const veryFastCurveMap = [0, 52, 75, 89, 96, 100];
	const sCurveFastSlowMap = [0, 60, 75, 80, 85, 100];
	const sCurveSlowFastMap = [0, 31, 46, 54, 69, 100];

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			$$invalidate(0, progress = msg.throttle.after || 0);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	smoothMap.subscribe(value => {
		if (value) {
			$$invalidate(2, smooth = value.throttleSmooth === "1");
		}
	});

	invertedMap.subscribe(value => {
		if (value) {
			$$invalidate(3, inverted = value.throttleInverted === "1");
		}
	});

	pedalMap.subscribe(value => {
		if (JSON.stringify(value) !== "{}") {
			const { throttleMap } = value;
			$$invalidate(1, pedalMapNumbers = throttleMap);
			$$invalidate(4, curves = checkIfMatchCurveList(throttleMap));
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	const input_handler = e => updateContext(e);
	const input_handler_1 = e => updateContext(e);
	const input_handler_2 = e => updateContext(e);
	const input_handler_3 = e => updateContext(e);
	const input_handler_4 = e => updateContext(e);
	const input_handler_5 = e => updateContext(e);
	const input_handler_6 = e => updateMapNumbers(e);
	const input_handler_7 = e => updateSmooth(e);
	const input_handler_8 = e => updateInverted(e);

	return [
		progress,
		pedalMapNumbers,
		smooth,
		inverted,
		curves,
		updateContext,
		updateSmooth,
		updateInverted,
		updateMapNumbers,
		input_handler,
		input_handler_1,
		input_handler_2,
		input_handler_3,
		input_handler_4,
		input_handler_5,
		input_handler_6,
		input_handler_7,
		input_handler_8
	];
}

class Pedalmap_throttle extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Pedalmap_throttle_svelte_instance, Pedalmap_throttle_svelte_create_fragment, internal/* safe_not_equal */.N8, {}, [-1, -1]);
	}
}

/* harmony default export */ const Pedalmap_throttle_svelte = (Pedalmap_throttle);
// EXTERNAL MODULE: ../../.yarn/cache/chart.js-npm-3.4.1-1b76a8cb66-8b14b108fb.zip/node_modules/chart.js/auto/auto.esm.js + 2 modules
var auto_esm = __webpack_require__(742);
;// CONCATENATED MODULE: ./src/Pedals/Components/Timeline/Timeline.svelte
/* src\Pedals\Components\Timeline\Timeline.svelte generated by Svelte v3.38.3 */





function Timeline_svelte_create_fragment(ctx) {
	let div;
	let canvas;

	return {
		c() {
			div = (0,internal/* element */.bG)("div");
			canvas = (0,internal/* element */.bG)("canvas");
			(0,internal/* attr */.Lj)(canvas, "height", "150");
			(0,internal/* set_style */.cz)(div, "width", "850px");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, canvas);
			/*canvas_binding*/ ctx[1](canvas);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div);
			/*canvas_binding*/ ctx[1](null);
		}
	};
}

function Timeline_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let chartContainer = null; //ref
	let chartInstance = null;

	const chartOption = {
		showLines: true,
		animation: false,
		// responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { labels: { pointStyle: "circle" } }
		},
		elements: { point: { radius: 0 } },
		scales: {
			x: {
				display: false,
				ticks: { stepSize: 1, fixedStepSize: 1 }
			},
			y: {
				display: true,
				min: 0,
				max: 100,
				ticks: {
					stepSize: 10,
					fixedStepSize: 1,
					suggestedMin: 0,
					suggestedMax: 100
				}
			}
		}
	};

	const chartData = {
		labels: [""],
		datasets: [
			{
				label: "throttle",
				fill: false,
				data: [0],
				borderWidth: 1,
				borderColor: "red"
			},
			{
				label: "brake",
				fill: false,
				data: [0],
				borderWidth: 1,
				borderColor: "blue"
			},
			{
				label: "clutch",
				fill: false,
				data: [0],
				borderWidth: 1,
				borderColor: "green"
			}
		]
	};

	(0,svelte/* onMount */.H3)(() => {
		const newChartInstance = new auto_esm/* default */.Z(chartContainer.getContext("2d"),
		{
				type: "line",
				data: chartData,
				options: chartOption
			});

		chartInstance = newChartInstance;
	});

	function adddata({ throttle, brake, clutch }) {
		if (chartInstance.data.labels.length > 30) {
			chartInstance.data.labels.splice(0, 1);
		}

		chartInstance.data.labels.push("");

		if (chartInstance.data.datasets[0].data.length > 30) {
			chartInstance.data.datasets[0].data.splice(0, 1);
		}

		chartInstance.data.datasets[0].data.push(throttle);

		if (chartInstance.data.datasets[1].data.length > 30) {
			chartInstance.data.datasets[1].data.splice(0, 1);
		}

		chartInstance.data.datasets[1].data.push(brake);

		if (chartInstance.data.datasets[2].data.length > 30) {
			chartInstance.data.datasets[2].data.splice(0, 1);
		}

		chartInstance.data.datasets[2].data.push(clutch);
		chartInstance.update();
	}

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			adddata({
				throttle: { x: "", y: msg.throttle.after },
				brake: { x: "", y: msg.brake.after },
				clutch: { x: "", y: msg.clutch.after }
			});
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		chartInstance.destroy();
		chartInstance.stop();
		unsubscribeMessage.unsubscribe();
	});

	function canvas_binding($$value) {
		internal/* binding_callbacks */.Vn[$$value ? "unshift" : "push"](() => {
			chartContainer = $$value;
			$$invalidate(0, chartContainer);
		});
	}

	return [chartContainer, canvas_binding];
}

class Timeline extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Timeline_svelte_instance, Timeline_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Timeline_svelte = (Timeline);
;// CONCATENATED MODULE: ./src/Buttons/SaveToArduino.svelte
/* src\Buttons\SaveToArduino.svelte generated by Svelte v3.38.3 */




function SaveToArduino_svelte_create_fragment(ctx) {
	let button;
	let t;
	let button_disabled_value;
	let mounted;
	let dispose;

	return {
		c() {
			button = (0,internal/* element */.bG)("button");
			t = (0,internal/* text */.fL)("save to arduino");
			button.disabled = button_disabled_value = !/*$connected*/ ctx[0];
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, button, anchor);
			(0,internal/* append */.R3)(button, t);

			if (!mounted) {
				dispose = (0,internal/* listen */.oL)(button, "click", /*saveToArduino*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*$connected*/ 1 && button_disabled_value !== (button_disabled_value = !/*$connected*/ ctx[0])) {
				button.disabled = button_disabled_value;
			}
		},
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(button);
			mounted = false;
			dispose();
		}
	};
}

function SaveToArduino_svelte_instance($$self, $$props, $$invalidate) {
	let $connected;
	let connected = (0,svelte/* getContext */.fw)("WSC-connected");
	(0,internal/* component_subscribe */.FI)($$self, connected, value => $$invalidate(0, $connected = value));
	let { connect, disconnect, write } = (0,svelte/* getContext */.fw)("WSC-actions");
	let pedalMapSerial = (0,svelte/* getContext */.fw)("WSC-pedalMapSerial");
	let pedalMap = "";
	let calibrationMapSerial = (0,svelte/* getContext */.fw)("WSC-calibrationMapSerial");
	let calibrationMap = "";
	let invertedMapSerial = (0,svelte/* getContext */.fw)("WSC-invertedMapSerial");
	let invertedMap = "";
	let smoothMapSerial = (0,svelte/* getContext */.fw)("WSC-smoothMapSerial");
	let smoothMap = "";
	let bitsMapSerial = (0,svelte/* getContext */.fw)("WSC-bitsMapSerial");
	let bitsMap = "";

	const handleConnect = () => {
		connect();
	};

	const handleDisconnect = () => {
		disconnect();
	};

	pedalMapSerial.subscribe(value => {
		pedalMap = value;
	});

	calibrationMapSerial.subscribe(value => {
		calibrationMap = value;
	});

	invertedMapSerial.subscribe(value => {
		invertedMap = value;
	});

	smoothMapSerial.subscribe(value => {
		smoothMap = value;
	});

	bitsMapSerial.subscribe(value => {
		bitsMap = value;
	});

	const saveToArduino = () => {
		write(pedalMap.split(",")[0]); //tmap
		write(pedalMap.split(",")[1]); //bmap
		write(pedalMap.split(",")[2]); //cmap
		write(calibrationMap); //tcali + bcali + ccali
		write(invertedMap);
		write(smoothMap);
		write(bitsMap);
	};

	return [$connected, connected, saveToArduino];
}

class SaveToArduino extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, SaveToArduino_svelte_instance, SaveToArduino_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const SaveToArduino_svelte = (SaveToArduino);
;// CONCATENATED MODULE: ./src/Pedals/Pedals.svelte
/* src\Pedals\Pedals.svelte generated by Svelte v3.38.3 */









function Pedals_svelte_create_fragment(ctx) {
	let div0;
	let pedalmap_clutch;
	let t0;
	let pedalmap_brake;
	let t1;
	let pedalmap_throttle;
	let t2;
	let div1;
	let timeline;
	let t3;
	let div2;
	let savetoarduino;
	let t4;
	let button;
	let current;
	let mounted;
	let dispose;
	pedalmap_clutch = new Pedalmap_clutch_svelte({});
	pedalmap_brake = new Pedalmap_brake_svelte({});
	pedalmap_throttle = new Pedalmap_throttle_svelte({});
	timeline = new Timeline_svelte({});
	savetoarduino = new SaveToArduino_svelte({});

	return {
		c() {
			div0 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(pedalmap_clutch.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(pedalmap_brake.$$.fragment);
			t1 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(pedalmap_throttle.$$.fragment);
			t2 = (0,internal/* space */.Dh)();
			div1 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(timeline.$$.fragment);
			t3 = (0,internal/* space */.Dh)();
			div2 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(savetoarduino.$$.fragment);
			t4 = (0,internal/* space */.Dh)();
			button = (0,internal/* element */.bG)("button");
			button.textContent = "get old maps";
			(0,internal/* set_style */.cz)(div0, "display", "flex");
			(0,internal/* set_style */.cz)(div0, "flex-wrap", "wrap");
			(0,internal/* set_style */.cz)(div0, "justify-content", "center");
			(0,internal/* set_style */.cz)(div0, "align-items", "stretch");
			(0,internal/* set_style */.cz)(div1, "display", "flex");
			(0,internal/* set_style */.cz)(div1, "flex-wrap", "wrap");
			(0,internal/* set_style */.cz)(div1, "justify-content", "center");
			(0,internal/* set_style */.cz)(div1, "align-items", "stretch");
			(0,internal/* set_style */.cz)(div2, "text-align", "center");
			(0,internal/* set_style */.cz)(div2, "padding", "10px");
			(0,internal/* set_style */.cz)(div2, "margin-top", "20px");
			(0,internal/* set_style */.cz)(div2, "background", "#eeeeee");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div0, anchor);
			(0,internal/* mount_component */.ye)(pedalmap_clutch, div0, null);
			(0,internal/* append */.R3)(div0, t0);
			(0,internal/* mount_component */.ye)(pedalmap_brake, div0, null);
			(0,internal/* append */.R3)(div0, t1);
			(0,internal/* mount_component */.ye)(pedalmap_throttle, div0, null);
			(0,internal/* insert */.$T)(target, t2, anchor);
			(0,internal/* insert */.$T)(target, div1, anchor);
			(0,internal/* mount_component */.ye)(timeline, div1, null);
			(0,internal/* insert */.$T)(target, t3, anchor);
			(0,internal/* insert */.$T)(target, div2, anchor);
			(0,internal/* mount_component */.ye)(savetoarduino, div2, null);
			(0,internal/* append */.R3)(div2, t4);
			(0,internal/* append */.R3)(div2, button);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.oL)(button, "click", /*oldMaps*/ ctx[0]);
				mounted = true;
			}
		},
		p: internal/* noop */.ZT,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(pedalmap_clutch.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(pedalmap_brake.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(pedalmap_throttle.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(timeline.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(savetoarduino.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(pedalmap_clutch.$$.fragment, local);
			(0,internal/* transition_out */.et)(pedalmap_brake.$$.fragment, local);
			(0,internal/* transition_out */.et)(pedalmap_throttle.$$.fragment, local);
			(0,internal/* transition_out */.et)(timeline.$$.fragment, local);
			(0,internal/* transition_out */.et)(savetoarduino.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div0);
			(0,internal/* destroy_component */.vp)(pedalmap_clutch);
			(0,internal/* destroy_component */.vp)(pedalmap_brake);
			(0,internal/* destroy_component */.vp)(pedalmap_throttle);
			if (detaching) (0,internal/* detach */.og)(t2);
			if (detaching) (0,internal/* detach */.og)(div1);
			(0,internal/* destroy_component */.vp)(timeline);
			if (detaching) (0,internal/* detach */.og)(t3);
			if (detaching) (0,internal/* detach */.og)(div2);
			(0,internal/* destroy_component */.vp)(savetoarduino);
			mounted = false;
			dispose();
		}
	};
}

function Pedals_svelte_instance($$self) {
	let { connect, disconnect, write } = (0,svelte/* getContext */.fw)("WSC-actions");

	const oldMaps = () => {
		write("GetMap"); //get GetMap values
	};

	return [oldMaps];
}

class Pedals extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Pedals_svelte_instance, Pedals_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Pedals_svelte = (Pedals);
;// CONCATENATED MODULE: ./src/Calibration/Components/D3BulletGraph/BulletGraph.js
 // Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/

src.bullet = function () {
  var orient = "left",
      // TODO top & bottom
  reverse = false,
      duration = 0,
      markers = bulletMarkers,
      measures = bulletMeasures,
      width = 380,
      height = 30,
      tickFormat = null,
      ticks = 10; // For each small multiple…

  function bullet(g) {
    g.each(function (d, i) {
      var //        markerz = markers.call(this, d, i).slice().sort(d3.descending),
      markerz = markers.call(this, d, i),
          measurez = measures.call(this, d, i).slice().sort(src/* descending */.$1i),
          g = src/* select */.Ys(this); // Compute the new x-scale.

      var x1 = src/* scaleLinear */.BYU().domain([0, Math.max(markerz[0], measurez[0])]).range(reverse ? [width, 0] : [0, width]); // Retrieve the old x-scale, if this is an update.

      var x0 = this.__chart__ || src/* scaleLinear */.BYU().domain([0, Infinity]).range(x1.range()); // Stash the new scale.

      this.__chart__ = x1; // Derive width-scales from the x-scales.

      var w0 = bulletWidth(x0),
          w1 = bulletWidth(x1); // Update the measure rects.

      var measure = g.selectAll("rect.measure").data(measurez);
      measure.enter().append("rect").attr("class", function (d, i) {
        return "measure s" + i;
      }).attr("width", w0).attr("height", height / 3).attr("x", reverse ? x0 : 0).attr("y", height / 3).transition().duration(duration).attr("width", w1).attr("x", reverse ? x1 : 0);
      measure.transition().duration(duration).attr("width", w1).attr("height", height / 3).attr("x", reverse ? x1 : 0).attr("y", height / 3); // Update the marker lines.

      var marker = g.selectAll("line.marker").data(markerz);
      marker.enter().append("line").attr("class", function (d, index) {
        return "marker s" + index;
      }).attr("x1", x0).attr("x2", x0).attr("y1", height / 6).attr("y2", height * 5 / 6).transition().duration(duration).attr("x1", x1).attr("x2", x1);
      marker.transition().duration(duration).attr("x1", x1).attr("x2", x1).attr("y1", height / 6).attr("y2", height * 5 / 6); // Compute the tick format.

      var format = tickFormat || x1.tickFormat(8); // Update the tick groups.

      var tick = g.selectAll("g.tick").data(x1.ticks(ticks), function (d) {
        return this.textContent || format(d);
      }); // Initialize the ticks with the old scale, x0.

      var tickEnter = tick.enter().append("g").attr("class", "tick").attr("transform", bulletTranslate(x0)).style("opacity", 1e-6);
      tickEnter.append("line").attr("y1", height).attr("y2", height * 7 / 6);
      tickEnter.append("text").attr("text-anchor", "middle").attr("dy", "1em").attr("y", height * 7 / 6).text(format); // Transition the entering ticks to the new scale, x1.

      tickEnter.transition().duration(duration).attr("transform", bulletTranslate(x1)).style("opacity", 1); // Transition the updating ticks to the new scale, x1.

      var tickUpdate = tick.transition().duration(duration).attr("transform", bulletTranslate(x1)).style("opacity", 1);
      tickUpdate.select("line").attr("y1", height).attr("y2", height * 7 / 6);
      tickUpdate.select("text").attr("y", height * 7 / 6); // Transition the exiting ticks to the new scale, x1.

      tick.exit().transition().duration(duration).attr("transform", bulletTranslate(x1)).style("opacity", 1e-6).remove();
    });
    src/* timerFlush */.R8X();
  } // left, right, top, bottom


  bullet.orient = function (x) {
    if (!arguments.length) return orient;
    orient = x;
    reverse = orient == "right" || orient == "bottom";
    return bullet;
  }; // markers (previous, goal)


  bullet.markers = function (x) {
    if (!arguments.length) return markers;
    markers = x;
    return bullet;
  }; // measures (actual, forecast)


  bullet.measures = function (x) {
    if (!arguments.length) return measures;
    measures = x;
    return bullet;
  };

  bullet.width = function (x) {
    if (!arguments.length) return width;
    width = x;
    return bullet;
  };

  bullet.height = function (x) {
    if (!arguments.length) return height;
    height = x;
    return bullet;
  };

  bullet.tickFormat = function (x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bullet;
  };

  bullet.ticks = function (x) {
    if (!arguments.length) return ticks;
    ticks = x;
    return bullet;
  };

  bullet.duration = function (x) {
    if (!arguments.length) return duration;
    duration = x;
    return bullet;
  };

  return bullet;
};

function bulletMarkers(d) {
  return d.markers;
}

function bulletMeasures(d) {
  return d.measures;
}

function bulletTranslate(x) {
  return function (d) {
    return "translate(" + x(d) + ",0)";
  };
}

function bulletWidth(x) {
  var x0 = x(0);
  return function (d) {
    return Math.abs(x(d) - x0);
  };
}
;// CONCATENATED MODULE: ./src/Calibration/Components/D3BulletGraph/D3BulletGraph_clutch_hid.svelte
/* src\Calibration\Components\D3BulletGraph\D3BulletGraph_clutch_hid.svelte generated by Svelte v3.38.3 */






function D3BulletGraph_clutch_hid_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-vxw4wy-style";
	style.textContent = ".svelte-vxw4wy .bullet .marker{stroke:#000;stroke-width:2px}.svelte-vxw4wy .bullet .tick line{stroke:#666;stroke-width:0.5px}.svelte-vxw4wy .bullet .measure.s0{fill:lightsteelblue}.svelte-vxw4wy .bullet .measure.s1{fill:steelblue}.svelte-vxw4wy .bullet .marker.s0{opacity:0}.svelte-vxw4wy .bullet .marker.s1{opacity:0}.svelte-vxw4wy .bullet .marker.s2{opacity:0}.svelte-vxw4wy .bullet .marker.s3{opacity:0}.svelte-vxw4wy .bullet .title{font-weight:bold}.svelte-vxw4wy .bullet .subtitle{fill:#999}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3BulletGraph_clutch_hid_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="bullet_chart_clutch_hid" class="svelte-vxw4wy"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-vxw4wy");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

function D3BulletGraph_clutch_hid_svelte_instance($$self, $$props, $$invalidate) {
	let $bitsMap;
	let $calibrationMap;
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	(0,internal/* component_subscribe */.FI)($$self, calibrationMap, value => $$invalidate(4, $calibrationMap = value));
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	(0,internal/* component_subscribe */.FI)($$self, bitsMap, value => $$invalidate(3, $bitsMap = value));

	/////////////////////////
	var margin = { top: 5, right: 40, bottom: 30, left: 40 },
		width = 875 - margin.left - margin.right,
		height = 75 - margin.top - margin.bottom;

	var svg;

	var data = [
		{
			title: "0",
			subtitle: "",
			measures: [0, 1023],
			markers: [0]
		}
	];

	(0,svelte/* onMount */.H3)(() => {
		var chart = src.bullet().width(width).height(height).ticks(10);
		svg = src/* select */.Ys("#bullet_chart_clutch_hid").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(chart);
		var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text").attr("class", "title").text(function (d) {
			return d.title;
		});

		title.append("text").attr("class", "subtitle").attr("dy", "1em").text(function (d) {
			return d.subtitle;
		});
	});

	const update = msg => {
		// var measure = d3.select(".bullet g").selectAll(".measure").data();
		// var markers = d3.select(".bullet g").selectAll(".marker").data();
		// var data = d3.select(".bullet g").selectAll(".title").data();
		if ($bitsMap && $bitsMap.clutchBits && $calibrationMap && $calibrationMap.clutchCalibration) {
			var select = src/* select */.Ys("#bullet_chart_clutch_hid .bullet g");
			select.selectAll(".title").text(() => msg.clutch.hid);
			const measures1 = width / +$bitsMap.clutchBits[1] * msg.clutch.hid;
			select.selectAll(".measure.s1").attr("width", measures1);
		}
	};

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	return [calibrationMap, bitsMap];
}

class D3BulletGraph_clutch_hid extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-vxw4wy-style")) D3BulletGraph_clutch_hid_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3BulletGraph_clutch_hid_svelte_instance, D3BulletGraph_clutch_hid_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3BulletGraph_clutch_hid_svelte = (D3BulletGraph_clutch_hid);
;// CONCATENATED MODULE: ./src/Calibration/Components/D3BulletGraph/D3BulletGraph_clutch_raw.svelte
/* src\Calibration\Components\D3BulletGraph\D3BulletGraph_clutch_raw.svelte generated by Svelte v3.38.3 */






function D3BulletGraph_clutch_raw_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-k336j4-style";
	style.textContent = ".svelte-k336j4 .bullet .marker{stroke:#000;stroke-width:2px}.svelte-k336j4 .bullet .tick line{stroke:#666;stroke-width:0.5px}.svelte-k336j4 .bullet .measure.s0{fill:lightsteelblue}.svelte-k336j4 .bullet .measure.s1{fill:steelblue}.svelte-k336j4 .bullet .marker.s0{stroke:blue}.svelte-k336j4 .bullet .marker.s1{stroke:red}.svelte-k336j4 .bullet .marker.s2{stroke:green}.svelte-k336j4 .bullet .marker.s3{stroke:orange}.svelte-k336j4 .bullet .title{font-weight:bold}.svelte-k336j4 .bullet .subtitle{fill:#999}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3BulletGraph_clutch_raw_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="bullet_chart_clutch_raw" class="svelte-k336j4"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-k336j4");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

function D3BulletGraph_clutch_raw_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	let calibrationMapNumbers = null;
	let bitsMapNumbers = null;

	/////////////////////////
	var margin = { top: 5, right: 40, bottom: 30, left: 40 },
		width = 875 - margin.left - margin.right,
		height = 75 - margin.top - margin.bottom;

	var svg;

	var data = [
		{
			title: "0",
			subtitle: "",
			measures: [0, 1023],
			markers: [0, 0, 0, 0]
		}
	];

	(0,svelte/* onMount */.H3)(() => {
		var chart = src.bullet().width(width).height(height).ticks(10);
		svg = src/* select */.Ys("#bullet_chart_clutch_raw").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(chart);
		var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text").attr("class", "title").text(function (d) {
			return d.title;
		});

		title.append("text").attr("class", "subtitle").attr("dy", "1em").text(function (d) {
			return d.subtitle;
		});

		updateGraph();
	});

	const update = msg => {
		if (bitsMapNumbers && calibrationMapNumbers) {
			var select = src/* select */.Ys("#bullet_chart_clutch_raw .bullet g");
			select.selectAll(".title").text(() => msg.clutch.raw);
			const measures1 = width / +bitsMapNumbers[0] * msg.clutch.raw;
			select.selectAll(".measure.s1").attr("width", measures1);
		}
	};

	const updateGraph = () => {
		if (bitsMapNumbers && calibrationMapNumbers) {
			var select = src/* select */.Ys("#bullet_chart_clutch_raw .bullet g");
			const markers0 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[0];
			select.selectAll(".marker.s0").attr("x1", markers0).attr("x2", markers0);
			const markers1 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[1];
			select.selectAll(".marker.s1").attr("x1", markers1).attr("x2", markers1);
			const markers2 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[2];
			select.selectAll(".marker.s2").attr("x1", markers2).attr("x2", markers2);
			const markers3 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[3];
			select.selectAll(".marker.s3").attr("x1", markers3).attr("x2", markers3);
		}
	};

	calibrationMap.subscribe(value => {
		const { clutchCalibration } = value;
		$$invalidate(0, calibrationMapNumbers = clutchCalibration);
	});

	bitsMap.subscribe(value => {
		const { clutchBits } = value;
		$$invalidate(1, bitsMapNumbers = clutchBits);
	});

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*bitsMapNumbers, calibrationMapNumbers*/ 3) {
			//reactive to subscriptions
			$: (bitsMapNumbers, calibrationMapNumbers, updateGraph());
		}
	};

	return [calibrationMapNumbers, bitsMapNumbers];
}

class D3BulletGraph_clutch_raw extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-k336j4-style")) D3BulletGraph_clutch_raw_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3BulletGraph_clutch_raw_svelte_instance, D3BulletGraph_clutch_raw_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3BulletGraph_clutch_raw_svelte = (D3BulletGraph_clutch_raw);
;// CONCATENATED MODULE: ./src/Calibration/Components/D3BulletGraph/D3BulletGraph_brake_hid.svelte
/* src\Calibration\Components\D3BulletGraph\D3BulletGraph_brake_hid.svelte generated by Svelte v3.38.3 */






function D3BulletGraph_brake_hid_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-vxw4wy-style";
	style.textContent = ".svelte-vxw4wy .bullet .marker{stroke:#000;stroke-width:2px}.svelte-vxw4wy .bullet .tick line{stroke:#666;stroke-width:0.5px}.svelte-vxw4wy .bullet .measure.s0{fill:lightsteelblue}.svelte-vxw4wy .bullet .measure.s1{fill:steelblue}.svelte-vxw4wy .bullet .marker.s0{opacity:0}.svelte-vxw4wy .bullet .marker.s1{opacity:0}.svelte-vxw4wy .bullet .marker.s2{opacity:0}.svelte-vxw4wy .bullet .marker.s3{opacity:0}.svelte-vxw4wy .bullet .title{font-weight:bold}.svelte-vxw4wy .bullet .subtitle{fill:#999}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3BulletGraph_brake_hid_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="bullet_chart_brake_hid" class="svelte-vxw4wy"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-vxw4wy");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

function D3BulletGraph_brake_hid_svelte_instance($$self, $$props, $$invalidate) {
	let $bitsMap;
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	(0,internal/* component_subscribe */.FI)($$self, bitsMap, value => $$invalidate(2, $bitsMap = value));

	/////////////////////////
	var margin = { top: 5, right: 40, bottom: 30, left: 40 },
		width = 875 - margin.left - margin.right,
		height = 75 - margin.top - margin.bottom;

	var svg;

	var data = [
		{
			title: "0",
			subtitle: "",
			measures: [0, 1023],
			markers: [0]
		}
	];

	(0,svelte/* onMount */.H3)(() => {
		var chart = src.bullet().width(width).height(height).ticks(10);
		svg = src/* select */.Ys("#bullet_chart_brake_hid").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(chart);
		var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text").attr("class", "title").text(function (d) {
			return d.title;
		});

		title.append("text").attr("class", "subtitle").attr("dy", "1em").text(function (d) {
			return d.subtitle;
		});
	});

	const update = msg => {
		if ($bitsMap && $bitsMap.brakeBits) {
			var select = src/* select */.Ys("#bullet_chart_brake_hid .bullet g");
			select.selectAll(".title").text(() => msg.brake.hid);
			const measures1 = width / +$bitsMap.brakeBits[1] * msg.brake.hid;
			select.selectAll(".measure.s1").attr("width", measures1);
		}
	};

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	return [bitsMap];
}

class D3BulletGraph_brake_hid extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-vxw4wy-style")) D3BulletGraph_brake_hid_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3BulletGraph_brake_hid_svelte_instance, D3BulletGraph_brake_hid_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3BulletGraph_brake_hid_svelte = (D3BulletGraph_brake_hid);
;// CONCATENATED MODULE: ./src/Calibration/Components/D3BulletGraph/D3BulletGraph_brake_raw.svelte
/* src\Calibration\Components\D3BulletGraph\D3BulletGraph_brake_raw.svelte generated by Svelte v3.38.3 */






function D3BulletGraph_brake_raw_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-k336j4-style";
	style.textContent = ".svelte-k336j4 .bullet .marker{stroke:#000;stroke-width:2px}.svelte-k336j4 .bullet .tick line{stroke:#666;stroke-width:0.5px}.svelte-k336j4 .bullet .measure.s0{fill:lightsteelblue}.svelte-k336j4 .bullet .measure.s1{fill:steelblue}.svelte-k336j4 .bullet .marker.s0{stroke:blue}.svelte-k336j4 .bullet .marker.s1{stroke:red}.svelte-k336j4 .bullet .marker.s2{stroke:green}.svelte-k336j4 .bullet .marker.s3{stroke:orange}.svelte-k336j4 .bullet .title{font-weight:bold}.svelte-k336j4 .bullet .subtitle{fill:#999}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3BulletGraph_brake_raw_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="bullet_chart_brake_raw" class="svelte-k336j4"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-k336j4");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

function D3BulletGraph_brake_raw_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	let calibrationMapNumbers = null;
	let bitsMapNumbers = null;

	/////////////////////////
	var margin = { top: 5, right: 40, bottom: 30, left: 40 },
		width = 875 - margin.left - margin.right,
		height = 75 - margin.top - margin.bottom;

	var svg;

	var data = [
		{
			title: "0",
			subtitle: "",
			measures: [0, 1023],
			markers: [0, 0, 0, 0]
		}
	];

	(0,svelte/* onMount */.H3)(() => {
		var chart = src.bullet().width(width).height(height).ticks(10);
		svg = src/* select */.Ys("#bullet_chart_brake_raw").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(chart);
		var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text").attr("class", "title").text(function (d) {
			return d.title;
		});

		title.append("text").attr("class", "subtitle").attr("dy", "1em").text(function (d) {
			return d.subtitle;
		});

		updateGraph();
	});

	const update = msg => {
		if (bitsMapNumbers && calibrationMapNumbers) {
			var select = src/* select */.Ys("#bullet_chart_brake_raw .bullet g");
			select.selectAll(".title").text(() => msg.brake.raw);
			const measures1 = width / +bitsMapNumbers[0] * msg.brake.raw;
			select.selectAll(".measure.s1").attr("width", measures1);
		}
	};

	const updateGraph = () => {
		if (bitsMapNumbers && calibrationMapNumbers) {
			var select = src/* select */.Ys("#bullet_chart_brake_raw .bullet g");
			const markers0 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[0];
			select.selectAll(".marker.s0").attr("x1", markers0).attr("x2", markers0);
			const markers1 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[1];
			select.selectAll(".marker.s1").attr("x1", markers1).attr("x2", markers1);
			const markers2 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[2];
			select.selectAll(".marker.s2").attr("x1", markers2).attr("x2", markers2);
			const markers3 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[3];
			select.selectAll(".marker.s3").attr("x1", markers3).attr("x2", markers3);
		}
	};

	calibrationMap.subscribe(value => {
		const { brakeCalibration } = value;
		$$invalidate(0, calibrationMapNumbers = brakeCalibration);
	});

	bitsMap.subscribe(value => {
		const { brakeBits } = value;
		$$invalidate(1, bitsMapNumbers = brakeBits);
	});

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*bitsMapNumbers, calibrationMapNumbers*/ 3) {
			//reactive to subscriptions
			$: (bitsMapNumbers, calibrationMapNumbers, updateGraph());
		}
	};

	return [calibrationMapNumbers, bitsMapNumbers];
}

class D3BulletGraph_brake_raw extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-k336j4-style")) D3BulletGraph_brake_raw_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3BulletGraph_brake_raw_svelte_instance, D3BulletGraph_brake_raw_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3BulletGraph_brake_raw_svelte = (D3BulletGraph_brake_raw);
;// CONCATENATED MODULE: ./src/Calibration/Components/D3BulletGraph/D3BulletGraph_throttle_hid.svelte
/* src\Calibration\Components\D3BulletGraph\D3BulletGraph_throttle_hid.svelte generated by Svelte v3.38.3 */






function D3BulletGraph_throttle_hid_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-vxw4wy-style";
	style.textContent = ".svelte-vxw4wy .bullet .marker{stroke:#000;stroke-width:2px}.svelte-vxw4wy .bullet .tick line{stroke:#666;stroke-width:0.5px}.svelte-vxw4wy .bullet .measure.s0{fill:lightsteelblue}.svelte-vxw4wy .bullet .measure.s1{fill:steelblue}.svelte-vxw4wy .bullet .marker.s0{opacity:0}.svelte-vxw4wy .bullet .marker.s1{opacity:0}.svelte-vxw4wy .bullet .marker.s2{opacity:0}.svelte-vxw4wy .bullet .marker.s3{opacity:0}.svelte-vxw4wy .bullet .title{font-weight:bold}.svelte-vxw4wy .bullet .subtitle{fill:#999}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3BulletGraph_throttle_hid_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="bullet_chart_throttle_hid" class="svelte-vxw4wy"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-vxw4wy");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

function D3BulletGraph_throttle_hid_svelte_instance($$self, $$props, $$invalidate) {
	let $bitsMap;
	let $calibrationMap;
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	(0,internal/* component_subscribe */.FI)($$self, calibrationMap, value => $$invalidate(4, $calibrationMap = value));
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	(0,internal/* component_subscribe */.FI)($$self, bitsMap, value => $$invalidate(3, $bitsMap = value));

	/////////////////////////
	var margin = { top: 5, right: 40, bottom: 30, left: 40 },
		width = 875 - margin.left - margin.right,
		height = 75 - margin.top - margin.bottom;

	var svg;

	var data = [
		{
			title: "0",
			subtitle: "",
			measures: [0, 1023],
			markers: [0]
		}
	];

	(0,svelte/* onMount */.H3)(() => {
		var chart = src.bullet().width(width).height(height).ticks(10);
		svg = src/* select */.Ys("#bullet_chart_throttle_hid").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(chart);
		var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text").attr("class", "title").text(function (d) {
			return d.title;
		});

		title.append("text").attr("class", "subtitle").attr("dy", "1em").text(function (d) {
			return d.subtitle;
		});
	});

	const update = msg => {
		// var measure = d3.select(".bullet g").selectAll(".measure").data();
		// var markers = d3.select(".bullet g").selectAll(".marker").data();
		// var data = d3.select(".bullet g").selectAll(".title").data();
		if ($bitsMap && $bitsMap.throttleBits && $calibrationMap && $calibrationMap.throttleCalibration) {
			var select = src/* select */.Ys("#bullet_chart_throttle_hid .bullet g");
			select.selectAll(".title").text(() => msg.throttle.hid);
			const measures1 = width / +$bitsMap.throttleBits[1] * msg.throttle.hid;
			select.selectAll(".measure.s1").attr("width", measures1);
		}
	};

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	return [calibrationMap, bitsMap];
}

class D3BulletGraph_throttle_hid extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-vxw4wy-style")) D3BulletGraph_throttle_hid_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3BulletGraph_throttle_hid_svelte_instance, D3BulletGraph_throttle_hid_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3BulletGraph_throttle_hid_svelte = (D3BulletGraph_throttle_hid);
;// CONCATENATED MODULE: ./src/Calibration/Components/D3BulletGraph/D3BulletGraph_throttle_raw.svelte
/* src\Calibration\Components\D3BulletGraph\D3BulletGraph_throttle_raw.svelte generated by Svelte v3.38.3 */






function D3BulletGraph_throttle_raw_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-k336j4-style";
	style.textContent = ".svelte-k336j4 .bullet .marker{stroke:#000;stroke-width:2px}.svelte-k336j4 .bullet .tick line{stroke:#666;stroke-width:0.5px}.svelte-k336j4 .bullet .measure.s0{fill:lightsteelblue}.svelte-k336j4 .bullet .measure.s1{fill:steelblue}.svelte-k336j4 .bullet .marker.s0{stroke:blue}.svelte-k336j4 .bullet .marker.s1{stroke:red}.svelte-k336j4 .bullet .marker.s2{stroke:green}.svelte-k336j4 .bullet .marker.s3{stroke:orange}.svelte-k336j4 .bullet .title{font-weight:bold}.svelte-k336j4 .bullet .subtitle{fill:#999}";
	(0,internal/* append */.R3)(document.head, style);
}

function D3BulletGraph_throttle_raw_svelte_create_fragment(ctx) {
	let div1;

	return {
		c() {
			div1 = (0,internal/* element */.bG)("div");
			div1.innerHTML = `<div id="bullet_chart_throttle_raw" class="svelte-k336j4"></div>`;
			(0,internal/* attr */.Lj)(div1, "class", "svelte-k336j4");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div1, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div1);
		}
	};
}

function D3BulletGraph_throttle_raw_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	let calibrationMapNumbers = null;
	let bitsMapNumbers = null;

	/////////////////////////
	var margin = { top: 5, right: 40, bottom: 30, left: 40 },
		width = 875 - margin.left - margin.right,
		height = 75 - margin.top - margin.bottom;

	var svg;

	var data = [
		{
			title: "0",
			subtitle: "",
			measures: [0, 1023],
			markers: [0, 0, 0, 0]
		}
	];

	(0,svelte/* onMount */.H3)(() => {
		var chart = src.bullet().width(width).height(height).ticks(10);
		svg = src/* select */.Ys("#bullet_chart_throttle_raw").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(chart);
		var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text").attr("class", "title").text(function (d) {
			return d.title;
		});

		title.append("text").attr("class", "subtitle").attr("dy", "1em").text(function (d) {
			return d.subtitle;
		});

		updateGraph();
	});

	const update = msg => {
		if (bitsMapNumbers && calibrationMapNumbers) {
			var select = src/* select */.Ys("#bullet_chart_throttle_raw .bullet g");
			select.selectAll(".title").text(() => msg.throttle.raw);
			const measures1 = width / +bitsMapNumbers[0] * msg.throttle.raw;
			select.selectAll(".measure.s1").attr("width", measures1);
		}
	};

	const updateGraph = () => {
		if (bitsMapNumbers && calibrationMapNumbers) {
			var select = src/* select */.Ys("#bullet_chart_throttle_raw .bullet g");
			const markers0 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[0];
			select.selectAll(".marker.s0").attr("x1", markers0).attr("x2", markers0);
			const markers1 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[1];
			select.selectAll(".marker.s1").attr("x1", markers1).attr("x2", markers1);
			const markers2 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[2];
			select.selectAll(".marker.s2").attr("x1", markers2).attr("x2", markers2);
			const markers3 = width / +bitsMapNumbers[0] * +calibrationMapNumbers[3];
			select.selectAll(".marker.s3").attr("x1", markers3).attr("x2", markers3);
		}
	};

	calibrationMap.subscribe(value => {
		const { throttleCalibration } = value;
		$$invalidate(0, calibrationMapNumbers = throttleCalibration);
	});

	bitsMap.subscribe(value => {
		const { throttleBits } = value;
		$$invalidate(1, bitsMapNumbers = throttleBits);
	});

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			update(msg);
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*bitsMapNumbers, calibrationMapNumbers*/ 3) {
			//reactive to subscriptions
			$: (bitsMapNumbers, calibrationMapNumbers, updateGraph());
		}
	};

	return [calibrationMapNumbers, bitsMapNumbers];
}

class D3BulletGraph_throttle_raw extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-k336j4-style")) D3BulletGraph_throttle_raw_svelte_add_css();
		(0,internal/* init */.S1)(this, options, D3BulletGraph_throttle_raw_svelte_instance, D3BulletGraph_throttle_raw_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const D3BulletGraph_throttle_raw_svelte = (D3BulletGraph_throttle_raw);
;// CONCATENATED MODULE: ./src/Calibration/Components/Calibration/CalibrationOverlay.svelte
/* src\Calibration\Components\Calibration\CalibrationOverlay.svelte generated by Svelte v3.38.3 */


function CalibrationOverlay_svelte_add_css() {
	var style = (0,internal/* element */.bG)("style");
	style.id = "svelte-fik9az-style";
	style.textContent = ".calibrationoverlay{position:absolute;top:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%;background:rgba(0, 0, 0, 0.5);z-index:999}.calibrationoverlay--content--container.svelte-fik9az{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;pointer-events:none}.calibrationoverlay--content--box.svelte-fik9az{max-width:100%;max-height:100%;pointer-events:auto;overflow-y:auto;background:#fff;min-width:760px}";
	(0,internal/* append */.R3)(document.head, style);
}

// (39:0) {#if show}
function CalibrationOverlay_svelte_create_if_block(ctx) {
	let div2;
	let div1;
	let div0;
	let current;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

	return {
		c() {
			div2 = (0,internal/* element */.bG)("div");
			div1 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			if (default_slot) default_slot.c();
			(0,internal/* attr */.Lj)(div0, "class", "calibrationoverlay--content--box svelte-fik9az");
			(0,internal/* attr */.Lj)(div1, "class", "calibrationoverlay--content--container svelte-fik9az");
			(0,internal/* attr */.Lj)(div2, "class", "calibrationoverlay");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div2, anchor);
			(0,internal/* append */.R3)(div2, div1);
			(0,internal/* append */.R3)(div1, div0);

			if (default_slot) {
				default_slot.m(div0, null);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], !current ? -1 : dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div2);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function CalibrationOverlay_svelte_create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*show*/ ctx[0] && CalibrationOverlay_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = (0,internal/* empty */.cS)();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.$T)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*show*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*show*/ 1) {
						(0,internal/* transition_in */.Ui)(if_block, 1);
					}
				} else {
					if_block = CalibrationOverlay_svelte_create_if_block(ctx);
					if_block.c();
					(0,internal/* transition_in */.Ui)(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.dv)();

				(0,internal/* transition_out */.et)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.gb)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) (0,internal/* detach */.og)(if_block_anchor);
		}
	};
}

function CalibrationOverlay_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { show } = $$props;

	$$self.$$set = $$props => {
		if ("show" in $$props) $$invalidate(0, show = $$props.show);
		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	return [show, $$scope, slots];
}

class CalibrationOverlay extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-fik9az-style")) CalibrationOverlay_svelte_add_css();
		(0,internal/* init */.S1)(this, options, CalibrationOverlay_svelte_instance, CalibrationOverlay_svelte_create_fragment, internal/* safe_not_equal */.N8, { show: 0 });
	}
}

/* harmony default export */ const CalibrationOverlay_svelte = (CalibrationOverlay);
;// CONCATENATED MODULE: ./src/Calibration/Components/Calibration/Calibration_clutch.svelte
/* src\Calibration\Components\Calibration\Calibration_clutch.svelte generated by Svelte v3.38.3 */





function create_default_slot(ctx) {
	let p0;
	let t1;
	let p1;
	let t3;
	let p2;
	let t5;
	let div;
	let button;
	let t7;
	let p3;
	let span0;
	let t8;
	let strong0;
	let t9_value = /*calibrationMapNumbers*/ ctx[1][0] + "";
	let t9;
	let t10;
	let span1;
	let t12;
	let span2;
	let t13;
	let strong1;
	let t14_value = /*calibrationMapNumbers*/ ctx[1][1] + "";
	let t14;
	let mounted;
	let dispose;

	return {
		c() {
			p0 = (0,internal/* element */.bG)("p");
			p0.textContent = "Step 1. Make sure the clutch is in neutral position.";
			t1 = (0,internal/* space */.Dh)();
			p1 = (0,internal/* element */.bG)("p");
			p1.textContent = "Step 2. Press the clutch all the way down and then release.";
			t3 = (0,internal/* space */.Dh)();
			p2 = (0,internal/* element */.bG)("p");
			p2.textContent = "Step 3. Press done to finish calibration.";
			t5 = (0,internal/* space */.Dh)();
			div = (0,internal/* element */.bG)("div");
			button = (0,internal/* element */.bG)("button");
			button.textContent = "done";
			t7 = (0,internal/* space */.Dh)();
			p3 = (0,internal/* element */.bG)("p");
			span0 = (0,internal/* element */.bG)("span");
			t8 = (0,internal/* text */.fL)("start ");
			strong0 = (0,internal/* element */.bG)("strong");
			t9 = (0,internal/* text */.fL)(t9_value);
			t10 = (0,internal/* space */.Dh)();
			span1 = (0,internal/* element */.bG)("span");
			span1.textContent = "|";
			t12 = (0,internal/* space */.Dh)();
			span2 = (0,internal/* element */.bG)("span");
			t13 = (0,internal/* text */.fL)("end ");
			strong1 = (0,internal/* element */.bG)("strong");
			t14 = (0,internal/* text */.fL)(t14_value);
			(0,internal/* set_style */.cz)(p0, "text-align", "center");
			(0,internal/* set_style */.cz)(p0, "font-size", "18px");
			(0,internal/* set_style */.cz)(p0, "margin", "5px");
			(0,internal/* set_style */.cz)(p1, "text-align", "center");
			(0,internal/* set_style */.cz)(p1, "font-size", "18px");
			(0,internal/* set_style */.cz)(p1, "margin", "5px");
			(0,internal/* set_style */.cz)(p2, "text-align", "center");
			(0,internal/* set_style */.cz)(p2, "font-size", "18px");
			(0,internal/* set_style */.cz)(p2, "margin", "5px");
			(0,internal/* set_style */.cz)(div, "text-align", "center");
			(0,internal/* set_style */.cz)(div, "font-size", "18px");
			(0,internal/* set_style */.cz)(p3, "text-align", "center");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, p0, anchor);
			(0,internal/* insert */.$T)(target, t1, anchor);
			(0,internal/* insert */.$T)(target, p1, anchor);
			(0,internal/* insert */.$T)(target, t3, anchor);
			(0,internal/* insert */.$T)(target, p2, anchor);
			(0,internal/* insert */.$T)(target, t5, anchor);
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, button);
			(0,internal/* insert */.$T)(target, t7, anchor);
			(0,internal/* insert */.$T)(target, p3, anchor);
			(0,internal/* append */.R3)(p3, span0);
			(0,internal/* append */.R3)(span0, t8);
			(0,internal/* append */.R3)(span0, strong0);
			(0,internal/* append */.R3)(strong0, t9);
			(0,internal/* append */.R3)(p3, t10);
			(0,internal/* append */.R3)(p3, span1);
			(0,internal/* append */.R3)(p3, t12);
			(0,internal/* append */.R3)(p3, span2);
			(0,internal/* append */.R3)(span2, t13);
			(0,internal/* append */.R3)(span2, strong1);
			(0,internal/* append */.R3)(strong1, t14);

			if (!mounted) {
				dispose = (0,internal/* listen */.oL)(button, "click", /*calibrateDone*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*calibrationMapNumbers*/ 2 && t9_value !== (t9_value = /*calibrationMapNumbers*/ ctx[1][0] + "")) (0,internal/* set_data */.rT)(t9, t9_value);
			if (dirty & /*calibrationMapNumbers*/ 2 && t14_value !== (t14_value = /*calibrationMapNumbers*/ ctx[1][1] + "")) (0,internal/* set_data */.rT)(t14, t14_value);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(p0);
			if (detaching) (0,internal/* detach */.og)(t1);
			if (detaching) (0,internal/* detach */.og)(p1);
			if (detaching) (0,internal/* detach */.og)(t3);
			if (detaching) (0,internal/* detach */.og)(p2);
			if (detaching) (0,internal/* detach */.og)(t5);
			if (detaching) (0,internal/* detach */.og)(div);
			if (detaching) (0,internal/* detach */.og)(t7);
			if (detaching) (0,internal/* detach */.og)(p3);
			mounted = false;
			dispose();
		}
	};
}

function Calibration_clutch_svelte_create_fragment(ctx) {
	let div3;
	let calibrationoverlay;
	let t0;
	let t1;
	let div2;
	let div0;
	let t2;
	let input0;
	let input0_value_value;
	let t3;
	let button;
	let t5;
	let div1;
	let t6;
	let input1;
	let input1_value_value;
	let current;
	let mounted;
	let dispose;

	calibrationoverlay = new CalibrationOverlay_svelte({
			props: {
				show: /*calibrationInProgress*/ ctx[0],
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

	return {
		c() {
			div3 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(calibrationoverlay.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			if (default_slot) default_slot.c();
			t1 = (0,internal/* space */.Dh)();
			div2 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			t2 = (0,internal/* text */.fL)("deadzone: start\r\n            ");
			input0 = (0,internal/* element */.bG)("input");
			t3 = (0,internal/* space */.Dh)();
			button = (0,internal/* element */.bG)("button");
			button.textContent = "calibrate";
			t5 = (0,internal/* space */.Dh)();
			div1 = (0,internal/* element */.bG)("div");
			t6 = (0,internal/* text */.fL)("deadzone: end\r\n            ");
			input1 = (0,internal/* element */.bG)("input");
			(0,internal/* attr */.Lj)(input0, "min", "0");
			(0,internal/* attr */.Lj)(input0, "max", "1023");
			(0,internal/* attr */.Lj)(input0, "type", "number");
			(0,internal/* attr */.Lj)(input0, "name", "2");
			input0.value = input0_value_value = /*calibrationMapNumbers*/ ctx[1][2];
			(0,internal/* set_style */.cz)(input0, "text-align", "left");
			(0,internal/* attr */.Lj)(input1, "min", "0");
			(0,internal/* attr */.Lj)(input1, "max", "1023");
			(0,internal/* attr */.Lj)(input1, "type", "number");
			(0,internal/* attr */.Lj)(input1, "name", "3");
			input1.value = input1_value_value = /*calibrationMapNumbers*/ ctx[1][3];
			(0,internal/* set_style */.cz)(input1, "text-align", "right");
			(0,internal/* set_style */.cz)(div2, "padding", "0px 25px 0px 35px");
			(0,internal/* set_style */.cz)(div2, "display", "flex");
			(0,internal/* set_style */.cz)(div2, "justify-content", "space-between");
			(0,internal/* set_style */.cz)(div3, "position", "relative");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div3, anchor);
			(0,internal/* mount_component */.ye)(calibrationoverlay, div3, null);
			(0,internal/* append */.R3)(div3, t0);

			if (default_slot) {
				default_slot.m(div3, null);
			}

			(0,internal/* append */.R3)(div3, t1);
			(0,internal/* append */.R3)(div3, div2);
			(0,internal/* append */.R3)(div2, div0);
			(0,internal/* append */.R3)(div0, t2);
			(0,internal/* append */.R3)(div0, input0);
			(0,internal/* append */.R3)(div2, t3);
			(0,internal/* append */.R3)(div2, button);
			(0,internal/* append */.R3)(div2, t5);
			(0,internal/* append */.R3)(div2, div1);
			(0,internal/* append */.R3)(div1, t6);
			(0,internal/* append */.R3)(div1, input1);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(input0, "input", /*input_handler*/ ctx[6]),
					(0,internal/* listen */.oL)(button, "click", /*calibrateStart*/ ctx[3]),
					(0,internal/* listen */.oL)(input1, "input", /*input_handler_1*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const calibrationoverlay_changes = {};
			if (dirty & /*calibrationInProgress*/ 1) calibrationoverlay_changes.show = /*calibrationInProgress*/ ctx[0];

			if (dirty & /*$$scope, calibrationMapNumbers*/ 258) {
				calibrationoverlay_changes.$$scope = { dirty, ctx };
			}

			calibrationoverlay.$set(calibrationoverlay_changes);

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], !current ? -1 : dirty, null, null);
				}
			}

			if (!current || dirty & /*calibrationMapNumbers*/ 2 && input0_value_value !== (input0_value_value = /*calibrationMapNumbers*/ ctx[1][2])) {
				input0.value = input0_value_value;
			}

			if (!current || dirty & /*calibrationMapNumbers*/ 2 && input1_value_value !== (input1_value_value = /*calibrationMapNumbers*/ ctx[1][3])) {
				input1.value = input1_value_value;
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(calibrationoverlay.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(calibrationoverlay.$$.fragment, local);
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div3);
			(0,internal/* destroy_component */.vp)(calibrationoverlay);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Calibration_clutch_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	let calibrationInProgress = false;
	let calibrationMapNumbers = [0, 1023, 0, 1023];
	let bitsMapNumbers = [1023, 1023];

	const updateContext = e => {
		$$invalidate(1, calibrationMapNumbers[e.target.name] = parseInt(e.target.value), calibrationMapNumbers);

		calibrationMap.update(existing => {
			return {
				...existing,
				...{ clutchCalibration: calibrationMapNumbers }
			};
		});
	};

	const calibrateStart = () => {
		$$invalidate(0, calibrationInProgress = true);
		$$invalidate(1, calibrationMapNumbers[0] = null, calibrationMapNumbers);
		$$invalidate(1, calibrationMapNumbers[1] = null, calibrationMapNumbers);
	};

	const calibrateDone = () => {
		$$invalidate(0, calibrationInProgress = false);

		calibrationMap.update(existing => {
			return {
				...existing,
				...{ clutchCalibration: calibrationMapNumbers }
			};
		});
	};

	calibrationMap.subscribe(value => {
		const { clutchCalibration } = value;
		$$invalidate(1, calibrationMapNumbers = clutchCalibration);
	});

	bitsMap.subscribe(value => {
		const { clutchBits } = value;
		bitsMapNumbers = clutchBits;
	});

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			if (calibrationInProgress) {
				if (calibrationMapNumbers[0] === null) {
					$$invalidate(1, calibrationMapNumbers[0] = msg.clutch.raw, calibrationMapNumbers);
				}

				if (msg.clutch.raw < calibrationMapNumbers[0]) {
					$$invalidate(1, calibrationMapNumbers[0] = msg.clutch.raw, calibrationMapNumbers);
				}

				if (calibrationMapNumbers[1] === null) {
					$$invalidate(1, calibrationMapNumbers[1] = msg.clutch.raw, calibrationMapNumbers);
				}

				if (msg.clutch.raw > calibrationMapNumbers[1]) {
					$$invalidate(1, calibrationMapNumbers[1] = msg.clutch.raw, calibrationMapNumbers);
				}
			}
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	const input_handler = e => updateContext(e);
	const input_handler_1 = e => updateContext(e);

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
	};

	return [
		calibrationInProgress,
		calibrationMapNumbers,
		updateContext,
		calibrateStart,
		calibrateDone,
		slots,
		input_handler,
		input_handler_1,
		$$scope
	];
}

class Calibration_clutch extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Calibration_clutch_svelte_instance, Calibration_clutch_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Calibration_clutch_svelte = (Calibration_clutch);
;// CONCATENATED MODULE: ./src/Calibration/Components/Calibration/Calibration_brake.svelte
/* src\Calibration\Components\Calibration\Calibration_brake.svelte generated by Svelte v3.38.3 */





function Calibration_brake_svelte_create_default_slot(ctx) {
	let p0;
	let t1;
	let p1;
	let t3;
	let p2;
	let t5;
	let div;
	let button;
	let t7;
	let p3;
	let span0;
	let t8;
	let strong0;
	let t9_value = /*calibrationMapNumbers*/ ctx[1][0] + "";
	let t9;
	let t10;
	let span1;
	let t12;
	let span2;
	let t13;
	let strong1;
	let t14_value = /*calibrationMapNumbers*/ ctx[1][1] + "";
	let t14;
	let mounted;
	let dispose;

	return {
		c() {
			p0 = (0,internal/* element */.bG)("p");
			p0.textContent = "Step 1. Make sure the brake is in neutral position.";
			t1 = (0,internal/* space */.Dh)();
			p1 = (0,internal/* element */.bG)("p");
			p1.textContent = "Step 2. Press the brake all the way down and then release.";
			t3 = (0,internal/* space */.Dh)();
			p2 = (0,internal/* element */.bG)("p");
			p2.textContent = "Step 3. Press done to finish calibration.";
			t5 = (0,internal/* space */.Dh)();
			div = (0,internal/* element */.bG)("div");
			button = (0,internal/* element */.bG)("button");
			button.textContent = "done";
			t7 = (0,internal/* space */.Dh)();
			p3 = (0,internal/* element */.bG)("p");
			span0 = (0,internal/* element */.bG)("span");
			t8 = (0,internal/* text */.fL)("start ");
			strong0 = (0,internal/* element */.bG)("strong");
			t9 = (0,internal/* text */.fL)(t9_value);
			t10 = (0,internal/* space */.Dh)();
			span1 = (0,internal/* element */.bG)("span");
			span1.textContent = "|";
			t12 = (0,internal/* space */.Dh)();
			span2 = (0,internal/* element */.bG)("span");
			t13 = (0,internal/* text */.fL)("end ");
			strong1 = (0,internal/* element */.bG)("strong");
			t14 = (0,internal/* text */.fL)(t14_value);
			(0,internal/* set_style */.cz)(p0, "text-align", "center");
			(0,internal/* set_style */.cz)(p0, "font-size", "18px");
			(0,internal/* set_style */.cz)(p0, "margin", "5px");
			(0,internal/* set_style */.cz)(p1, "text-align", "center");
			(0,internal/* set_style */.cz)(p1, "font-size", "18px");
			(0,internal/* set_style */.cz)(p1, "margin", "5px");
			(0,internal/* set_style */.cz)(p2, "text-align", "center");
			(0,internal/* set_style */.cz)(p2, "font-size", "18px");
			(0,internal/* set_style */.cz)(p2, "margin", "5px");
			(0,internal/* set_style */.cz)(div, "text-align", "center");
			(0,internal/* set_style */.cz)(div, "font-size", "18px");
			(0,internal/* set_style */.cz)(p3, "text-align", "center");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, p0, anchor);
			(0,internal/* insert */.$T)(target, t1, anchor);
			(0,internal/* insert */.$T)(target, p1, anchor);
			(0,internal/* insert */.$T)(target, t3, anchor);
			(0,internal/* insert */.$T)(target, p2, anchor);
			(0,internal/* insert */.$T)(target, t5, anchor);
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, button);
			(0,internal/* insert */.$T)(target, t7, anchor);
			(0,internal/* insert */.$T)(target, p3, anchor);
			(0,internal/* append */.R3)(p3, span0);
			(0,internal/* append */.R3)(span0, t8);
			(0,internal/* append */.R3)(span0, strong0);
			(0,internal/* append */.R3)(strong0, t9);
			(0,internal/* append */.R3)(p3, t10);
			(0,internal/* append */.R3)(p3, span1);
			(0,internal/* append */.R3)(p3, t12);
			(0,internal/* append */.R3)(p3, span2);
			(0,internal/* append */.R3)(span2, t13);
			(0,internal/* append */.R3)(span2, strong1);
			(0,internal/* append */.R3)(strong1, t14);

			if (!mounted) {
				dispose = (0,internal/* listen */.oL)(button, "click", /*calibrateDone*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*calibrationMapNumbers*/ 2 && t9_value !== (t9_value = /*calibrationMapNumbers*/ ctx[1][0] + "")) (0,internal/* set_data */.rT)(t9, t9_value);
			if (dirty & /*calibrationMapNumbers*/ 2 && t14_value !== (t14_value = /*calibrationMapNumbers*/ ctx[1][1] + "")) (0,internal/* set_data */.rT)(t14, t14_value);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(p0);
			if (detaching) (0,internal/* detach */.og)(t1);
			if (detaching) (0,internal/* detach */.og)(p1);
			if (detaching) (0,internal/* detach */.og)(t3);
			if (detaching) (0,internal/* detach */.og)(p2);
			if (detaching) (0,internal/* detach */.og)(t5);
			if (detaching) (0,internal/* detach */.og)(div);
			if (detaching) (0,internal/* detach */.og)(t7);
			if (detaching) (0,internal/* detach */.og)(p3);
			mounted = false;
			dispose();
		}
	};
}

function Calibration_brake_svelte_create_fragment(ctx) {
	let div3;
	let calibrationoverlay;
	let t0;
	let t1;
	let div2;
	let div0;
	let t2;
	let input0;
	let input0_value_value;
	let t3;
	let button;
	let t5;
	let div1;
	let t6;
	let input1;
	let input1_value_value;
	let current;
	let mounted;
	let dispose;

	calibrationoverlay = new CalibrationOverlay_svelte({
			props: {
				show: /*calibrationInProgress*/ ctx[0],
				$$slots: { default: [Calibration_brake_svelte_create_default_slot] },
				$$scope: { ctx }
			}
		});

	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

	return {
		c() {
			div3 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(calibrationoverlay.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			if (default_slot) default_slot.c();
			t1 = (0,internal/* space */.Dh)();
			div2 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			t2 = (0,internal/* text */.fL)("deadzone: start\r\n            ");
			input0 = (0,internal/* element */.bG)("input");
			t3 = (0,internal/* space */.Dh)();
			button = (0,internal/* element */.bG)("button");
			button.textContent = "calibrate";
			t5 = (0,internal/* space */.Dh)();
			div1 = (0,internal/* element */.bG)("div");
			t6 = (0,internal/* text */.fL)("deadzone: end\r\n            ");
			input1 = (0,internal/* element */.bG)("input");
			(0,internal/* attr */.Lj)(input0, "min", "0");
			(0,internal/* attr */.Lj)(input0, "max", "1023");
			(0,internal/* attr */.Lj)(input0, "type", "number");
			(0,internal/* attr */.Lj)(input0, "name", "2");
			input0.value = input0_value_value = /*calibrationMapNumbers*/ ctx[1][2];
			(0,internal/* set_style */.cz)(input0, "text-align", "left");
			(0,internal/* attr */.Lj)(input1, "min", "0");
			(0,internal/* attr */.Lj)(input1, "max", "1023");
			(0,internal/* attr */.Lj)(input1, "type", "number");
			(0,internal/* attr */.Lj)(input1, "name", "3");
			input1.value = input1_value_value = /*calibrationMapNumbers*/ ctx[1][3];
			(0,internal/* set_style */.cz)(input1, "text-align", "right");
			(0,internal/* set_style */.cz)(div2, "padding", "0px 25px 0px 35px");
			(0,internal/* set_style */.cz)(div2, "display", "flex");
			(0,internal/* set_style */.cz)(div2, "justify-content", "space-between");
			(0,internal/* set_style */.cz)(div3, "position", "relative");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div3, anchor);
			(0,internal/* mount_component */.ye)(calibrationoverlay, div3, null);
			(0,internal/* append */.R3)(div3, t0);

			if (default_slot) {
				default_slot.m(div3, null);
			}

			(0,internal/* append */.R3)(div3, t1);
			(0,internal/* append */.R3)(div3, div2);
			(0,internal/* append */.R3)(div2, div0);
			(0,internal/* append */.R3)(div0, t2);
			(0,internal/* append */.R3)(div0, input0);
			(0,internal/* append */.R3)(div2, t3);
			(0,internal/* append */.R3)(div2, button);
			(0,internal/* append */.R3)(div2, t5);
			(0,internal/* append */.R3)(div2, div1);
			(0,internal/* append */.R3)(div1, t6);
			(0,internal/* append */.R3)(div1, input1);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(input0, "input", /*input_handler*/ ctx[6]),
					(0,internal/* listen */.oL)(button, "click", /*calibrateStart*/ ctx[3]),
					(0,internal/* listen */.oL)(input1, "input", /*input_handler_1*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const calibrationoverlay_changes = {};
			if (dirty & /*calibrationInProgress*/ 1) calibrationoverlay_changes.show = /*calibrationInProgress*/ ctx[0];

			if (dirty & /*$$scope, calibrationMapNumbers*/ 258) {
				calibrationoverlay_changes.$$scope = { dirty, ctx };
			}

			calibrationoverlay.$set(calibrationoverlay_changes);

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], !current ? -1 : dirty, null, null);
				}
			}

			if (!current || dirty & /*calibrationMapNumbers*/ 2 && input0_value_value !== (input0_value_value = /*calibrationMapNumbers*/ ctx[1][2])) {
				input0.value = input0_value_value;
			}

			if (!current || dirty & /*calibrationMapNumbers*/ 2 && input1_value_value !== (input1_value_value = /*calibrationMapNumbers*/ ctx[1][3])) {
				input1.value = input1_value_value;
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(calibrationoverlay.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(calibrationoverlay.$$.fragment, local);
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div3);
			(0,internal/* destroy_component */.vp)(calibrationoverlay);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Calibration_brake_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	let calibrationInProgress = false;
	let calibrationMapNumbers = [0, 1023, 0, 1023];
	let bitsMapNumbers = [1023, 1023];

	const updateContext = e => {
		$$invalidate(1, calibrationMapNumbers[e.target.name] = parseInt(e.target.value), calibrationMapNumbers);

		calibrationMap.update(existing => {
			return {
				...existing,
				...{ brakeCalibration: calibrationMapNumbers }
			};
		});
	};

	const calibrateStart = () => {
		$$invalidate(0, calibrationInProgress = true);
		$$invalidate(1, calibrationMapNumbers[0] = null, calibrationMapNumbers);
		$$invalidate(1, calibrationMapNumbers[1] = null, calibrationMapNumbers);
	};

	const calibrateDone = () => {
		$$invalidate(0, calibrationInProgress = false);

		calibrationMap.update(existing => {
			return {
				...existing,
				...{ brakeCalibration: calibrationMapNumbers }
			};
		});
	};

	calibrationMap.subscribe(value => {
		const { brakeCalibration } = value;
		$$invalidate(1, calibrationMapNumbers = brakeCalibration);
	});

	bitsMap.subscribe(value => {
		const { brakeBits } = value;
		bitsMapNumbers = brakeBits;
	});

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			if (calibrationInProgress) {
				if (calibrationMapNumbers[0] === null) {
					$$invalidate(1, calibrationMapNumbers[0] = msg.brake.raw, calibrationMapNumbers);
				}

				if (msg.brake.raw < calibrationMapNumbers[0]) {
					$$invalidate(1, calibrationMapNumbers[0] = msg.brake.raw, calibrationMapNumbers);
				}

				if (calibrationMapNumbers[1] === null) {
					$$invalidate(1, calibrationMapNumbers[1] = msg.brake.raw, calibrationMapNumbers);
				}

				if (msg.brake.raw > calibrationMapNumbers[1]) {
					$$invalidate(1, calibrationMapNumbers[1] = msg.brake.raw, calibrationMapNumbers);
				}
			}
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	const input_handler = e => updateContext(e);
	const input_handler_1 = e => updateContext(e);

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
	};

	return [
		calibrationInProgress,
		calibrationMapNumbers,
		updateContext,
		calibrateStart,
		calibrateDone,
		slots,
		input_handler,
		input_handler_1,
		$$scope
	];
}

class Calibration_brake extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Calibration_brake_svelte_instance, Calibration_brake_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Calibration_brake_svelte = (Calibration_brake);
;// CONCATENATED MODULE: ./src/Calibration/Components/Calibration/Calibration_throttle.svelte
/* src\Calibration\Components\Calibration\Calibration_throttle.svelte generated by Svelte v3.38.3 */





function Calibration_throttle_svelte_create_default_slot(ctx) {
	let p0;
	let t1;
	let p1;
	let t3;
	let p2;
	let t5;
	let div;
	let button;
	let t7;
	let p3;
	let span0;
	let t8;
	let strong0;
	let t9_value = /*calibrationMapNumbers*/ ctx[1][0] + "";
	let t9;
	let t10;
	let span1;
	let t12;
	let span2;
	let t13;
	let strong1;
	let t14_value = /*calibrationMapNumbers*/ ctx[1][1] + "";
	let t14;
	let mounted;
	let dispose;

	return {
		c() {
			p0 = (0,internal/* element */.bG)("p");
			p0.textContent = "Step 1. Make sure the throttle is in neutral position.";
			t1 = (0,internal/* space */.Dh)();
			p1 = (0,internal/* element */.bG)("p");
			p1.textContent = "Step 2. Press the throttle all the way down and then release.";
			t3 = (0,internal/* space */.Dh)();
			p2 = (0,internal/* element */.bG)("p");
			p2.textContent = "Step 3. Press done to finish calibration.";
			t5 = (0,internal/* space */.Dh)();
			div = (0,internal/* element */.bG)("div");
			button = (0,internal/* element */.bG)("button");
			button.textContent = "done";
			t7 = (0,internal/* space */.Dh)();
			p3 = (0,internal/* element */.bG)("p");
			span0 = (0,internal/* element */.bG)("span");
			t8 = (0,internal/* text */.fL)("start ");
			strong0 = (0,internal/* element */.bG)("strong");
			t9 = (0,internal/* text */.fL)(t9_value);
			t10 = (0,internal/* space */.Dh)();
			span1 = (0,internal/* element */.bG)("span");
			span1.textContent = "|";
			t12 = (0,internal/* space */.Dh)();
			span2 = (0,internal/* element */.bG)("span");
			t13 = (0,internal/* text */.fL)("end ");
			strong1 = (0,internal/* element */.bG)("strong");
			t14 = (0,internal/* text */.fL)(t14_value);
			(0,internal/* set_style */.cz)(p0, "text-align", "center");
			(0,internal/* set_style */.cz)(p0, "font-size", "18px");
			(0,internal/* set_style */.cz)(p0, "margin", "5px");
			(0,internal/* set_style */.cz)(p1, "text-align", "center");
			(0,internal/* set_style */.cz)(p1, "font-size", "18px");
			(0,internal/* set_style */.cz)(p1, "margin", "5px");
			(0,internal/* set_style */.cz)(p2, "text-align", "center");
			(0,internal/* set_style */.cz)(p2, "font-size", "18px");
			(0,internal/* set_style */.cz)(p2, "margin", "5px");
			(0,internal/* set_style */.cz)(div, "text-align", "center");
			(0,internal/* set_style */.cz)(div, "font-size", "18px");
			(0,internal/* set_style */.cz)(p3, "text-align", "center");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, p0, anchor);
			(0,internal/* insert */.$T)(target, t1, anchor);
			(0,internal/* insert */.$T)(target, p1, anchor);
			(0,internal/* insert */.$T)(target, t3, anchor);
			(0,internal/* insert */.$T)(target, p2, anchor);
			(0,internal/* insert */.$T)(target, t5, anchor);
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, button);
			(0,internal/* insert */.$T)(target, t7, anchor);
			(0,internal/* insert */.$T)(target, p3, anchor);
			(0,internal/* append */.R3)(p3, span0);
			(0,internal/* append */.R3)(span0, t8);
			(0,internal/* append */.R3)(span0, strong0);
			(0,internal/* append */.R3)(strong0, t9);
			(0,internal/* append */.R3)(p3, t10);
			(0,internal/* append */.R3)(p3, span1);
			(0,internal/* append */.R3)(p3, t12);
			(0,internal/* append */.R3)(p3, span2);
			(0,internal/* append */.R3)(span2, t13);
			(0,internal/* append */.R3)(span2, strong1);
			(0,internal/* append */.R3)(strong1, t14);

			if (!mounted) {
				dispose = (0,internal/* listen */.oL)(button, "click", /*calibrateDone*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*calibrationMapNumbers*/ 2 && t9_value !== (t9_value = /*calibrationMapNumbers*/ ctx[1][0] + "")) (0,internal/* set_data */.rT)(t9, t9_value);
			if (dirty & /*calibrationMapNumbers*/ 2 && t14_value !== (t14_value = /*calibrationMapNumbers*/ ctx[1][1] + "")) (0,internal/* set_data */.rT)(t14, t14_value);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(p0);
			if (detaching) (0,internal/* detach */.og)(t1);
			if (detaching) (0,internal/* detach */.og)(p1);
			if (detaching) (0,internal/* detach */.og)(t3);
			if (detaching) (0,internal/* detach */.og)(p2);
			if (detaching) (0,internal/* detach */.og)(t5);
			if (detaching) (0,internal/* detach */.og)(div);
			if (detaching) (0,internal/* detach */.og)(t7);
			if (detaching) (0,internal/* detach */.og)(p3);
			mounted = false;
			dispose();
		}
	};
}

function Calibration_throttle_svelte_create_fragment(ctx) {
	let div3;
	let calibrationoverlay;
	let t0;
	let t1;
	let div2;
	let div0;
	let t2;
	let input0;
	let input0_value_value;
	let t3;
	let button;
	let t5;
	let div1;
	let t6;
	let input1;
	let input1_value_value;
	let current;
	let mounted;
	let dispose;

	calibrationoverlay = new CalibrationOverlay_svelte({
			props: {
				show: /*calibrationInProgress*/ ctx[0],
				$$slots: { default: [Calibration_throttle_svelte_create_default_slot] },
				$$scope: { ctx }
			}
		});

	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = (0,internal/* create_slot */.nu)(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

	return {
		c() {
			div3 = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(calibrationoverlay.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			if (default_slot) default_slot.c();
			t1 = (0,internal/* space */.Dh)();
			div2 = (0,internal/* element */.bG)("div");
			div0 = (0,internal/* element */.bG)("div");
			t2 = (0,internal/* text */.fL)("deadzone: start\r\n            ");
			input0 = (0,internal/* element */.bG)("input");
			t3 = (0,internal/* space */.Dh)();
			button = (0,internal/* element */.bG)("button");
			button.textContent = "calibrate";
			t5 = (0,internal/* space */.Dh)();
			div1 = (0,internal/* element */.bG)("div");
			t6 = (0,internal/* text */.fL)("deadzone: end\r\n            ");
			input1 = (0,internal/* element */.bG)("input");
			(0,internal/* attr */.Lj)(input0, "min", "0");
			(0,internal/* attr */.Lj)(input0, "max", "1023");
			(0,internal/* attr */.Lj)(input0, "type", "number");
			(0,internal/* attr */.Lj)(input0, "name", "2");
			input0.value = input0_value_value = /*calibrationMapNumbers*/ ctx[1][2];
			(0,internal/* set_style */.cz)(input0, "text-align", "left");
			(0,internal/* attr */.Lj)(input1, "min", "0");
			(0,internal/* attr */.Lj)(input1, "max", "1023");
			(0,internal/* attr */.Lj)(input1, "type", "number");
			(0,internal/* attr */.Lj)(input1, "name", "3");
			input1.value = input1_value_value = /*calibrationMapNumbers*/ ctx[1][3];
			(0,internal/* set_style */.cz)(input1, "text-align", "right");
			(0,internal/* set_style */.cz)(div2, "padding", "0px 25px 0px 35px");
			(0,internal/* set_style */.cz)(div2, "display", "flex");
			(0,internal/* set_style */.cz)(div2, "justify-content", "space-between");
			(0,internal/* set_style */.cz)(div3, "position", "relative");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div3, anchor);
			(0,internal/* mount_component */.ye)(calibrationoverlay, div3, null);
			(0,internal/* append */.R3)(div3, t0);

			if (default_slot) {
				default_slot.m(div3, null);
			}

			(0,internal/* append */.R3)(div3, t1);
			(0,internal/* append */.R3)(div3, div2);
			(0,internal/* append */.R3)(div2, div0);
			(0,internal/* append */.R3)(div0, t2);
			(0,internal/* append */.R3)(div0, input0);
			(0,internal/* append */.R3)(div2, t3);
			(0,internal/* append */.R3)(div2, button);
			(0,internal/* append */.R3)(div2, t5);
			(0,internal/* append */.R3)(div2, div1);
			(0,internal/* append */.R3)(div1, t6);
			(0,internal/* append */.R3)(div1, input1);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(input0, "input", /*input_handler*/ ctx[6]),
					(0,internal/* listen */.oL)(button, "click", /*calibrateStart*/ ctx[3]),
					(0,internal/* listen */.oL)(input1, "input", /*input_handler_1*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const calibrationoverlay_changes = {};
			if (dirty & /*calibrationInProgress*/ 1) calibrationoverlay_changes.show = /*calibrationInProgress*/ ctx[0];

			if (dirty & /*$$scope, calibrationMapNumbers*/ 258) {
				calibrationoverlay_changes.$$scope = { dirty, ctx };
			}

			calibrationoverlay.$set(calibrationoverlay_changes);

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
					(0,internal/* update_slot */.Tj)(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], !current ? -1 : dirty, null, null);
				}
			}

			if (!current || dirty & /*calibrationMapNumbers*/ 2 && input0_value_value !== (input0_value_value = /*calibrationMapNumbers*/ ctx[1][2])) {
				input0.value = input0_value_value;
			}

			if (!current || dirty & /*calibrationMapNumbers*/ 2 && input1_value_value !== (input1_value_value = /*calibrationMapNumbers*/ ctx[1][3])) {
				input1.value = input1_value_value;
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(calibrationoverlay.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(default_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(calibrationoverlay.$$.fragment, local);
			(0,internal/* transition_out */.et)(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div3);
			(0,internal/* destroy_component */.vp)(calibrationoverlay);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Calibration_throttle_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	let calibrationInProgress = false;
	let calibrationMapNumbers = [0, 1023, 0, 1023];
	let bitsMapNumbers = [1023, 1023];

	const updateContext = e => {
		$$invalidate(1, calibrationMapNumbers[e.target.name] = parseInt(e.target.value), calibrationMapNumbers);

		calibrationMap.update(existing => {
			return {
				...existing,
				...{
					throttleCalibration: calibrationMapNumbers
				}
			};
		});
	};

	const calibrateStart = () => {
		$$invalidate(0, calibrationInProgress = true);
		$$invalidate(1, calibrationMapNumbers[0] = null, calibrationMapNumbers);
		$$invalidate(1, calibrationMapNumbers[1] = null, calibrationMapNumbers);
	};

	const calibrateDone = () => {
		$$invalidate(0, calibrationInProgress = false);

		calibrationMap.update(existing => {
			return {
				...existing,
				...{
					throttleCalibration: calibrationMapNumbers
				}
			};
		});
	};

	calibrationMap.subscribe(value => {
		const { throttleCalibration } = value;
		$$invalidate(1, calibrationMapNumbers = throttleCalibration);
	});

	bitsMap.subscribe(value => {
		const { throttleBits } = value;
		bitsMapNumbers = throttleBits;
	});

	const unsubscribeMessage = message.subscribe({
		next: msg => {
			if (calibrationInProgress) {
				if (calibrationMapNumbers[0] === null) {
					$$invalidate(1, calibrationMapNumbers[0] = msg.throttle.raw, calibrationMapNumbers);
				}

				if (msg.throttle.raw < calibrationMapNumbers[0]) {
					$$invalidate(1, calibrationMapNumbers[0] = msg.throttle.raw, calibrationMapNumbers);
				}

				if (calibrationMapNumbers[1] === null) {
					$$invalidate(1, calibrationMapNumbers[1] = msg.throttle.raw, calibrationMapNumbers);
				}

				if (msg.throttle.raw > calibrationMapNumbers[1]) {
					$$invalidate(1, calibrationMapNumbers[1] = msg.throttle.raw, calibrationMapNumbers);
				}
			}
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	(0,svelte/* onDestroy */.ev)(() => {
		unsubscribeMessage.unsubscribe();
	});

	const input_handler = e => updateContext(e);
	const input_handler_1 = e => updateContext(e);

	$$self.$$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
	};

	return [
		calibrationInProgress,
		calibrationMapNumbers,
		updateContext,
		calibrateStart,
		calibrateDone,
		slots,
		input_handler,
		input_handler_1,
		$$scope
	];
}

class Calibration_throttle extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Calibration_throttle_svelte_instance, Calibration_throttle_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Calibration_throttle_svelte = (Calibration_throttle);
;// CONCATENATED MODULE: ./src/Calibration/Calibration.svelte
/* src\Calibration\Calibration.svelte generated by Svelte v3.38.3 */














function create_default_slot_2(ctx) {
	let d3bulletgraph_clutch_hid;
	let t;
	let d3bulletgraph_clutch_raw;
	let current;
	d3bulletgraph_clutch_hid = new D3BulletGraph_clutch_hid_svelte({});
	d3bulletgraph_clutch_raw = new D3BulletGraph_clutch_raw_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(d3bulletgraph_clutch_hid.$$.fragment);
			t = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(d3bulletgraph_clutch_raw.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(d3bulletgraph_clutch_hid, target, anchor);
			(0,internal/* insert */.$T)(target, t, anchor);
			(0,internal/* mount_component */.ye)(d3bulletgraph_clutch_raw, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(d3bulletgraph_clutch_hid.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(d3bulletgraph_clutch_raw.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(d3bulletgraph_clutch_hid.$$.fragment, local);
			(0,internal/* transition_out */.et)(d3bulletgraph_clutch_raw.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(d3bulletgraph_clutch_hid, detaching);
			if (detaching) (0,internal/* detach */.og)(t);
			(0,internal/* destroy_component */.vp)(d3bulletgraph_clutch_raw, detaching);
		}
	};
}

// (32:0) <Calibration_brake>
function create_default_slot_1(ctx) {
	let d3bulletgraph_brake_hid;
	let t;
	let d3bulletgraph_brake_raw;
	let current;
	d3bulletgraph_brake_hid = new D3BulletGraph_brake_hid_svelte({});
	d3bulletgraph_brake_raw = new D3BulletGraph_brake_raw_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(d3bulletgraph_brake_hid.$$.fragment);
			t = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(d3bulletgraph_brake_raw.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(d3bulletgraph_brake_hid, target, anchor);
			(0,internal/* insert */.$T)(target, t, anchor);
			(0,internal/* mount_component */.ye)(d3bulletgraph_brake_raw, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(d3bulletgraph_brake_hid.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(d3bulletgraph_brake_raw.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(d3bulletgraph_brake_hid.$$.fragment, local);
			(0,internal/* transition_out */.et)(d3bulletgraph_brake_raw.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(d3bulletgraph_brake_hid, detaching);
			if (detaching) (0,internal/* detach */.og)(t);
			(0,internal/* destroy_component */.vp)(d3bulletgraph_brake_raw, detaching);
		}
	};
}

// (37:0) <Calibration_throttle>
function Calibration_svelte_create_default_slot(ctx) {
	let d3bulletgraph_throttle_hid;
	let t;
	let d3bulletgraph_throttle_raw;
	let current;
	d3bulletgraph_throttle_hid = new D3BulletGraph_throttle_hid_svelte({});
	d3bulletgraph_throttle_raw = new D3BulletGraph_throttle_raw_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(d3bulletgraph_throttle_hid.$$.fragment);
			t = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(d3bulletgraph_throttle_raw.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(d3bulletgraph_throttle_hid, target, anchor);
			(0,internal/* insert */.$T)(target, t, anchor);
			(0,internal/* mount_component */.ye)(d3bulletgraph_throttle_raw, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(d3bulletgraph_throttle_hid.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(d3bulletgraph_throttle_raw.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(d3bulletgraph_throttle_hid.$$.fragment, local);
			(0,internal/* transition_out */.et)(d3bulletgraph_throttle_raw.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(d3bulletgraph_throttle_hid, detaching);
			if (detaching) (0,internal/* detach */.og)(t);
			(0,internal/* destroy_component */.vp)(d3bulletgraph_throttle_raw, detaching);
		}
	};
}

function Calibration_svelte_create_fragment(ctx) {
	let calibration_clutch;
	let t0;
	let br0;
	let t1;
	let calibration_brake;
	let t2;
	let br1;
	let t3;
	let calibration_throttle;
	let t4;
	let div;
	let button0;
	let t6;
	let button1;
	let t8;
	let savetoarduino;
	let current;
	let mounted;
	let dispose;

	calibration_clutch = new Calibration_clutch_svelte({
			props: {
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			}
		});

	calibration_brake = new Calibration_brake_svelte({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	calibration_throttle = new Calibration_throttle_svelte({
			props: {
				$$slots: { default: [Calibration_svelte_create_default_slot] },
				$$scope: { ctx }
			}
		});

	savetoarduino = new SaveToArduino_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(calibration_clutch.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			br0 = (0,internal/* element */.bG)("br");
			t1 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(calibration_brake.$$.fragment);
			t2 = (0,internal/* space */.Dh)();
			br1 = (0,internal/* element */.bG)("br");
			t3 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(calibration_throttle.$$.fragment);
			t4 = (0,internal/* space */.Dh)();
			div = (0,internal/* element */.bG)("div");
			button0 = (0,internal/* element */.bG)("button");
			button0.textContent = "old calibration";
			t6 = (0,internal/* space */.Dh)();
			button1 = (0,internal/* element */.bG)("button");
			button1.textContent = "reset calibration";
			t8 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(savetoarduino.$$.fragment);
			(0,internal/* set_style */.cz)(div, "text-align", "center");
			(0,internal/* set_style */.cz)(div, "padding", "10px");
			(0,internal/* set_style */.cz)(div, "margin-top", "20px");
			(0,internal/* set_style */.cz)(div, "background", "#eeeeee");
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(calibration_clutch, target, anchor);
			(0,internal/* insert */.$T)(target, t0, anchor);
			(0,internal/* insert */.$T)(target, br0, anchor);
			(0,internal/* insert */.$T)(target, t1, anchor);
			(0,internal/* mount_component */.ye)(calibration_brake, target, anchor);
			(0,internal/* insert */.$T)(target, t2, anchor);
			(0,internal/* insert */.$T)(target, br1, anchor);
			(0,internal/* insert */.$T)(target, t3, anchor);
			(0,internal/* mount_component */.ye)(calibration_throttle, target, anchor);
			(0,internal/* insert */.$T)(target, t4, anchor);
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, button0);
			(0,internal/* append */.R3)(div, t6);
			(0,internal/* append */.R3)(div, button1);
			(0,internal/* append */.R3)(div, t8);
			(0,internal/* mount_component */.ye)(savetoarduino, div, null);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.oL)(button0, "click", /*oldCalibration*/ ctx[0]),
					(0,internal/* listen */.oL)(button1, "click", /*resetCalibration*/ ctx[1])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const calibration_clutch_changes = {};

			if (dirty & /*$$scope*/ 32) {
				calibration_clutch_changes.$$scope = { dirty, ctx };
			}

			calibration_clutch.$set(calibration_clutch_changes);
			const calibration_brake_changes = {};

			if (dirty & /*$$scope*/ 32) {
				calibration_brake_changes.$$scope = { dirty, ctx };
			}

			calibration_brake.$set(calibration_brake_changes);
			const calibration_throttle_changes = {};

			if (dirty & /*$$scope*/ 32) {
				calibration_throttle_changes.$$scope = { dirty, ctx };
			}

			calibration_throttle.$set(calibration_throttle_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(calibration_clutch.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(calibration_brake.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(calibration_throttle.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(savetoarduino.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(calibration_clutch.$$.fragment, local);
			(0,internal/* transition_out */.et)(calibration_brake.$$.fragment, local);
			(0,internal/* transition_out */.et)(calibration_throttle.$$.fragment, local);
			(0,internal/* transition_out */.et)(savetoarduino.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(calibration_clutch, detaching);
			if (detaching) (0,internal/* detach */.og)(t0);
			if (detaching) (0,internal/* detach */.og)(br0);
			if (detaching) (0,internal/* detach */.og)(t1);
			(0,internal/* destroy_component */.vp)(calibration_brake, detaching);
			if (detaching) (0,internal/* detach */.og)(t2);
			if (detaching) (0,internal/* detach */.og)(br1);
			if (detaching) (0,internal/* detach */.og)(t3);
			(0,internal/* destroy_component */.vp)(calibration_throttle, detaching);
			if (detaching) (0,internal/* detach */.og)(t4);
			if (detaching) (0,internal/* detach */.og)(div);
			(0,internal/* destroy_component */.vp)(savetoarduino);
			mounted = false;
			(0,internal/* run_all */.j7)(dispose);
		}
	};
}

function Calibration_svelte_instance($$self) {
	let { connect, disconnect, write } = (0,svelte/* getContext */.fw)("WSC-actions");

	const oldCalibration = () => {
		write("GetCali"); //get calibrarion values
	};

	const resetCalibration = () => {
		write("CALIRESET"); //reset calibrarion values
		write("GetCali"); //get reset calibrarion values
	};

	return [oldCalibration, resetCalibration];
}

class Calibration extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Calibration_svelte_instance, Calibration_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Calibration_svelte = (Calibration);
;// CONCATENATED MODULE: ./src/Logging/Components/Logger/Logger.svelte
/* src\Logging\Components\Logger\Logger.svelte generated by Svelte v3.38.3 */




function Logger_svelte_create_fragment(ctx) {
	let div;
	let pre;
	let t_value = JSON.stringify(/*list*/ ctx[0], null, 2) + "";
	let t;

	return {
		c() {
			div = (0,internal/* element */.bG)("div");
			pre = (0,internal/* element */.bG)("pre");
			t = (0,internal/* text */.fL)(t_value);
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, pre);
			(0,internal/* append */.R3)(pre, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*list*/ 1 && t_value !== (t_value = JSON.stringify(/*list*/ ctx[0], null, 2) + "")) (0,internal/* set_data */.rT)(t, t_value);
		},
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div);
		}
	};
}

function Logger_svelte_instance($$self, $$props, $$invalidate) {
	let message = (0,svelte/* getContext */.fw)("WSC-message");
	let list = [];

	message.subscribe({
		next: msg => {
			if (list.length >= 1) {
				$$invalidate(0, list = [msg, ...list].slice(0, -1));
			} else {
				$$invalidate(0, list = [msg, ...list]);
			}
		},
		complete: () => {
			console.log("[readLoop] DONE");
		}
	});

	return [list];
}

class Logger extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Logger_svelte_instance, Logger_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Logger_svelte = (Logger);
;// CONCATENATED MODULE: ./src/Logging/Components/Maps/Maps.svelte
/* src\Logging\Components\Maps\Maps.svelte generated by Svelte v3.38.3 */




function Maps_svelte_create_fragment(ctx) {
	let div;
	let pre0;
	let t0_value = JSON.stringify(/*$pedalMap*/ ctx[0]) + "";
	let t0;
	let t1;
	let pre1;
	let t2_value = JSON.stringify(/*$pedalMapSerial*/ ctx[1]) + "";
	let t2;
	let t3;
	let pre2;
	let t4_value = JSON.stringify(/*$calibrationMap*/ ctx[2]) + "";
	let t4;
	let t5;
	let pre3;
	let t6_value = JSON.stringify(/*$calibrationMapSerial*/ ctx[3]) + "";
	let t6;
	let t7;
	let pre4;
	let t8_value = JSON.stringify(/*$invertedMap*/ ctx[4]) + "";
	let t8;
	let t9;
	let pre5;
	let t10_value = JSON.stringify(/*$invertedMapSerial*/ ctx[5]) + "";
	let t10;
	let t11;
	let pre6;
	let t12_value = JSON.stringify(/*$smoothMap*/ ctx[6]) + "";
	let t12;
	let t13;
	let pre7;
	let t14_value = JSON.stringify(/*$smoothMapSerial*/ ctx[7]) + "";
	let t14;
	let t15;
	let pre8;
	let t16_value = JSON.stringify(/*$bitsMap*/ ctx[8]) + "";
	let t16;
	let t17;
	let pre9;
	let t18_value = JSON.stringify(/*$bitsMapSerial*/ ctx[9]) + "";
	let t18;

	return {
		c() {
			div = (0,internal/* element */.bG)("div");
			pre0 = (0,internal/* element */.bG)("pre");
			t0 = (0,internal/* text */.fL)(t0_value);
			t1 = (0,internal/* space */.Dh)();
			pre1 = (0,internal/* element */.bG)("pre");
			t2 = (0,internal/* text */.fL)(t2_value);
			t3 = (0,internal/* space */.Dh)();
			pre2 = (0,internal/* element */.bG)("pre");
			t4 = (0,internal/* text */.fL)(t4_value);
			t5 = (0,internal/* space */.Dh)();
			pre3 = (0,internal/* element */.bG)("pre");
			t6 = (0,internal/* text */.fL)(t6_value);
			t7 = (0,internal/* space */.Dh)();
			pre4 = (0,internal/* element */.bG)("pre");
			t8 = (0,internal/* text */.fL)(t8_value);
			t9 = (0,internal/* space */.Dh)();
			pre5 = (0,internal/* element */.bG)("pre");
			t10 = (0,internal/* text */.fL)(t10_value);
			t11 = (0,internal/* space */.Dh)();
			pre6 = (0,internal/* element */.bG)("pre");
			t12 = (0,internal/* text */.fL)(t12_value);
			t13 = (0,internal/* space */.Dh)();
			pre7 = (0,internal/* element */.bG)("pre");
			t14 = (0,internal/* text */.fL)(t14_value);
			t15 = (0,internal/* space */.Dh)();
			pre8 = (0,internal/* element */.bG)("pre");
			t16 = (0,internal/* text */.fL)(t16_value);
			t17 = (0,internal/* space */.Dh)();
			pre9 = (0,internal/* element */.bG)("pre");
			t18 = (0,internal/* text */.fL)(t18_value);
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* append */.R3)(div, pre0);
			(0,internal/* append */.R3)(pre0, t0);
			(0,internal/* append */.R3)(div, t1);
			(0,internal/* append */.R3)(div, pre1);
			(0,internal/* append */.R3)(pre1, t2);
			(0,internal/* append */.R3)(div, t3);
			(0,internal/* append */.R3)(div, pre2);
			(0,internal/* append */.R3)(pre2, t4);
			(0,internal/* append */.R3)(div, t5);
			(0,internal/* append */.R3)(div, pre3);
			(0,internal/* append */.R3)(pre3, t6);
			(0,internal/* append */.R3)(div, t7);
			(0,internal/* append */.R3)(div, pre4);
			(0,internal/* append */.R3)(pre4, t8);
			(0,internal/* append */.R3)(div, t9);
			(0,internal/* append */.R3)(div, pre5);
			(0,internal/* append */.R3)(pre5, t10);
			(0,internal/* append */.R3)(div, t11);
			(0,internal/* append */.R3)(div, pre6);
			(0,internal/* append */.R3)(pre6, t12);
			(0,internal/* append */.R3)(div, t13);
			(0,internal/* append */.R3)(div, pre7);
			(0,internal/* append */.R3)(pre7, t14);
			(0,internal/* append */.R3)(div, t15);
			(0,internal/* append */.R3)(div, pre8);
			(0,internal/* append */.R3)(pre8, t16);
			(0,internal/* append */.R3)(div, t17);
			(0,internal/* append */.R3)(div, pre9);
			(0,internal/* append */.R3)(pre9, t18);
		},
		p(ctx, [dirty]) {
			if (dirty & /*$pedalMap*/ 1 && t0_value !== (t0_value = JSON.stringify(/*$pedalMap*/ ctx[0]) + "")) (0,internal/* set_data */.rT)(t0, t0_value);
			if (dirty & /*$pedalMapSerial*/ 2 && t2_value !== (t2_value = JSON.stringify(/*$pedalMapSerial*/ ctx[1]) + "")) (0,internal/* set_data */.rT)(t2, t2_value);
			if (dirty & /*$calibrationMap*/ 4 && t4_value !== (t4_value = JSON.stringify(/*$calibrationMap*/ ctx[2]) + "")) (0,internal/* set_data */.rT)(t4, t4_value);
			if (dirty & /*$calibrationMapSerial*/ 8 && t6_value !== (t6_value = JSON.stringify(/*$calibrationMapSerial*/ ctx[3]) + "")) (0,internal/* set_data */.rT)(t6, t6_value);
			if (dirty & /*$invertedMap*/ 16 && t8_value !== (t8_value = JSON.stringify(/*$invertedMap*/ ctx[4]) + "")) (0,internal/* set_data */.rT)(t8, t8_value);
			if (dirty & /*$invertedMapSerial*/ 32 && t10_value !== (t10_value = JSON.stringify(/*$invertedMapSerial*/ ctx[5]) + "")) (0,internal/* set_data */.rT)(t10, t10_value);
			if (dirty & /*$smoothMap*/ 64 && t12_value !== (t12_value = JSON.stringify(/*$smoothMap*/ ctx[6]) + "")) (0,internal/* set_data */.rT)(t12, t12_value);
			if (dirty & /*$smoothMapSerial*/ 128 && t14_value !== (t14_value = JSON.stringify(/*$smoothMapSerial*/ ctx[7]) + "")) (0,internal/* set_data */.rT)(t14, t14_value);
			if (dirty & /*$bitsMap*/ 256 && t16_value !== (t16_value = JSON.stringify(/*$bitsMap*/ ctx[8]) + "")) (0,internal/* set_data */.rT)(t16, t16_value);
			if (dirty & /*$bitsMapSerial*/ 512 && t18_value !== (t18_value = JSON.stringify(/*$bitsMapSerial*/ ctx[9]) + "")) (0,internal/* set_data */.rT)(t18, t18_value);
		},
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div);
		}
	};
}

function Maps_svelte_instance($$self, $$props, $$invalidate) {
	let $pedalMap;
	let $pedalMapSerial;
	let $calibrationMap;
	let $calibrationMapSerial;
	let $invertedMap;
	let $invertedMapSerial;
	let $smoothMap;
	let $smoothMapSerial;
	let $bitsMap;
	let $bitsMapSerial;
	let pedalMap = (0,svelte/* getContext */.fw)("WSC-pedalMap");
	(0,internal/* component_subscribe */.FI)($$self, pedalMap, value => $$invalidate(0, $pedalMap = value));
	let pedalMapSerial = (0,svelte/* getContext */.fw)("WSC-pedalMapSerial");
	(0,internal/* component_subscribe */.FI)($$self, pedalMapSerial, value => $$invalidate(1, $pedalMapSerial = value));
	let calibrationMap = (0,svelte/* getContext */.fw)("WSC-calibrationMap");
	(0,internal/* component_subscribe */.FI)($$self, calibrationMap, value => $$invalidate(2, $calibrationMap = value));
	let calibrationMapSerial = (0,svelte/* getContext */.fw)("WSC-calibrationMapSerial");
	(0,internal/* component_subscribe */.FI)($$self, calibrationMapSerial, value => $$invalidate(3, $calibrationMapSerial = value));
	let invertedMap = (0,svelte/* getContext */.fw)("WSC-invertedMap");
	(0,internal/* component_subscribe */.FI)($$self, invertedMap, value => $$invalidate(4, $invertedMap = value));
	let invertedMapSerial = (0,svelte/* getContext */.fw)("WSC-invertedMapSerial");
	(0,internal/* component_subscribe */.FI)($$self, invertedMapSerial, value => $$invalidate(5, $invertedMapSerial = value));
	let smoothMap = (0,svelte/* getContext */.fw)("WSC-smoothMap");
	(0,internal/* component_subscribe */.FI)($$self, smoothMap, value => $$invalidate(6, $smoothMap = value));
	let smoothMapSerial = (0,svelte/* getContext */.fw)("WSC-smoothMapSerial");
	(0,internal/* component_subscribe */.FI)($$self, smoothMapSerial, value => $$invalidate(7, $smoothMapSerial = value));
	let bitsMap = (0,svelte/* getContext */.fw)("WSC-bitsMap");
	(0,internal/* component_subscribe */.FI)($$self, bitsMap, value => $$invalidate(8, $bitsMap = value));
	let bitsMapSerial = (0,svelte/* getContext */.fw)("WSC-bitsMapSerial");
	(0,internal/* component_subscribe */.FI)($$self, bitsMapSerial, value => $$invalidate(9, $bitsMapSerial = value));

	pedalMap.subscribe(newValue => {
		console.log(newValue);
	});

	return [
		$pedalMap,
		$pedalMapSerial,
		$calibrationMap,
		$calibrationMapSerial,
		$invertedMap,
		$invertedMapSerial,
		$smoothMap,
		$smoothMapSerial,
		$bitsMap,
		$bitsMapSerial,
		pedalMap,
		pedalMapSerial,
		calibrationMap,
		calibrationMapSerial,
		invertedMap,
		invertedMapSerial,
		smoothMap,
		smoothMapSerial,
		bitsMap,
		bitsMapSerial
	];
}

class Maps extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, Maps_svelte_instance, Maps_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Maps_svelte = (Maps);
;// CONCATENATED MODULE: ./src/Logging/Logging.svelte
/* src\Logging\Logging.svelte generated by Svelte v3.38.3 */





function Logging_svelte_create_fragment(ctx) {
	let h1;
	let t1;
	let logger;
	let t2;
	let maps;
	let current;
	logger = new Logger_svelte({});
	maps = new Maps_svelte({});

	return {
		c() {
			h1 = (0,internal/* element */.bG)("h1");
			h1.textContent = "Logging";
			t1 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(logger.$$.fragment);
			t2 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(maps.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, h1, anchor);
			(0,internal/* insert */.$T)(target, t1, anchor);
			(0,internal/* mount_component */.ye)(logger, target, anchor);
			(0,internal/* insert */.$T)(target, t2, anchor);
			(0,internal/* mount_component */.ye)(maps, target, anchor);
			current = true;
		},
		p: internal/* noop */.ZT,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(logger.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(maps.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(logger.$$.fragment, local);
			(0,internal/* transition_out */.et)(maps.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(h1);
			if (detaching) (0,internal/* detach */.og)(t1);
			(0,internal/* destroy_component */.vp)(logger, detaching);
			if (detaching) (0,internal/* detach */.og)(t2);
			(0,internal/* destroy_component */.vp)(maps, detaching);
		}
	};
}

class Logging extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, null, Logging_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const Logging_svelte = (Logging);
;// CONCATENATED MODULE: ./src/About/About.svelte
/* src\About\About.svelte generated by Svelte v3.38.3 */


function About_svelte_create_fragment(ctx) {
	let p0;
	let p1;
	let t3;
	let p2;
	let p3;
	let t12;
	let p4;

	return {
		c() {
			p0 = (0,internal/* element */.bG)("p");

			p0.innerHTML = `Thank you for using this open source solution for diy pedals. <br/>
    This is not to be sold its open and free for everyone to use. <br/> 
`;

			p1 = (0,internal/* element */.bG)("p");
			t3 = (0,internal/* space */.Dh)();
			p2 = (0,internal/* element */.bG)("p");

			p2.innerHTML = `You can find executable and arduino code in the following locations <br/>
    Gui executable: <a href="https://github.com/vospascal/pedal-gui">pedal-gui</a>  <br/>
    Arduino code that works with the gui exe file: <a href="https://github.com/vospascal/pedal-arduino/">pedal-arduino</a>  <br/> 
`;

			p3 = (0,internal/* element */.bG)("p");
			t12 = (0,internal/* space */.Dh)();
			p4 = (0,internal/* element */.bG)("p");

			p4.innerHTML = `If you like it please consider a donation to further development. <br/> 
    <a href="paypal.com/donate/?business=TBPE6XCB2XBMW&amp;item_name=pedalbox&amp;currency_code=EUR">donate on
        paypal</a>`;
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, p0, anchor);
			(0,internal/* insert */.$T)(target, p1, anchor);
			(0,internal/* insert */.$T)(target, t3, anchor);
			(0,internal/* insert */.$T)(target, p2, anchor);
			(0,internal/* insert */.$T)(target, p3, anchor);
			(0,internal/* insert */.$T)(target, t12, anchor);
			(0,internal/* insert */.$T)(target, p4, anchor);
		},
		p: internal/* noop */.ZT,
		i: internal/* noop */.ZT,
		o: internal/* noop */.ZT,
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(p0);
			if (detaching) (0,internal/* detach */.og)(p1);
			if (detaching) (0,internal/* detach */.og)(t3);
			if (detaching) (0,internal/* detach */.og)(p2);
			if (detaching) (0,internal/* detach */.og)(p3);
			if (detaching) (0,internal/* detach */.og)(t12);
			if (detaching) (0,internal/* detach */.og)(p4);
		}
	};
}

class About extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, null, About_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const About_svelte = (About);
;// CONCATENATED MODULE: ./src/App.svelte
/* src\App.svelte generated by Svelte v3.38.3 */











function create_default_slot_11(ctx) {
	let p;

	return {
		c() {
			p = (0,internal/* element */.bG)("p");

			p.innerHTML = `Your arduino is not <u>connected</u>! <br/>
                    Please <u>connect</u> to your arduino,  <br/><br/>

                    When you make changes or calibrate the pedals, <br/>
                    dont forget to <u>save</u> it to the arduino <br/><br/>

                    When <u>connected</u> this message will disappear. <br/>  <br/>

                    Drive safe and have fun! <br/><br/>

                    The arduino code is found <a href="https://github.com/vospascal/pedal-arduino/">here</a>`;

			(0,internal/* set_style */.cz)(p, "text-align", "center");
			(0,internal/* set_style */.cz)(p, "font-size", "18px");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, p, anchor);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(p);
		}
	};
}

// (35:20) <Tab>
function create_default_slot_10(ctx) {
	let t;

	return {
		c() {
			t = (0,internal/* text */.fL)("Pedals");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, t, anchor);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(t);
		}
	};
}

// (36:20) <Tab>
function create_default_slot_9(ctx) {
	let t;

	return {
		c() {
			t = (0,internal/* text */.fL)("Calibration");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, t, anchor);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(t);
		}
	};
}

// (37:20) <Tab>
function create_default_slot_8(ctx) {
	let t;

	return {
		c() {
			t = (0,internal/* text */.fL)("Logging");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, t, anchor);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(t);
		}
	};
}

// (38:20) <Tab>
function create_default_slot_7(ctx) {
	let t;

	return {
		c() {
			t = (0,internal/* text */.fL)("About");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, t, anchor);
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(t);
		}
	};
}

// (34:16) <TabList>
function create_default_slot_6(ctx) {
	let tab0;
	let t0;
	let tab1;
	let t1;
	let tab2;
	let t2;
	let tab3;
	let current;

	tab0 = new Tab_svelte({
			props: {
				$$slots: { default: [create_default_slot_10] },
				$$scope: { ctx }
			}
		});

	tab1 = new Tab_svelte({
			props: {
				$$slots: { default: [create_default_slot_9] },
				$$scope: { ctx }
			}
		});

	tab2 = new Tab_svelte({
			props: {
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			}
		});

	tab3 = new Tab_svelte({
			props: {
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			(0,internal/* create_component */.YC)(tab0.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tab1.$$.fragment);
			t1 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tab2.$$.fragment);
			t2 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tab3.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(tab0, target, anchor);
			(0,internal/* insert */.$T)(target, t0, anchor);
			(0,internal/* mount_component */.ye)(tab1, target, anchor);
			(0,internal/* insert */.$T)(target, t1, anchor);
			(0,internal/* mount_component */.ye)(tab2, target, anchor);
			(0,internal/* insert */.$T)(target, t2, anchor);
			(0,internal/* mount_component */.ye)(tab3, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const tab0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tab0_changes.$$scope = { dirty, ctx };
			}

			tab0.$set(tab0_changes);
			const tab1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tab1_changes.$$scope = { dirty, ctx };
			}

			tab1.$set(tab1_changes);
			const tab2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tab2_changes.$$scope = { dirty, ctx };
			}

			tab2.$set(tab2_changes);
			const tab3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tab3_changes.$$scope = { dirty, ctx };
			}

			tab3.$set(tab3_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(tab0.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tab1.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tab2.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tab3.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(tab0.$$.fragment, local);
			(0,internal/* transition_out */.et)(tab1.$$.fragment, local);
			(0,internal/* transition_out */.et)(tab2.$$.fragment, local);
			(0,internal/* transition_out */.et)(tab3.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(tab0, detaching);
			if (detaching) (0,internal/* detach */.og)(t0);
			(0,internal/* destroy_component */.vp)(tab1, detaching);
			if (detaching) (0,internal/* detach */.og)(t1);
			(0,internal/* destroy_component */.vp)(tab2, detaching);
			if (detaching) (0,internal/* detach */.og)(t2);
			(0,internal/* destroy_component */.vp)(tab3, detaching);
		}
	};
}

// (41:16) <TabPanel>
function create_default_slot_5(ctx) {
	let pedals;
	let current;
	pedals = new Pedals_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(pedals.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(pedals, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(pedals.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(pedals.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(pedals, detaching);
		}
	};
}

// (45:16) <TabPanel>
function create_default_slot_4(ctx) {
	let calibration;
	let current;
	calibration = new Calibration_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(calibration.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(calibration, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(calibration.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(calibration.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(calibration, detaching);
		}
	};
}

// (49:16) <TabPanel>
function create_default_slot_3(ctx) {
	let logging;
	let current;
	logging = new Logging_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(logging.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(logging, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(logging.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(logging.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(logging, detaching);
		}
	};
}

// (53:16) <TabPanel>
function App_svelte_create_default_slot_2(ctx) {
	let about;
	let current;
	about = new About_svelte({});

	return {
		c() {
			(0,internal/* create_component */.YC)(about.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(about, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(about.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(about.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(about, detaching);
		}
	};
}

// (33:12) <Tabs>
function App_svelte_create_default_slot_1(ctx) {
	let tablist;
	let t0;
	let tabpanel0;
	let t1;
	let tabpanel1;
	let t2;
	let tabpanel2;
	let t3;
	let tabpanel3;
	let current;

	tablist = new TabList_svelte({
			props: {
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			}
		});

	tabpanel0 = new TabPanel_svelte({
			props: {
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			}
		});

	tabpanel1 = new TabPanel_svelte({
			props: {
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			}
		});

	tabpanel2 = new TabPanel_svelte({
			props: {
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			}
		});

	tabpanel3 = new TabPanel_svelte({
			props: {
				$$slots: { default: [App_svelte_create_default_slot_2] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			(0,internal/* create_component */.YC)(tablist.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tabpanel0.$$.fragment);
			t1 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tabpanel1.$$.fragment);
			t2 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tabpanel2.$$.fragment);
			t3 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tabpanel3.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(tablist, target, anchor);
			(0,internal/* insert */.$T)(target, t0, anchor);
			(0,internal/* mount_component */.ye)(tabpanel0, target, anchor);
			(0,internal/* insert */.$T)(target, t1, anchor);
			(0,internal/* mount_component */.ye)(tabpanel1, target, anchor);
			(0,internal/* insert */.$T)(target, t2, anchor);
			(0,internal/* mount_component */.ye)(tabpanel2, target, anchor);
			(0,internal/* insert */.$T)(target, t3, anchor);
			(0,internal/* mount_component */.ye)(tabpanel3, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const tablist_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tablist_changes.$$scope = { dirty, ctx };
			}

			tablist.$set(tablist_changes);
			const tabpanel0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tabpanel0_changes.$$scope = { dirty, ctx };
			}

			tabpanel0.$set(tabpanel0_changes);
			const tabpanel1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tabpanel1_changes.$$scope = { dirty, ctx };
			}

			tabpanel1.$set(tabpanel1_changes);
			const tabpanel2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tabpanel2_changes.$$scope = { dirty, ctx };
			}

			tabpanel2.$set(tabpanel2_changes);
			const tabpanel3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tabpanel3_changes.$$scope = { dirty, ctx };
			}

			tabpanel3.$set(tabpanel3_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(tablist.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tabpanel0.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tabpanel1.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tabpanel2.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tabpanel3.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(tablist.$$.fragment, local);
			(0,internal/* transition_out */.et)(tabpanel0.$$.fragment, local);
			(0,internal/* transition_out */.et)(tabpanel1.$$.fragment, local);
			(0,internal/* transition_out */.et)(tabpanel2.$$.fragment, local);
			(0,internal/* transition_out */.et)(tabpanel3.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(tablist, detaching);
			if (detaching) (0,internal/* detach */.og)(t0);
			(0,internal/* destroy_component */.vp)(tabpanel0, detaching);
			if (detaching) (0,internal/* detach */.og)(t1);
			(0,internal/* destroy_component */.vp)(tabpanel1, detaching);
			if (detaching) (0,internal/* detach */.og)(t2);
			(0,internal/* destroy_component */.vp)(tabpanel2, detaching);
			if (detaching) (0,internal/* detach */.og)(t3);
			(0,internal/* destroy_component */.vp)(tabpanel3, detaching);
		}
	};
}

// (15:4) <WebSerialContext>
function App_svelte_create_default_slot(ctx) {
	let buttons;
	let t0;
	let div;
	let overlay;
	let t1;
	let tabs;
	let current;
	buttons = new Buttons_svelte({});

	overlay = new Overlay_svelte({
			props: {
				$$slots: { default: [create_default_slot_11] },
				$$scope: { ctx }
			}
		});

	tabs = new Tabs_svelte({
			props: {
				$$slots: { default: [App_svelte_create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			(0,internal/* create_component */.YC)(buttons.$$.fragment);
			t0 = (0,internal/* space */.Dh)();
			div = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(overlay.$$.fragment);
			t1 = (0,internal/* space */.Dh)();
			(0,internal/* create_component */.YC)(tabs.$$.fragment);
			(0,internal/* set_style */.cz)(div, "position", "relative");
			(0,internal/* set_style */.cz)(div, "padding", "10px");
		},
		m(target, anchor) {
			(0,internal/* mount_component */.ye)(buttons, target, anchor);
			(0,internal/* insert */.$T)(target, t0, anchor);
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* mount_component */.ye)(overlay, div, null);
			(0,internal/* append */.R3)(div, t1);
			(0,internal/* mount_component */.ye)(tabs, div, null);
			current = true;
		},
		p(ctx, dirty) {
			const overlay_changes = {};

			if (dirty & /*$$scope*/ 1) {
				overlay_changes.$$scope = { dirty, ctx };
			}

			overlay.$set(overlay_changes);
			const tabs_changes = {};

			if (dirty & /*$$scope*/ 1) {
				tabs_changes.$$scope = { dirty, ctx };
			}

			tabs.$set(tabs_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(buttons.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(overlay.$$.fragment, local);
			(0,internal/* transition_in */.Ui)(tabs.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(buttons.$$.fragment, local);
			(0,internal/* transition_out */.et)(overlay.$$.fragment, local);
			(0,internal/* transition_out */.et)(tabs.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.vp)(buttons, detaching);
			if (detaching) (0,internal/* detach */.og)(t0);
			if (detaching) (0,internal/* detach */.og)(div);
			(0,internal/* destroy_component */.vp)(overlay);
			(0,internal/* destroy_component */.vp)(tabs);
		}
	};
}

function App_svelte_create_fragment(ctx) {
	let div;
	let webserialcontext;
	let current;

	webserialcontext = new WebSerialContext_svelte({
			props: {
				$$slots: { default: [App_svelte_create_default_slot] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div = (0,internal/* element */.bG)("div");
			(0,internal/* create_component */.YC)(webserialcontext.$$.fragment);
			(0,internal/* set_style */.cz)(div, "width", "900px");
			(0,internal/* set_style */.cz)(div, "margin", "0 auto");
		},
		m(target, anchor) {
			(0,internal/* insert */.$T)(target, div, anchor);
			(0,internal/* mount_component */.ye)(webserialcontext, div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const webserialcontext_changes = {};

			if (dirty & /*$$scope*/ 1) {
				webserialcontext_changes.$$scope = { dirty, ctx };
			}

			webserialcontext.$set(webserialcontext_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.Ui)(webserialcontext.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.et)(webserialcontext.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) (0,internal/* detach */.og)(div);
			(0,internal/* destroy_component */.vp)(webserialcontext);
		}
	};
}

class App extends internal/* SvelteComponent */.f_ {
	constructor(options) {
		super();
		(0,internal/* init */.S1)(this, options, null, App_svelte_create_fragment, internal/* safe_not_equal */.N8, {});
	}
}

/* harmony default export */ const App_svelte = (App);
;// CONCATENATED MODULE: ./src/bootstrap.js

const app = new App_svelte({
  target: document.getElementById("app")
});
window.app = app;
/* harmony default export */ const bootstrap = (app);

/***/ })

}]);
//# sourceMappingURL=381.js.map