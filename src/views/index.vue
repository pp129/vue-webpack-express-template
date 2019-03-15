<template>
    <div>
        <!-- get all user -->
        <div>
            <button @click="getUserInfo()">get users</button>
            <div v-if="showUserInfo">
                <ul>
                    <li v-for="user in userInfo">
                        <span>user_id:{{ user.user_id }}</span>
                        <span>user_name:{{ user.user_name }}</span>
                        <span>user_password:{{ user.user_password }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <hr />
        <!-- add user -->
        <div>
            <ul>
                <li>
                    <label>
                        name
                        <input type="text" v-model="newUser.name" />
                    </label>
                </li>
                <li>
                    <label>
                        password
                        <input type="text" v-model="newUser.password" />
                    </label>
                </li>
            </ul>
            <button @click="addUser">add users</button>
        </div>
        <hr />
        <!-- get user by id -->
        <div>
            <label>
                id:
                <input type="text" v-model="userId" />
            </label>
            <button @click="getUserById">get user by id</button>
            <div v-if="showUserById">
                <span>user_id:{{ userInfoById.user_id }}</span>
                <span>user_name:{{ userInfoById.user_name }}</span>
                <span>user_password:{{ userInfoById.user_password }}</span>
            </div>
        </div>
        <hr />
        <!-- update user -->
        <div>
            <label>id: <input type="text" v-model="updateUser.uid" /> </label>
            <label
                >user name <input type="text" v-model="updateUser.name" />
            </label>
            <label
                >password <input type="text" v-model="updateUser.password" />
            </label>
            <label
                >new password<input type="text" v-model="updateUser.newPassword"
            /></label>
            <button @click="updateUserInfo">update user info</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import util from "@/js/lib/util";
export default {
    name: "index",
    data() {
        return {
            showUserInfo: false,
            userInfo: [],
            newUser: {
                uid: null,
                name: null,
                password: null
            },
            userId: null,
            showUserById: false,
            userInfoById: {},
            updateUser: {
                uid: null,
                name: null,
                password: null,
                newPassword: null
            }
        };
    },
    methods: {
        getUserInfo() {
            axios
                .get("/users/getUser")
                .then(res => {
                    let data = util.verifyResponse(res);
                    if (data && data.length > 0) {
                        this.showUserInfo = true;
                        /**
                         * @param userInfo.user_id
                         * @param userInfo.user_name
                         * @param userInfo.user_password
                         * */
                        this.userInfo = data;
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },
        getUserById() {
            if (this.userId) {
                axios
                    .get("/users/getUserById", {
                        params: {
                            uid: this.userId
                        }
                    })
                    .then(res => {
                        let data = util.verifyResponse(res);
                        if (data) {
                            this.showUserById = true;
                            this.userInfoById = data;
                        } else {
                            this.showUserById = false;
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        addUser() {
            if (this.newUser.name && this.newUser.password) {
                axios
                    .post("/users/addUser", this.newUser)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        updateUserInfo() {
            if (this.updateUser.uid && this.updateUser.password) {
                axios
                    .post("users/updateUser", this.updateUser)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
    }
};
</script>

<style scoped></style>
