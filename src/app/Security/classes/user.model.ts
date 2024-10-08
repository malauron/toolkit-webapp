export class User {
    constructor(
        public userId?: number,
        public username?: string,
        public password?: string,
        public fullName?: string,
        public email?: string,
        public accountNonExpired?: boolean,
        public accountNonLocked?: boolean,
        public credentialsNonExpired?: boolean,
        public enabled?: boolean
    ){}
}
