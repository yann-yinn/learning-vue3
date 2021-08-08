<template>
  <div class="todos">
    <div v-if="error">{{ error }}</div>
    <div v-if="loading">Loading todos ...</div>
    <div else>
      <ul>
        <li v-for="todo in todos" :key="todo.id">
          {{ todo.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  // la méthode setup() n'est appelée qu'une unique fois, avant toutes les autres
  // options du composant. Le mot clef "this" n'est pas l'instance du composant dans
  // le contexte de cette méthode !
  setup() {
    const todos = ref(todos);
    const loading = ref(false);
    const error = ref(null);

    function fetchData() {
      loading.value = true;
      error.value = null;

      return fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((json) => {
          // avec ref(), il faut impérative utiliser la propriété "value",
          // cela permet à Vue de détecter le changement de valeur et de re-rendre le template
          todos.value = json;
          loading.value = false;
          return json;
        })
        .catch((err) => {
          error.value = err;
          loading.value = false;
          throw new Error(err);
        });
    }
    // fetchData sera appelé avant les hooks created ou mounted
    fetchData();

    return { todos, error, loading };
  },
};
</script>
