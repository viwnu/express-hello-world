const DynamoDb = require("@cyclic.sh/dynamodb")

const db = DynamoDb("tiny-blue-hatchling-robeCyclicDB")
const agregations = db.collection("agregations")

module.exports.readBundle = async (filePath) => {
    const bundle = await agregations.list()
    console.log('in readBundle', bundle)
    return bundle
}

module.exports.writeBundle = async (filePath, data) => {
    console.log('in writeBundle', data)
    await agregations.set(data.id, data)
}

module.exports.deleteBundle = async (filePath, id) => {
    console.log('in deleteBundle', id)
    await agregations.delete(id)
}
