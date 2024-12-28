<template>
  <div>
    <header class="bg-dark-blue">
      <div class="containerr">
        <nav id="navbar">
          <h1 id="fato">faTo<span>DoList</span></h1>
        </nav>
      </div>
    </header>

    <div id="home">
      <img src="/f.jpg" alt="todolist" />
      <div id="div1" class="name">
        <div id="div2">
          <form class="mt-5">
            <div id="div3">
              <div id="div4" class="col-100">
                <h4 style="color: #d2624c">Todo girin:</h4>
                <br />
                <input
                  v-model="newTask"
                  type="text"
                  class="form-control form-control-md"
                  placeholder="Todo giriniz"
                />
                <button
                  @click="addTask"
                  type="submit"
                  class="btn custom-button2 mt-3"
                >
                  Todo Ekleyin
                </button>
                <hr />
              </div>

              <div class="col-100" id="div5">
                <h4 style="color: #d2624c">Todo Listeniz:</h4>
                <br />

                <div id="div7" class="d-flex">
                  <a
                    href="#"
                    @click.prevent="removeAll"
                    id="clearButtonAll"
                    class="btn custom-button3 mt-3 mr-3"
                  >
                    Tüm Todoları Temizle
                  </a>
                  <a
                    href="#"
                    @click.prevent="checkedAll"
                    id="allChecked"
                    class="btn custom-button3 mt-3 mr-3"
                  >
                    Tüm Todolar Yapıldı
                  </a>
                  <a
                    href="#"
                    @click.prevent="removeSelected"
                    id="clearButtonChecked"
                    class="btn custom-button3"
                  >
                    Yapılanları Temizle
                  </a>
                </div>
                <br />

                <!-- Todoları Listele -->
                <ul id="ul1" class="list-group">
                  <li
                    v-for="todo in todos"
                    :key="todo.id"
                    class="list-group-item d-flex justify-content-between"
                    :style="{
                      textDecoration: todo.checked ? 'line-through' : 'none',
                    }"
                  >
                    <span>{{ todo.gorevAdi }}</span>
                    <div class="d-flex">
                      <button
                        class="btn mr-2 custom-button"
                        @click="toggleChecked(todo)"
                      >
                        <font-awesome-icon icon="check-square" />
                      </button>
                      <button
                        class="btn custom-button"
                        @click="deleteTask(todo.id)"
                      >
                        <font-awesome-icon icon="trash-alt" />
                      </button>
                    </div>
                  </li>
                </ul>

                <hr />
              </div>
            </div>
          </form>
          <input
            v-model="searchTerm"
            type="text"
            class="form-control form-control-md"
            id="todoara"
            placeholder="Todo arayınız"
          />
          <button @click="searchTodo()" class="btn custom-button3 mt-3 mr-3">
            SEARCH
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faCheckSquare } from "@fortawesome/free-solid-svg-icons";

library.add(faTrashAlt, faCheckSquare);

