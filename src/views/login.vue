<script>
// https://bootsnipp.com/snippets/7nk08
import "animate.css";
import { defineComponent } from "vue";
import router from "../router/index.js";

export default defineComponent({
  data() {
    return {
      error: false,
      email: null,
      pass: null,
    };
  },
  computed: {
    shaking() {
      if (this.error) {
        return "animate__animated animate__shakeX";
      }

      return "";
    },
  },
  methods: {
    login() {
      this.error = false;

      request(
        "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.pass,
          }),
        },
        (err, data) => {
          console.log(err || data);

          if (err) {
            this.error = true;
          } else {
            if (data.success && data.token) {
              localStorage.setItem("x-auth-token", data.token);

              setTimeout(() => {
                router.replace({
                  path: "/dashboard",
                });
              }, 1);
            } else {
              this.error = true;
            }
          }
        }
      );
    },
  },
});
</script>


<template>
  <div>
    <div class="sidenav">
      <div class="login-main-text">
        <h2>OpenHaus</h2>
        <p>Login to access the OpenHaus SmartHome/IoT instance.</p>
        <p>
          If you dont have any credentials ask the Administrator to create a
          account for you.
        </p>
        <p>
          When you are the Admin,
          <a
            href="https://docs.open-haus.io/#/administration/configuration"
            target="_blank"
            >create</a
          >
          a local Administrator account.
        </p>
      </div>
    </div>
    <div class="main">
      <div class="col-md-6 col-sm-12">
        <div class="login-form" v-bind:class="shaking">
          <form>
            <div class="form-group mb-3">
              <label><h4>E-Mail Address</h4></label>
              <input
                type="text"
                class="form-control"
                placeholder="user@example.com"
                v-model="email"
              />
            </div>
            <div class="form-group mb-3">
              <label><h4>Password</h4></label>
              <input
                type="password"
                class="form-control"
                placeholder="****************"
                v-model="pass"
              />
            </div>
            <button
              type="submit"
              v-on:click.prevent="login()"
              class="btn btn-block w-100 btn-black"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope>
.main-head {
  height: 150px;
  background: #fff;
}

.sidenav {
  height: 100%;
  background-color: #000;
  overflow-x: hidden;
  padding-top: 20px;
}

.main {
  padding: 0px 10px;
}

@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
}

@media screen and (max-width: 450px) {
  .login-form {
    margin-top: 10%;
  }

  .register-form {
    margin-top: 10%;
  }
}

@media screen and (min-width: 768px) {
  .main {
    margin-left: 40%;
  }

  .sidenav {
    width: 25%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
  }

  .login-form {
    margin-top: 60%;
  }

  .register-form {
    margin-top: 20%;
  }
}

.login-main-text {
  margin-top: 20%;
  padding: 60px;
  color: #fff;
}

.login-main-text h2 {
  font-weight: 300;
}

.btn-black {
  background-color: #000 !important;
  color: #fff;
}
</style>
