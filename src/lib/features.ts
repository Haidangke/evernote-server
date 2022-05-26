class APIfeatures {
    query: any;
    queryString: any;
    constructor(query: any, queryString: any) {
        this.query = query;
        this.queryString = queryString;
    }

    pagination = () => {
        const page = Number(this.queryString._page) || 1;
        const limit = Number(this.queryString._limit) || 20;
        const skip = limit * (page - 1);

        this.query = this.query.limit(limit).skip(skip);
        return this;
    };

    sort = () => {
        const sort = this.queryString._sort || '-createdAt';

        this.query = this.query.sort(sort);
        return this;
    };

    search = () => {
        const search = this.queryString._search || '';
        if (search) {
            this.query = this.query.find({ $text: { $search: search } });
        } else {
            this.query = this.query.find();
        }
        return this;
    };

    filterKey = (excludeFields: string[]) => {
        const queryObj = { ...this.queryString };

        excludeFields.forEach((field) => {
            delete queryObj[field];
        });
        this.queryString = queryObj;
        return this;
    };

    filter() {
        let queryStr = JSON.stringify(this.queryString);
        queryStr = queryStr.replace(/\b(?:gte|gt|lt|lte|regex)\b/g, (match) => '$' + match);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
}

export default APIfeatures;
