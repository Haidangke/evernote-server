import { Note } from '../models';
import APIfeatures from './features';

class noteAPIfeatures extends APIfeatures {
    filterNote() {
        const query = this.queryString;
        for (const key in query) {
            if (['tags', 'contain'].includes(key)) {
                const queryStr = (query[key] as string).split(',').map((x) => x.trim());
                this.query = this.query.find({ [key]: { $in: queryStr } });
            }

            if (key === 'notebook') {
                const notebook = query[key];
                this.query = this.query.find({ notebook });
            }
        }

        return this;
    }
}

export default noteAPIfeatures;
