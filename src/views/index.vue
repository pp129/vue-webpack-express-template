<template>
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
        <div>
            <ul>
                <li>
                    <label>
                        id
                        <input type="text" v-model="newUser.uid" />
                    </label>
                </li>
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
        addUser() {
            if (
                this.newUser.uid &&
                this.newUser.name &&
                this.newUser.password
            ) {
                axios
                    .post("/users/addUser", this.newUser)
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
