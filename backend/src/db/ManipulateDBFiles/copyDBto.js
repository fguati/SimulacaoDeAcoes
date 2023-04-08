const fs = require('fs')

function copyDB(db) {
    return {
        to(backUp) {
            const readStream = fs.createReadStream(db);
            const writeStream = fs.createWriteStream(backUp);
            
            readStream.pipe(writeStream);
            
            // Log a success message when the copy is complete
            writeStream.on('finish', function() {
              console.log(`File "${db}" copied to "${backUp}"`);
            });

        }
    }
}

module.exports = copyDB