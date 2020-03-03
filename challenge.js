var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), ms);
        });
    });
}
function randomDelay() {
    return __awaiter(this, void 0, void 0, function* () {
        const randomTime = Math.round(Math.random() * 1000);
        return sleep(randomTime);
    });
}
class ShipmentSearchIndex {
    updateShipment(id, shipmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date();
            yield randomDelay();
            const endTime = new Date();
            console.log(`update ${id}@${startTime.toISOString()} finished@${endTime.toISOString()}`);
            return { startTime, endTime };
        });
    }
}
// Solution
class ShipmentUpdaterQueue {
    constructor() {
        this.queue = [];
    }
    // Returns the length of the queue
    size() {
        return this.queue.length;
    }
    // Check if queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }
    /**
     * Returns the first item in the queue
     * Returns null if queue is empty
     */
    peek() {
        return !this.isEmpty() ? this.queue[0] : null;
    }
    // Check if item is in queue
    isInQueue(key) {
        return this.queue.includes(key);
    }
    // Add item to queue
    enqueue(key) {
        this.queue.push(key);
    }
    //Remove first item from queue
    dequeue() {
        if (!this.isEmpty()) {
            this.queue.splice(0, 1);
        }
        else {
            throw new Error('Cannot dequeue an empty queue');
        }
    }
}
class ShipmentUpdateListener {
    constructor() {
        // Queue to pass in updates
        this.shipementUpdaterQueue = new ShipmentUpdaterQueue();
    }
    receiveUpdate(id, shipmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle scenario if id / shipmentData is empty / null / undefined
            if (!id || !shipmentData) {
                let errorMessage = !id ? 'ERROR: Shipment Id cannot be empty\n' : '';
                errorMessage = !shipmentData ? (errorMessage + 'ERROR: Shipment Data cannot be empty') : errorMessage;
                console.error(errorMessage);
                return;
            }
            //Check if Shipement is in updater queue
            const updateStatus = this.shipementUpdaterQueue.isInQueue(id);
            if (updateStatus) { // If Shipement is in queue
                console.log(`update ${id} already in queue. please try after sometime.`);
                return;
            }
            // Shipement is not in queue
            // Attempt Shipment Update
            try {
                // Add Shipment to updater queue
                this.shipementUpdaterQueue.enqueue(id);
                // Update Shipment
                const shipmentSearchIndex = new ShipmentSearchIndex();
                yield shipmentSearchIndex.updateShipment(id, shipmentData);
                // Remove Shipment from queue
                this.shipementUpdaterQueue.dequeue();
                console.log(`update ${id} successful`);
            }
            catch (error) {
                console.error(`ERROR: update ${id} failed`);
                console.error(error.stack);
            }
        });
    }
}
const shipmentUpdateListenerService = new ShipmentUpdateListener();
shipmentUpdateListenerService.receiveUpdate('1', { some: 'data' });
shipmentUpdateListenerService.receiveUpdate('1', { some: 'data' });
shipmentUpdateListenerService.receiveUpdate('2', { some: 'data' });
shipmentUpdateListenerService.receiveUpdate(null, null);
