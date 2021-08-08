<template>
  <div class="todos">
    <div v-if="error">{{ error }}</div>
    <div v-if="loading">Loading todos ...</div>
    <div else>
      <ul>
        <li v-for="todo in data" :key="todo.id">
          {{ todo.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

function useFetch() {
  const data = ref([]);
  const loading = ref(false);
  const error = ref(null);

  function fetchData(url, options = {}) {
    return fetch(url, options)
      .then((response) => response.json())
      .then((json) => {
        // avec ref(), il faut impérative utiliser la propriété "value",
        // cela permet à Vue de détecter le changement de valeur et de re-rendre le template
        data.value = json;
        loading.value = false;
        return json;
      })
      .catch((err) => {
        error.value = err;
        loading.value = false;
        throw new Error(err);
      });
  }

  return { data, error, loading, fetchData };
}

export default {
  setup() {
    const { fetchData, data, error, loading } = useFetch();
    fetchData("https://jsonplaceholder.typicode.com/todos");
    return { data, error, loading };
  },
};
</script>
