/**
 * IoT Service
 * Handles connection to the IoT data service and provides methods for interacting with IoT devices
 */

// WebSocket connection to IoT data service
let wsConnection = null;
let reconnectAttempts = 0;
let reconnectTimeout = null;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds

/**
 * Connect to the IoT data service
 * @param {Object} callbacks - Callback functions for WebSocket events
 * @param {Function} callbacks.onOpen - Called when connection is established
 * @param {Function} callbacks.onMessage - Called when a message is received
 * @param {Function} callbacks.onClose - Called when connection is closed
 * @param {Function} callbacks.onError - Called when an error occurs
 * @returns {WebSocket} The WebSocket connection
 */
export function connectToIoTService(callbacks = {}) {
  // Close existing connection if any
  if (wsConnection && wsConnection.readyState !== WebSocket.CLOSED) {
    wsConnection.close();
  }
  
  // Reset reconnect attempts
  reconnectAttempts = 0;
  
  // Create new connection
  const connect = () => {
    try {
      // In development, connect to localhost
      // In production, connect to the actual service
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.touristsafety.io/iot'
        : 'ws://localhost:3002';
      
      wsConnection = new WebSocket(wsUrl);
      
      wsConnection.onopen = (event) => {
        console.log('Connected to IoT data service');
        reconnectAttempts = 0;
        if (callbacks.onOpen) callbacks.onOpen(event);
      };
      
      wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (callbacks.onMessage) callbacks.onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsConnection.onclose = (event) => {
        console.log('Disconnected from IoT data service');
        if (callbacks.onClose) callbacks.onClose(event);
        
        // Attempt to reconnect
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
          reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
        } else {
          console.error('Max reconnect attempts reached. Please try again later.');
        }
      };
      
      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (callbacks.onError) callbacks.onError(error);
      };
      
      return wsConnection;
    } catch (error) {
      console.error('Error connecting to IoT data service:', error);
      if (callbacks.onError) callbacks.onError(error);
      return null;
    }
  };
  
  return connect();
}

/**
 * Disconnect from the IoT data service
 */
export function disconnectFromIoTService() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  
  if (wsConnection) {
    wsConnection.close();
    wsConnection = null;
  }
}

/**
 * Send a message to the IoT data service
 * @param {Object} message - The message to send
 * @returns {boolean} True if the message was sent, false otherwise
 */
export function sendMessage(message) {
  if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
    console.error('Cannot send message: WebSocket is not connected');
    return false;
  }
  
  try {
    wsConnection.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

/**
 * Get the current connection status
 * @returns {string} The current connection status (connected, connecting, disconnected, error)
 */
export function getConnectionStatus() {
  if (!wsConnection) return 'disconnected';
  
  switch (wsConnection.readyState) {
    case WebSocket.CONNECTING:
      return 'connecting';
    case WebSocket.OPEN:
      return 'connected';
    case WebSocket.CLOSING:
    case WebSocket.CLOSED:
      return 'disconnected';
    default:
      return 'error';
  }
}

/**
 * Subscribe to a specific IoT device
 * @param {string} deviceId - The ID of the device to subscribe to
 * @returns {boolean} True if the subscription request was sent, false otherwise
 */
export function subscribeToDevice(deviceId) {
  return sendMessage({
    type: 'subscribe',
    channel: `device:${deviceId}`
  });
}

/**
 * Send a command to an IoT device
 * @param {string} deviceId - The ID of the device to send the command to
 * @param {string} command - The command to send
 * @param {Object} params - The parameters for the command
 * @returns {boolean} True if the command was sent, false otherwise
 */
export function sendDeviceCommand(deviceId, command, params = {}) {
  return sendMessage({
    type: 'device_command',
    deviceId,
    command,
    params
  });
}

/**
 * Request historical data for a device
 * @param {string} deviceId - The ID of the device to get data for
 * @param {Object} options - Options for the request
 * @param {number} options.limit - The maximum number of records to return
 * @param {string} options.startTime - The start time for the data (ISO string)
 * @param {string} options.endTime - The end time for the data (ISO string)
 * @returns {boolean} True if the request was sent, false otherwise
 */
export function requestDeviceHistory(deviceId, options = {}) {
  return sendMessage({
    type: 'device_history',
    deviceId,
    options
  });
}

/**
 * Request heatmap data for all devices
 * @param {Object} options - Options for the request
 * @param {string} options.timeframe - The timeframe for the data (e.g. '1h', '24h', '7d')
 * @returns {boolean} True if the request was sent, false otherwise
 */
export function requestHeatmapData(options = {}) {
  return sendMessage({
    type: 'heatmap_data',
    options
  });
}