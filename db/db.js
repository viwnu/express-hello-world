const DynamoDb = require("@cyclic.sh/dynamodb")
import DynamoDb from "cyclic-dynamodb";

const db = DynamoDb("tiny-blue-hatchling-robeCyclicDB")
const agregations = db.collection("agregations")

const readBundle = async (filePath) => {
    const bundle = await agregations.list()
    console.log('in readBundle', bundle)
    return bundle
}

const writeBundle = async (filePath, data) => {
    console.log('in writeBundle', data)
    await agregations.set(data.id, data)
}

const deleteBundle = async (filePath, id) => {
    console.log('in deleteBundle', id)
    await agregations.delete(id)
}

module.exports = readBundle
module.exports = writeBundle
module.exports = deleteBundle
