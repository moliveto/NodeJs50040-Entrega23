
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

    SetResetLink = (id, resetLink) => {
        return this.dao.SetResetLink(id, resetLink);
    }

}