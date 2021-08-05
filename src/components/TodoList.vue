<script>
import {inject, onMounted, ref, watchEffect} from 'vue'
import { deleteStorage, selectStorage, updateStorage } from '../libraries/storageMethods'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name:'TodoList',
  components:{
    'font-awesome-icon':FontAwesomeIcon
  },
  setup() {
    const KEYAPP = inject('KEYAPP');
    const todoInserted = inject('todoInserted');
    const todoList = ref([]);
    
    library.add([faTimes,faTrashAlt,faSortUp,faSortDown]);
    
    function deleteTodo(id) {
      deleteStorage(KEYAPP,'list', id)
      orderPosition()
      todoList.value = selectStorage(KEYAPP,'list') 
    }

    function loadTodoList() {
      if(Array.isArray(todoList.value) && todoList.value.length > 0){
        return todoList.value
      }

      todoList.value = selectStorage(KEYAPP,'list',null,null,['position|asc'])
    }

    function updateTodo(event) {
      updateStorage(
        KEYAPP,
        'list',
        event.currentTarget.value,
        {checked : (event.currentTarget.checked) ? 1 : 0}
      )

      todoList.value = selectStorage(KEYAPP,'list',null,null,['position|asc'])
    }

    function upPosition(id) {
      const todo = selectStorage(KEYAPP,'list',null,['id|===|'+id])
      
      if(todo.position > 1){
        const todoAhead = selectStorage(KEYAPP, 'list',null,['position|<|'+todo.position],['position|desc'])[0]
        if(todoAhead !== null && todoAhead !== undefined){
          updateStorage(KEYAPP, 'list', todoAhead.id, {position:++todoAhead.position})
          updateStorage(KEYAPP, 'list', todo.id, {position:--todo.position})
          todoList.value = selectStorage(KEYAPP,'list',null,null,['position|asc'])
        }
      }
    }

    function downPosition(id) {
      const todo = selectStorage(KEYAPP,'list', null, ['id|===|'+id])
      const storageList = selectStorage(KEYAPP,'list')

      if(todo.position < storageList.length)
      {
        const todoAhead = selectStorage(KEYAPP, 'list',null,['position|>|'+todo.position],['position|asc'])[0]
        if(todoAhead !== null && todoAhead !== undefined){
          updateStorage(KEYAPP, 'list', todoAhead.id, {position:--todoAhead.position})
          updateStorage(KEYAPP, 'list', todo.id, {position:++todo.position})
          todoList.value = selectStorage(KEYAPP,'list',null,null,['position|asc'])
        }
      }
    }

    function orderPosition() {
      const storageList = selectStorage(KEYAPP,'list',null,null,['position|asc'])
      const result = storageList.map((item, index) => {
        item.position = ++index
        return item
      })

      localStorage.setItem(KEYAPP+'/'+'list', JSON.stringify(result))
    }

    onMounted(() => loadTodoList())
    watchEffect(() => todoList.value = todoInserted.value)

    return {
      deleteTodo,
      updateTodo,
      upPosition,
      downPosition,
      todoList
    }
  },
}
</script>

<template>
  <div>
    <ul class="shadow-xl bg-white p-2 rounded-md flex-row">
      <li v-for="todo in todoList" :key="todo.id" class="mb-4 border-solid border-b-2 border-gray-200">
        <a href="" class="float-left mr-3 -mt-1 p-0.5" @click="() => deleteTodo(todo.id)"><font-awesome-icon :icon="['far', 'trash-alt']" size="md" /></a>
        <input type="checkbox" class="mr-3 rounded-md box-border h-4 w-4" :value="todo.id" @change="updateTodo" :checked="todo.checked == 1 ? true : false">
        <span :class="todo.checked == 1 ? 'text-gray-400 line-through' : 'text-black'+' align-baseline'" v-html="todo.value"></span>
        <div class="float-right -mt-2">
          <a class="overflow-hidden block" href="" @click="() => upPosition(todo.id)"><font-awesome-icon icon="sort-up" size="lg"/></a>
          <a class="overflow-hidden block -mt-4" href="" @click="() => downPosition(todo.id)"><font-awesome-icon icon="sort-down" size="lg" /></a>
        </div>
      </li>
    </ul>
  </div>
</template>