export default {
  name: "TodoComponent",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      todos: [],
      newTask: "",
      searchTerm: "",
    };
  },

  methods: {
    async fetchAllTodos() {
      try {
        const response = await axios.get("http://localhost/fatodo/fatodo.php");
        this.todos = response.data;
      } catch (error) {
        console.error("Görevler alınırken bir hata oluştu:", error);
      }
    },

    async addTask(event) {
      event.preventDefault();

      const gorevAdi = this.newTask.trim();

      if (!gorevAdi) {
        alert("Lütfen bir görev girin.");
        return;
      }

      const data = {
        todo: gorevAdi,
        operation: "ekle",
      };

      try {
        const response = await axios.post(
          "http://localhost/fatodo/fatodo.php",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Yanıt:", response.data);

        if (response.data.hata) {
          alert(response.data.hata);
          return;
        }

        this.todos.push(response.data[response.data.length - 1]);
        this.newTask = "";
      } catch (error) {
        console.error("Hata oluştu:", error);
        alert("Bir hata oluştu.");
      }
    },

    async deleteTask(id) {
      try {
        const response = await axios.delete(
          "http://localhost/fatodo/fatodo.php",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: new URLSearchParams({
              id: id,
              operation: "delete_onetask",
            }),
          }
        );

        if (response.data.success) {
          this.todos = this.todos.filter((todo) => todo.id !== id);
        } else {
          console.error("Görev silinirken hata oluştu.");
        }
      } catch (error) {
        console.error("Görev silinirken hata oluştu:", error);
      }
    },

    // async searchTodo() {
    //   try {
    //     const response = await axios.post(
    //       "http://localhost/fatodo/fatodo.php",
    //       {
    //         headers: {
    //           "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //         data: new URLSearchParams({
    //           todo: this.searchTerm,
    //           operation: "search_onetask",
    //         }),
    //       }
    //     );

    //     if (response.data.success) {
    //       this.todos = response.data;
    //     } else {
    //       console.error("Görev aranırken hata oluştu.");
    //     }
    //   } catch (error) {
    //     console.error("Görev aranırken hata oluştu:", error);
    //   }
    // },

    async searchTodo() {
      var self = this;
      var form_data = new FormData();
      form_data.append("todo", this.searchTerm);
      form_data.append("operation", "search_onetask");
      await axios
        .post("http://localhost/fatodo/fatodo.php", form_data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          self.todos = response.data;
        });
    },

    async toggleChecked(todo) {
      const newChecked = todo.checked === 1 ? 0 : 1;

      try {
        const response = await axios.put(
          "http://localhost/fatodo/fatodo.php",
          new URLSearchParams({
            id: todo.id,
            operation: "check_item",
            checked: newChecked,
          })
        );

        if (response.data.success) {
          todo.checked = newChecked;
        } else {
          console.error("Görev güncellenirken hata oluştu.");
        }
      } catch (error) {
        console.error("Görev durumunu güncellerken hata oluştu:", error);
      }
    },

    async removeAll() {
      if (confirm("Tüm görevleri silmek istediğinize emin misiniz?")) {
        try {
          const response = await axios.delete(
            "http://localhost/fatodo/fatodo.php",
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              data: new URLSearchParams({
                operation: "delete_all",
              }),
            }
          );

          if (response.data.success) {
            this.todos = [];
          } else {
            console.error("Hata:", response.data.error);
          }
        } catch (error) {
          console.error("Tüm görevler silinirken hata oluştu:", error);
        }
      }
    },

    // Tüm görevleri işaretleme (yapıldı olarak)
    async checkedAll() {
      try {
        const response = await axios.put(
          "http://localhost/fatodo/fatodo.php",
          new URLSearchParams({
            checked: 1,
            operation: "check_all",
          })
        );

        console.log("API Yanıtı:", response.data);

        if (response.data && Array.isArray(response.data)) {
          this.todos = [...response.data];
        } else {
          console.error("Yanıtın beklenen yapısı hatalı:", response.data);
          alert("Hata: Yanıtın beklenen yapısı hatalı");
        }
      } catch (error) {
        console.error("Tüm görevler işaretlenirken hata oluştu:", error);
        alert("Ağ hatası: " + error.message);
      }
    },

    // Sadece üstü çizili görevleri silme
    async removeSelected() {
      try {
        const response = await axios.delete(
          "http://localhost/fatodo/fatodo.php",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: new URLSearchParams({
              operation: "check_delete",
            }),
          }
        );

        if (response.data.success) {
          console.log("Görevler başarıyla silindi.");

          const todos = await this.fetchAllTodos();
          console.log("Todos:", todos);

          if (todos && Array.isArray(todos)) {
            const filteredTodos = todos.filter((todo) => todo.checked === 0);
            this.displayTodos(filteredTodos);
          } else {
            console.error("Görevler alınamadı veya geçersiz format:", todos);
          }
        } else {
          console.error(response.data.error);
        }
      } catch (error) {
        console.error("Görevler silinirken hata oluştu:", error);
      }
    },
  },
  mounted() {
    this.fetchAllTodos();
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* body{
      background-image: url("todoGelistirilmis/todo.png");
      background-size: 100px;
  } */
/*
  
  h4{
      color: ;
  } */
a {
  text-decoration: none;
  color: white;
}

#fato {
  /* color: #487683 */
  color: #1f3250;
}

span {
  /* color: #B7C29F; */
  color: #d2624c;
}

#navbar {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75rem;
  height: 100px;
}

#navbar ul {
  list-style-type: none;
  display: flex;
  align-items: center;
}

#navbar ul li {
  border-radius: 4px;
  background-color: rgb(227, 231, 124);
  padding: 0.75rem;
}

#navbar ul li a {
  padding: 0.75rem;
  color: #336ea2;
}

#navbar ul li a:hover {
  background-color: #336ea2;
  border-radius: 4px;
  color: rgb(227, 231, 124);
}

#home {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

#home img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Resmin kesilmesini engelleyerek sayfayı kaplaması */
  z-index: -1;
  /* Resmin arka planda kalması */
}

#home .name,
#home a {
  position: relative;
  z-index: 1;
}

.name {
  height: 50%;
  width: 50%;
  /* background: rgba(241, 243, 181, 0.812); */
  opacity: 0.9;
}

html {
  font-family: "Open Sans", "sans-serif";
}

/*!! cutsom buttonlar bootstrap butonlarını düzenlemek için yazıldı */
.custom-button1 {
  width: 100px;
  height: 40px;
  font-size: 16px;
  padding: 10px 20px;
  color: #d2624c;
  background-color: #1f3250;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.custom-button1:hover {
  background-color: #d2624c;
  color: #1f3250;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.custom-button2 {
  width: 120px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  background-color: #d2624c;
  color: #1f3250;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.custom-button2:hover {
  color: #d2624c;
  background-color: #1f3250;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.custom-button3 {
  width: 200px;
  height: 40px;
  font-size: 16px;
  padding: 10px 20px;
  background-color: #d2624c;
  color: #1f3250;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.custom-button3:hover {
  color: #d2624c;
  background-color: #1f3250;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.custom-button {
  width: 50px;
  height: 40px;
  color: #d2624c;
  background-color: #1d3051;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.custom-button:hover {
  background-color: #d2624c;
  color: #1f2f48;
  justify-content: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

ul li.checked {
  text-decoration: line-through;
}

/* ul li.checked::before{
      text-decoration: none;
  
  } */

ul li {
  cursor: pointer;
  /* Kullanıcıya tıklanabilir olduğunu gösterir */
}

/*text*/
.text-center {
  text-align: center;
}

.heading-small {
  font-size: 1.25rem;
}

.heading-medium {
  font-size: 1.5rem;
}

.heading-big {
  font-size: 1.75rem;
}

/* color */
.bg-dark-blue {
  /* background-color: #062e51; */
  background-color: #111230;
}

.bg-light-blue {
  background-color: #336ea2;
}

/* container */

.containerr {
  max-width: 200px;
  margin: 0 auto;
}
</style>
