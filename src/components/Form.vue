<script>
import { computed, inject, provide, ref } from "vue";
import TodoList from './TodoList.vue';
import { insertStorage, getStorageLength, selectStorage } from "../libraries/storageMethods";

export default {
  name:'Form',
  components: {
    TodoList
  },
  setup() {
    const todo = ref('');
    const todoList = ref([]);
    const KEYAPP = inject('KEYAPP');


    provide('todoInserted',computed(() => todoList.value));

    function handleClick() {
      todo.value !== null &&
      todo.value.length > 0
        ? insertTodo(todo.value)
        : null;
    };

    function handleKeyUp(event) {
      event.keyCode === 13 ? insertTodo(todo.value) : null;
    };

    function clearInput() {
      todo.value = "";
    };

    function insertTodo(todo) {
      todo.length >= 3
        ? (function(todo) {
            const positionValue = getStorageLength(KEYAPP, "list") + 1;
            insertStorage(KEYAPP, "list", {
              value: todo,
              checked: 0,
              position: positionValue,
            });
            clearInput();
            todoList.value = selectStorage(KEYAPP, 'list', null, null, ['position|asc']);
          })(todo)
        : null;
    };

    return {
      handleClick,
      handleKeyUp,
      todo,
    };
  },
};
</script>

<template>
  <div>
    <div class="shadow-xl bg-white rounded-md p-3 mb-5 flex-row"> 
      <input class="rounded-sm focus:outline-none w-8/12" type="text" v-model="todo" @keyup="handleKeyUp" />
      <button class="shadow-md bg-blue-700 rounded font-black text-white w-1/4 float-right" type="button" @click="handleClick">OK</button>
    </div>
    <TodoList></TodoList>
  </div>
</template>
