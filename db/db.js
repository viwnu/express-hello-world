const CyclicDb = require("@cyclic.sh/dynamodb")

console.log('CyclicDb: ', CyclicDb)

const db = CyclicDb("tiny-blue-hatchling-robeCyclicDB") // find it on the Database/Storage tab
console.log('db: ', db)
let agregations = db.collection('agregations')

console.log('agregations: ', agregations)

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
