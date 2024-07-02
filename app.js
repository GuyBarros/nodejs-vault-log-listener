const net = require('net');
const fs = require('fs');
const path = require('path');

const PORT =  process.env.AUDIT_PORT || 9090;

const server = net.createServer((socket) => {
    console.log('Client connected');

    let dataBuffer = '';

    socket.on('data', (data) => {
        dataBuffer += data.toString();
        console.log('Received data chunk:', data.toString());
        try {
            console.log('Full data received:', dataBuffer);

            // Replace escaped quotes with standard quotes
            const cleanedDataBuffer = dataBuffer.replace(/\\"/g, '"');
            console.log('Cleaned data buffer:', cleanedDataBuffer);

            // Split data into individual JSON strings
            const sanitizedData = cleanedDataBuffer
                .split('\n')
                .filter(line => line.trim() !== '') // Remove empty lines
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        return null;
                    }
                })
                .filter(item => item !== null); // Remove invalid JSON

            console.log('Sanitized data:', sanitizedData);

            if (sanitizedData.length > 0) {
                // Generate a timestamp for the file name
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const fileName = `data_${timestamp}.json`;

                // Define the path to the file where data will be written
                const filePath = path.join(__dirname, fileName);
//////////////////
/// set business logic here.

//////////////////
                // Write JSON data to file
                fs.writeFile(filePath, JSON.stringify(sanitizedData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        socket.write('Internal Server Error');
                    } else {
                        console.log('Data written to file successfully:', filePath);
                        socket.write('Data received and written to file successfully.');
                    }
                });
            } else {
                console.log('No valid JSON data received.');
                socket.write('No valid JSON data received.');
            }
        } catch (error) {
            console.error('Error processing data:', error);
            socket.write('Error processing data.');
        }
    });

    socket.on('end', () => {
        
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
