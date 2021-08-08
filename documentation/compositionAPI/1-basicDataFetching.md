# Exemple simple: récupérer des donnés depuis une API

Entrons dans le vif du sujet en codant une des tâches les plus communes quand on code en Vue.js: récupérer des données depuis une API.

Voici, de manière simplfiée, ce que nous ferions en Vue 2, avec **l'option API**. Si vous ne savez pas ce qu'est l'option API, c'est tout simplement la manière dont on code des composants en Vue 2, comme ci-dessous, en déclarant des méthodes et propriétés telles que `data()`, `created()`, `computed()`, `watch` etc

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
    // création des variables réactives
    data() {
      return {
        todos: [],
        loading: false,
        error: null,
      };
    },
    // on moment de la création du composant, on va chercher les données
    created() {
      this.fetchData();
    },
    methods: {
      // récupérer les données depuis une API externe avec fetch()
      fetchData() {
        this.loading = true;
        this.error = false;
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

Voici l'équivalent en Vue 3, en utilisant la **composition API** grâce la nouvelle méthode `setup()`. Côté template, rien ne change cet exemple, les différences concernant la partie JavaScript.

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
      // création des variables réactives
      const todos = ref(todos);
      const loading = ref(false);
      const error = ref(null);

      // création de la méthode pour récuper les données depuis l'API
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

      // on exécute fetchData(), qui sera appelé avant même les hooks created() ou mounted()
      fetchData();

      // Et on oublie pas de retourner nos variables au template !
      return { todos, error, loading };
    },
  };
</script>
```

Arrivé ici, certain-e-s se demanderont peut être: qu'est ce que ces salmigondis, où est le progrès ?

Le code de vue 3 ne semble pas, à première vue, plus simple, plus court ou plus intuitif, quel est donc l'intérêt de cette nouvelle syntaxe ?

La grande différence et l'intérêt de cette nouvelle syntaxe, on va le voir, c'est la possibilité de **composition** et de réutilisation du code que ça permet.

Dans le cas de la _composition API_; on peut refactoriser très facilement notre code de la fonction `setup()` pour en faire une fonction JS indépendante (un "composable"), qui permettra ensuite de réutiliser notre code dans n'importe quel autre composant de manière générique.

Exemple:

```js
// fichier: @/use/fetch.js

import { ref } from "vue";

export default function useFetch() {
  const data = ref([]);
  const loading = ref(false);
  const error = ref(null);

  function fetchData(url, options = {}) {
    return fetch(url, options)
      .then((response) => response.json())
      .then((json) => {
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

On a rendu la fonction fetchData générique: elle est désormais capable d'appeler n'importe quelle url. Elle est toujours reponsable de créer et mettre à jour les variables réactive `loading` et `error` en fonction de la réponse de fetch()

Voyons maintenant à quoi ressemble le code de notre composant, qui fait appel à cette nouvelle fonction:

```js
import useFetch from "@/use/fetch";

export default {
  setup() {
    const { fetchData, data, error, loading } = useFetch();
    fetchData("https://jsonplaceholder.typicode.com/todos");
    return { data, error, loading };
  },
};
```

Voilà qui est déjà plus satisfaisant et élégant, et cerise sur le gateau, nous pourrons réutilise cette fonction dans n'importe quel autre composant, et ainsi avoir systématiquement les variables réactives `loading`, `error`, `data` déclarées puis mises à jour automatiquement.

On le voir plus loin, mais sachez dès à présent qu'une fonction composable peut faire bien plus que ça encore: elle peut déclarer des hooks de cycle de vie (mounted(), unmounted(), updated() etc), des propriétés `computed()` !

Bref, tout, absolument tout ce que vous pouvez faire avec l'option API, vous pouvez le faire dans la méthode setup() ou dans une fonction composable que vous pourrez ensuite appelez dans n'importe quel composant.

Pour les personnes qui connaissent Vue 2, ils auront perçus les points communs avec les mixins. La composition API reprend en effet les avantages des mixins (pouvoir définir et réutiliser des morceaux de composants de manière générique) mais en supprime tous les inconvénients.

Bravo, nous venons de créer notre premier composable avec succès, il est temps de passer à la suite pour augmenter nos nouveaux supers pouvoirs.
