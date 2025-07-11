const People = require('../models/People');

const PeopleService = {
    async getAllActive() {
        return await People.find({ status: true });
    },
    async getById(id) {
        return await People.findById(id);
    },
    async updateById(id, data) {
        return await People.findByIdAndUpdate(id, data, { new: true });
    },
    async deactivateById(id) {
        const user = await People.findById(id);
        if (!user) return null;
        user.status = false;
        await user.save();
        return user;
    },
    async create(data) {
        const existing = await People.findOne({ email: data.email });
        if (existing) return null;
        const people = new People(data);
        await people.save();
        return people;
    }
};

module.exports = PeopleService;
