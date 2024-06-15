
import GenericRepository from "./generic.repository.js";

export default class UserRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getUserByEmail = (email) => {
        return this.getBy({ email });
    }

    getUserById = (id) => {
        return this.getBy({ _id: id })
    }

    setResetLink = (id, resetLink) => {
        return this.dao.setResetLink(id, resetLink);
    }

}