class apiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }
    filter() {
        // console.log(this.queryStr)
        const queryCopy = {...this.queryStr}
        //  console.log(queryCopy)
        const removeFields = ["keyword", "page", "limit"]
        removeFields.forEach((key) => delete queryCopy[key])
        // console.log(queryCopy)

        let queryStr = JSON.stringify(queryCopy)
        // console.log(queryStr)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

        // console.log(queryStr)

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(resultPerPage) {
        // console.log(this.queryStr)
        const currentPage = Number(this.queryStr.page) || 1
        // console.log(currentPage)
        const skip = resultPerPage * (currentPage - 1)
        // console.log(skip)
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}

export default apiFeatures