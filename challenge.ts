async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

async function randomDelay() {
    const randomTime = Math.round(Math.random() * 1000)
    return sleep(randomTime)
}

class ShipmentSearchIndex {
    async updateShipment(id: string, shipmentData: any) {
        const startTime = new Date()
        await randomDelay()
        const endTime = new Date()
        console.log(`update ${id}@${
            startTime.toISOString()
            } finished@${
            endTime.toISOString()
            }`
        )

        return { startTime, endTime }
    }
}

// Implementation needed
interface ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any)
}


// Solution
class ShipmentUpdaterQueue {
    private queue: Array<String> = []

    // Returns the length of the queue
    size(): number {
        return this.queue.length;
    }

    // Check if queue is empty
    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    /**
     * Returns the first item in the queue
     * Returns null if queue is empty
     */
    peek(): String | null {
        return !this.isEmpty() ? this.queue[0] : null;
    }

    // Check if item is in queue
    isInQueue(key: String): boolean {
        return this.queue.includes(key);
    }

    // Add item to queue
    enqueue(key: String): void {
        this.queue.push(key);
    }

    //Remove first item from queue
    dequeue(): void {
        if (!this.isEmpty()) {
            this.queue.splice(0, 1);
        } else {
            throw new Error('Cannot dequeue an empty queue');
        }
    }

}

class ShipmentUpdateListener implements ShipmentUpdateListenerInterface {

    // Queue to pass in updates
    private shipementUpdaterQueue: ShipmentUpdaterQueue = new ShipmentUpdaterQueue();

    async receiveUpdate(id: string, shipmentData: any) {

        // Handle scenario if id / shipmentData is empty / null / undefined
        if (!id || !shipmentData) {
            let errorMessage = !id ? 'ERROR: Shipment Id cannot be empty\n' : ''
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
            await shipmentSearchIndex.updateShipment(id, shipmentData);

            // Remove Shipment from queue
            this.shipementUpdaterQueue.dequeue();

            console.log(`update ${id} successful`);
        } catch (error) {
            console.error(`ERROR: update ${id} failed`);
            console.error(error.stack);
        }
    }
}


const shipmentUpdateListenerService = new ShipmentUpdateListener();
shipmentUpdateListenerService.receiveUpdate('1', { some: 'data' });
shipmentUpdateListenerService.receiveUpdate('1', { some: 'data' });
shipmentUpdateListenerService.receiveUpdate('2', { some: 'data' });
shipmentUpdateListenerService.receiveUpdate(null, null);