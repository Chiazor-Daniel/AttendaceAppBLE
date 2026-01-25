// FIX: Remove 'NativeModulesProxy' as it's not used directly.
// FIX: The type for a subscription is simply 'Subscription'.
import { EventEmitter } from 'expo-modules-core';
import BitchatModule from './BitchatModule';
// --- Main Class ---
class BitchatAPI {
    // This now correctly satisfies the 'EventsMap' constraint.
    eventEmitter = new EventEmitter(BitchatModule);
    // --- Core Service Lifecycle & State ---
    async startServices(nickname) {
        await BitchatModule.setNickname(nickname);
        return await BitchatModule.startServices();
    }
    async stopServices() {
        return await BitchatModule.stopServices();
    }
    // --- Message Sending & Channel Management ---
    async sendMessage(content, mentions = [], channel) {
        await BitchatModule.sendMessage(content, mentions, channel);
    }
    async sendPrivateMessage(content, recipientPeerID, recipientNickname) {
        await BitchatModule.sendPrivateMessage(content, recipientPeerID, recipientNickname);
    }
    async setChannelPassword(channel, password) {
        await BitchatModule.setChannelPassword(channel, password ?? "");
    }
    // --- Getters ---
    getConnectedPeers() {
        return BitchatModule.getConnectedPeers();
    }
    // --- Event Listener Registration ---
    // FIX #2: The return types now correctly point to our manually defined Subscription interface.
    addMessageListener(listener) {
        return this.eventEmitter.addListener('onMessageReceived', listener);
    }
    addPeerConnectedListener(listener) {
        return this.eventEmitter.addListener('onPeerConnected', listener);
    }
    addPeerDisconnectedListener(listener) {
        return this.eventEmitter.addListener('onPeerDisconnected', listener);
    }
    addPeerListUpdatedListener(listener) {
        return this.eventEmitter.addListener('onPeerListUpdated', listener);
    }
    addDeliveryAckListener(listener) {
        return this.eventEmitter.addListener('onDeliveryAck', listener);
    }
    addReadReceiptListener(listener) {
        return this.eventEmitter.addListener('onReadReceipt', listener);
    }
    addDeliveryStatusUpdateListener(listener) {
        return this.eventEmitter.addListener('onDeliveryStatusUpdate', listener);
    }
}
// Export a singleton instance for easy use in your app
export default new BitchatAPI();
//# sourceMappingURL=index.js.map