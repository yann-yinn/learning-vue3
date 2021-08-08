# Exemple simple: récupérer des donnés depuis une API

Commençons par exercie pratique, avec une des tâches les plus communes quand on crée une single page application avec Vue.js: récupérer des données depuis une API.

Nous allons comparer la version Vue 2 avec la version Vue 3 avec composition API pour que vous puissiez voir en un coup d'oeil la différence sur un exemple très simple.

Vue 2:

```html
<template>
  <div class="todos">
    <div v-if="error">{{ error }}</div>
    <div v-if="loading">Loading todos ...</div>
    <div else>
      <ul>
        <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Todos",
    data() {
      return {
        todos: [],
        loading: false,
        error: null,
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        return fetch("https://jsonplaceholder.typicode.com/todos")
          .then((response) => response.json())
          .then((json) => {
            this.todos = json;
            this.loading = false;
            return json;
          })
          .catch((err) => {
            this.error = err;
            this.loading = false;
            throw new Error(err);
          });
      },
    },
  };
</script>
```

Vue 3:

```html
<template>
  <div class="todos">
    <div v-if="error">{{ error }}</div>
    <div v-if="loading">Loading todos ...</div>
    <div else>
      <ul>
        <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { ref } from "vue";

  export default {
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
```

Arrivé ici, on pourrait se demander: qu'est ce que cette histoire ? Le code ne semble pas plus simple, plus court ou plus intuitif, quel intérêt de ce nouvelle syntaxe ?

La grande différence et toute la puissance du concept, on va le voir, c'est la possibilité de _composition_ :

Dans le cas de la composition API; on peut extraire très facilement le code contenu dans setup() dans une simple fonction JS, qui permettra ensuite de réutiliser la partie générique du code dans n'importe quel composant!

Voici un exemple rapide pour transformer notre code en fonction réutilisable par n'importe quel composant, nommée "composable" par la communauté Vue.js.

Nous allons donc d'abord extraire le code de la fonction setup en une fonction JS réutilisable:

```js
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
```

On a rendu au passage la fonction fetchData générique: elle est capable d'appeler n'importe quelle url désormais.

Voici maintenant à quoi ressemble le code de notre composant, qui fait appel à cette nouvelle fonction:

```js
export default {
  setup() {
    const { fetchData, data, error, loading } = useFetch();
    fetchData("https://jsonplaceholder.typicode.com/todos");
    return { data, error, loading };
  },
};
```

L'élégance de la composition API apparait ici,et on peut voir à quel point il a été simple de prendre du code de la méthode setup() pour en faire quelque chose de réutilisable. Dans tous nos prochains composants, nous pourrons réutilise cette fonction et ainsi avoir systématiquement les variables réactives `loading`, `error`, `data` déclarées puis mises à jour automatiquement! C'est tout la beauté des composables.

On le voir plus loin, une fonction composable peut faire bien plus que ça encore: elle peut déclarer des hooks de cycle de vie (mounted(), unmounted(), updated() etc), des propriétés `computed()`.

Bref, tout, absolument tout ce que vous pouvez faire avec l'option API, vous pouvez le faire dans la méthode setup() ou dans une fonction composable que vous pourrez ensuite appelez dans n'importe quel composant.

On se retrouve avec un système de factorisation du code extrêmement puissant qui va permettre une bien meilleure maintenance concernant les composants complexes et une meilleure réutilisabilité du code d'un composant à l'autre.

Pour les personnes qui connaissent Vue 2, ils auront perçus les points communs avec les mixins. La composition API reprend en effet les avantages des mixins (pouvoir définir et réutiliser des morceaux de composants de manière générique) mais en supprime tous les inconvénients.

Je ne sais pas ce que vous en pensez, mais personnellement je trouve le concept de composables est à la fois très simple (ce sont juste des fonctions) et très puissant: on peut organiser et factoriser notre code avec une liberté qui n'existait pas en Vue 2.

Bravo, nous venons de créer notre premier composable avec succès, il est temps de passer à la suite !
