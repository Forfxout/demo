<template>
<v-content>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <error-message />

                <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="submit"
                    lazy-validation
                >
                    <v-card
                        v-if="isValidBackend"
                        class="elevation-6"
                        :loading="loginRequesting"
                    >
                        <v-toolbar color="brand">
                            <v-toolbar-title>Login to {{ workspaceName }}</v-toolbar-title>
                        </v-toolbar>

                        <v-card-text v-if="showTokenForm">
                            <v-text-field
                                v-model="secretKey"
                                :rules="secretKeyRules"
                                prepend-icon="fa-key"
                                name="secretKey"
                                label="Secret Key"
                                type="password"
                            />
                            <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                prepend-icon="fa-at"
                                name="email"
                                label="Email"
                                type="text"
                            />
                            <v-text-field
                                v-model="firstName"
                                prepend-icon="fa-user"
                                name="firstName"
                                label="First name"
                                type="text"
                            />
                            <v-text-field
                                v-model="lastName"
                                prepend-icon="fa-user"
                                name="lastName"
                                label="Last name"
                                type="text"
                            />
                        </v-card-text>

                        <v-card-text v-else>
                            <v-text-field
                                v-model="username"
                                :rules="usernameRules"
                                prepend-icon="fa-user"
                                name="username"
                                label="Username"
                                type="text"
                            />
                            <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                prepend-icon="fa-lock"
                                name="password"
                                label="Password"
                                type="password"
                            />
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer />
                            <v-btn :to="{ name: 'select-workspace' }">Other workspace</v-btn>
                            <v-btn
                                type="submit"
                                color="primary"
                                :disabled="loginRequesting"
                            >
                                Login
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</v-content>
</template>

<script>
import buildUrl from 'build-url';
import CryptoJS from 'crypto-js';

import { mapActions } from '@/store';
import ErrorMessage from '@/components/ErrorMessage.vue';

const BACKEND_SEMPI = 'sempi';
const BACKEND_WITH_TOKEN = 'with_token';
const BACKEND_WITH_USER_PASSWORD = 'with_user_password';

const BACKENDS = [
    BACKEND_SEMPI,
    BACKEND_WITH_TOKEN,
    BACKEND_WITH_USER_PASSWORD,
];

function removeIllegalCharacters(input) {
    return input
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}


function base64object(input) {
    const inputWords = CryptoJS.enc.Utf8.parse(JSON.stringify(input));
    const base64 = CryptoJS.enc.Base64.stringify(inputWords);
    return removeIllegalCharacters(base64);
}

export default {
    name: 'LoginPage',
    components: {
        ErrorMessage,
    },

    data() {
        return {
            valid: true,
            loginRequesting: false,
            // BACKEND_WITH_TOKEN
            secretKey: '',
            email: '',
            firstName: '',
            lastName: '',
            // other backends
            username: '',
            password: '',
            secretKeyRules: [
                v => !!v || 'Secret key is required',
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            firstNameRules: [
                v => !!v || 'First name is required',
            ],
            lastNameRules: [
                v => !!v || 'Last name is required',
            ],
            usernameRules: [
                v => !!v || 'Username is required',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
            ],
            ...this.mapState({
                authConfig: 'common.authConfig',
                projectId: 'common.projectId',
                workspaceId: 'common.workspaceId',
                workspaceName: 'common.workspaceName',
            }),
        };
    },

    computed: {
        showTokenForm() {
            // Use for login with token.
            // TODO: Deprecated. Remove later.
            // return this.authConfig.backend === BACKEND_WITH_TOKEN;
            return false;
        },

        isValidBackend() {
            return BACKENDS.includes(this.authConfig.backend);
        },

        loginUrl() {
            let path;
            switch (this.authConfig.backend) {
            case BACKEND_WITH_USER_PASSWORD:
                path = `${this.projectId}/auth/login/password`;
                break;
            case BACKEND_SEMPI:
                path = `${this.projectId}/auth/login/sempi`;
                break;
            case BACKEND_WITH_TOKEN:
                // Use for login with token.
                // TODO: Deprecated. Remove later.
                // path = `${this.projectId}/auth/login/token`;
                path = `${this.projectId}/auth/login/password`;
                break;
            default:
                throw new Error('Unsupported authentication backend');
            }
            return buildUrl(process.env.VUE_APP_BACKEND_API, { path });
        },

        signedToken() {
            const header = {
                alg: 'HS256',
                typ: 'JWT',
            };
            const data = {
                email: this.email,
                first_name: this.firstName,
                last_name: this.lastName,
            };
            const unsignedToken = `${base64object(header)}.${base64object(data)}`;
            const signatureHash = CryptoJS.HmacSHA256(unsignedToken, this.secretKey);
            const signature = CryptoJS.enc.Base64.stringify(signatureHash);
            return `${unsignedToken}.${signature}`;
        },

        formData() {
            const form = new FormData();
            if (this.showTokenForm) {
                form.append('token', this.signedToken);
            } else {
                form.append('username', this.username);
                form.append('password', this.password);
            }
            return form;
        },
    },

    mounted() {
        if (!this.workspaceId) {
            this.$router.push({ name: 'select-workspace' });
        }
    },

    methods: {
        ...mapActions({
            authenticate: 'auth/authenticate',
            setError: 'common/setError',
        }),

        submit() {
            this.setError(null);
            if (this.$refs.form.validate()) {
                this.login();
            }
        },

        login() {
            this.loginRequesting = true;

            fetch(this.loginUrl, {
                method: 'POST',
                cache: 'no-cache',
                body: this.formData,
            }).then((response) => {
                this.loginRequesting = false;
                if (response.status === 200) {
                    response.json().then((data) => {
                        this.loginWithToken(data.access_token, data.user_id);
                    });
                } else if (response.status === 401) {
                    // FIXME: Show form validation error
                    this.setError('Incorrect password');
                } else {
                    response.json().then((data) => {
                        this.setError(data.detail);
                    });
                }
            });
        },

        loginWithToken(accessToken, userId) {
            this.authenticate([accessToken, userId, this.workspaceId]);

            if (this.$route.query.next) {
                this.$router.replace(this.$route.query.next);
            } else {
                this.$router.replace({
                    name: 'search', params: { workspaceId: this.workspaceId },
                });
            }
        },
    },
};
</script>
