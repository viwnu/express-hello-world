
import fs from "fs/promises"


class fileIO {
    constructor(dataFile) {
        this.buf = Buffer.alloc(1024)
        this.dataFile = dataFile
        this.indexFile = this.dataFile.split('.')[0] + 'Index.txt'
    }

    openFile = async () => {
        try {
            this.file = await fs.open(this.dataFile, 'r+')
            await this.readIndex(this.indexFile)
            return this
        } catch(err) {
            try {
                this.file = await fs.open(this.dataFile, 'a+')
                await this.readIndex(this.indexFile)
                return this
            } catch(err) {console.error('in openFile: ' + err)}
        }
    }

    readIndex = async (indexFile) => {
        try {
            const readedIndexes = await fs.readFile(indexFile)
            const indexses = readedIndexes.toString().split(',\n').slice(0,-1).map(obj => JSON.parse(obj))
            this.setIndexses(indexses)
            return(indexses)
        } catch(err) {
            if(err.code == 'ENOENT') {
                const indexses = []
                this.setIndexses(indexses)
                return indexses
            } else {
                console.error('in readIndex: ' + err)
            }
        }
    }

    writeIndex = async (indexses) => {
        try {
            const indexsesStr = indexses.reduce((str, indexItem) => {
                return (str + JSON.stringify(indexItem) + ',\n')
            }, '')
            await fs.writeFile(this.indexFile, indexsesStr)
            return('indexses was written')
        } catch(err) {console.error('in writeIndex: ' + err)}
    }

    setIndexses = (indexses) => {
        this.indexses = indexses
    }

    addIndex = async (dataLength, indexses, defragStrIndex, id = '') => {
        try {
            let position = 0
            let nextIndex = 0

            if(indexses.length) {
                const sortedIndexses = [...indexses].sort((a, b) => {return (a.start - b.end)})
                position = sortedIndexses.reduce((prev, curr) => {
                    if (curr.start - prev.end > dataLength) {
                        return prev
                    } else {return curr}
                }).end
                nextIndex = (defragStrIndex? defragStrIndex: indexses[indexses.length-1].strIndex + 1)
            }

            indexses.push({
                start: position,
                end: position + dataLength,
                strIndex: nextIndex,
                id
            })

            this.setIndexses(indexses)

            return(position)
        } catch(err) {console.error('in addIndex: ' + err)}

    }

    readData = async (lengthToRead, endIndex = this.indexses.length-1) => {
        try {
            const indexses = this.indexses
            const start = endIndex - lengthToRead < 0? -1: endIndex - lengthToRead
            const buf = Buffer.alloc(1024)
            const dataStrings = []

            let indexPositions = []
            for (let i = endIndex; i > start; i--) {indexPositions.push(i)}

            for (const indexPosition of indexPositions) {
                const length = indexses[indexPosition].end - indexses[indexPosition].start
                const bites =  await this.file.read(buf, 0, length, indexses[indexPosition].start)
                dataStrings.push({
                    dataStr: buf.slice(0, bites.bytesRead).toString().slice(0, -1),
                    strIndex: indexses[indexPosition].strIndex
                })
            }
            
            return (dataStrings)
        } catch (err) {'in readData: ' + console.error(err)}
    }

    writeData = async (data, defragStrIndex = 0) => {
        try {
            const indexses = this.indexses
            const dataLength = Buffer.from(data).length+1
            const position = await this.addIndex(dataLength, indexses, defragStrIndex, JSON.parse(data).id)
            
            const written = await this.file.write(data + '\n', position? position: 0)
            
            await this.writeIndex(this.indexses)
            return(await this.readData(1))

        } catch (err) {console.error('in writeData: ' + err)}
    }

    deleteData = async (id = this.indexses[this.indexses.length-1].id) => {
        try {
            const indexses = this.indexses
            const index = indexses.findIndex((index) => index.id == id)
            const strToBeDeleted = await this.readData(1, index)
            if (index >= 0) {
                indexses.splice(index, 1)
                this.setIndexses(indexses)
                this.writeIndex(indexses)
                return (strToBeDeleted)
            } else {return false}
        } catch (err) {console.error('in deleteData: ' + err)}
    }

}

export default fileIO




// дочитать про классы, добавить может публичные и закрытые поля или еще что то если будет нужно
