const fs = require('fs')

//Function that copies all the data from one db to another: copyDB(dbToBeCopied).to(dbToReceiveData)
function copyDB(db) {
    //returns a function with the purpose of being more readable when used
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